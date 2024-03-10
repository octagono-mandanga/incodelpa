import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Curso } from 'src/app/model/curso';
import { Matricula } from 'src/app/model/matricula';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-secretaria-alumnos-modify',
  templateUrl: './secretaria-alumnos-modify.component.html',
  styleUrls: ['./secretaria-alumnos-modify.component.css']
})
export class SecretariaAlumnosModifyComponent  implements OnInit {


  public loading: boolean = false
  public id!: string
  public config: any
  public data!: User
  public cursos: Curso[] = []
  public nuevoCurso: Curso = new Curso
  public matriculas: Matricula[] = []
  public matricula: Matricula = new Matricula
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true

  public paso:  number = 1
  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<User>,
    private crudMatriculaService: CrudService<Matricula>,
    private crudCursoService: CrudService<Curso>,
  ){}
  ngOnInit(): void {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'curso', displayName: 'Curso', required: true, type: 'select', options: [] },
        { key: 'alumno', type: 'hidden' },
      ],
      actions: {}
    };
    this.cargarMatricula()
  }
  async cargarMatricula(){
    this.cursos = []
    await this.crudService.read('/secretaria/alumnos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.matriculas = res.data.matriculas;
        this.matricula = this.matriculas.find(item => item.estado==='activo') as Matricula
        this.cargarCursos()
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  cargarCursos() {
    this.crudCursoService.read('/secretaria/cursos').subscribe({
      next: (res: any) =>{
        this.cursos = res
        const opcionesActivas =  this.cursos
        .filter(entidad => (entidad.estado === 'activo') &&(entidad.id != this.matricula.curso.id))
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nombre + ' [' + entidad.grado.nombre +']'
        }));
        // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones
        const campoCurso = this.config.columns.find((col: any) => col.key === 'curso');
        if (campoCurso) {
          campoCurso.options = opcionesActivas;
        }
        this.loading = false
      },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async onEvento(event: any){
    switch(event.paso) {
      case 1:
        this.loading = true
        await this.crudService.read('/secretaria/cursos/'+event.data.curso).subscribe({
          next: (res: any) => {
            this.loading = false
            this.nuevoCurso = res.data
            //this.matriculas = res.data.matriculas;


           },
           error: (error) => {
             this.message = 'Error al cargar el curso : '+error
             this.success = false
             this.loading = false
           }
        })
        this.paso = 2
      break;
      case 2:
        this.loading = true
        this.matricula.curso = event.data
        await this.crudMatriculaService.update(this.matricula, '/secretaria/matricula/'+this.matricula.id).subscribe({
          next: (res: any) => {
            this.loading = false
            this.matricula = res.data;
           },
           error: (error) => {
             this.message = 'Error al cargar el curso : '+error
             this.success = false
             this.loading = false
           }
        })
      break;
    }

  }
}
