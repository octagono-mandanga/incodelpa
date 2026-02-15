import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { User } from 'src/app/model/user';
import { Matricula } from 'src/app/model/matricula';
import { MatrizNotasAlumno } from 'src/app/model/matriz_notas_alumno';
import { Periodo } from 'src/app/model/periodo';
import { Escala } from 'src/app/model/escala';




interface MatriculaConNotas {
  idmatricula: any;
  periodos: Periodo[];
  escalas: Escala[];
  data: MatrizNotasAlumno;
}

@Component({
  selector: 'app-coordinacion-alumnos-view',
  templateUrl: './coordinacion-alumnos-view.component.html',
  styleUrls: ['./coordinacion-alumnos-view.component.css']
})
export class CoordinacionAlumnosViewComponent implements OnInit {
  public id!: string
  public msg!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: User
  public matriculas: Matricula [] = []
  public notas: MatriculaConNotas[] = []




  constructor(
    public activatedRoute: ActivatedRoute,
    public crudService: CrudService<User>,
    public crudMatriculaService: CrudService<Matricula>

  ){}
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id']
    this.msg = 'Alumno'
    this.loading = true
    this.crudService.read('/coordinacion/alumnos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        //this.loading = false
        this.msg = ''
        this.cargarMatriculas()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  cargarMatriculas() {
    this.msg = 'Matriculas'
    this.loading = true
    this.crudMatriculaService.read('/coordinacion/matriculas/alumno/'+this.id).subscribe({
      next: (res: any) => {
        this.matriculas = res.data
        this.matriculas.forEach((element: any) => {
          let item = new MatrizNotasAlumno
          item.setData(element.curso_r)
          this.notas.push({idmatricula: element.id,  periodos: element.periodos, escalas: element.escalas, data: item})
        });

        this.loading = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }



}
