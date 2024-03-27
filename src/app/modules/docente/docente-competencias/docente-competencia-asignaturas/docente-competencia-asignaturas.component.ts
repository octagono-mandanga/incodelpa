import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Competencia } from 'src/app/model/competencia';
import { Materia } from 'src/app/model/materia';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-docente-competencia-asignaturas',
  templateUrl: './docente-competencia-asignaturas.component.html',
  styleUrls: ['./docente-competencia-asignaturas.component.css']
})
export class DocenteCompetenciaAsignaturasComponent implements OnInit {
  public id: string = ''
  public message: string = ''
  public msg: string = ''
  public loading: boolean = false
  public success: boolean = false
  public asignaturas: Materia[] = []

  constructor(
    private crudCompetenciaService: CrudService<Competencia>,
    private activedRoute: ActivatedRoute
  ){}

  ngOnInit() {
    this.id = this.activedRoute.snapshot.params['id']
    this.loading = true
    this.msg = 'Materias'
    this.crudCompetenciaService.read('/docente/materias').subscribe({
      next: (res: any) => {
        this.asignaturas = res.data
        this.loading = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar las asignaturas: '+error
         this.success = false
         this.loading = false
       }
    })
  }

}
