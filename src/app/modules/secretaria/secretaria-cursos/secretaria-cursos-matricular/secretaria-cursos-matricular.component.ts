import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { Materia } from 'src/app/model/materia';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-secretaria-cursos-matricular',
  templateUrl: './secretaria-cursos-matricular.component.html',
  styleUrls: ['./secretaria-cursos-matricular.component.css']
})
export class SecretariaCursosMatricularComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public loading2: boolean = false
  public data!: Curso
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []

  public matriculados: User[] = []

  public searchList: User[] = []


  /**
   * Formulario
   */



  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<Asignacion>,
    private fb: FormBuilder
  ){}
  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']

    await this.crudService.read('/secretaria/cursos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.matriculados = res.data.matriculas.map((matricula: any) => matricula.alumno);
        this.ordenarMatriculados()
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
    /*
    await this.crudAsignacionService.read('/secretaria/asignaciones/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.disponibles = res.disponibles
        this.asignaciones = res.asignaciones

        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
    */
  }

  onSearch(){}

  async onEvent(event: any){
    if(event.term){
      this.loading2 = true
      await this.crudService.read('/secretaria/alumnos/search/'+event.term).subscribe({
        next: (res: any) => {
          this.searchList = res.data;
          this.loading2 = false
         },
         error: (error) => {
           this.message = 'Error al cargar el curso : '+error
           this.success = false
           this.loading = false
         }
      })
    } else if(event.user) {
      this.router.navigate(['/secretaria/alumnos/view/', event.user])
    }
  }

  ordenarMatriculados(): void {
    this.matriculados.sort((a, b) => {
      const apellidoA = a.primer_apellido + a.segundo_apellido;
      const apellidoB = b.primer_apellido + b.segundo_apellido;
      const nombreA = a.primer_nombre + a.segundo_nombre;
      const nombreB = b.primer_nombre + b.segundo_nombre;

      if (apellidoA < apellidoB) return -1;
      if (apellidoA > apellidoB) return 1;
      // Si los apellidos son iguales, entonces compara por nombre
      if (nombreA < nombreB) return -1;
      if (nombreA > nombreB) return 1;
      return 0; // Los nombres y apellidos son iguales
    });
  }


}
