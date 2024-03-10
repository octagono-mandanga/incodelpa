import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { Materia } from 'src/app/model/materia';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-cursos-view',
  templateUrl: './coordinacion-cursos-view.component.html',
  styleUrls: ['./coordinacion-cursos-view.component.css']
})
export class CoordinacionCursosViewComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public data!: Curso
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<Asignacion>,
  ){}
  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    await this.crudService.read('/coordinacion/cursos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
    await this.crudAsignacionService.read('/coordinacion/asignaciones/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.disponibles = res.disponibles
        this.asignaciones = res.asignaciones
        console.log("Data...", res)
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }
}
