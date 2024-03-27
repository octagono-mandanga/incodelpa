import { Component, OnInit } from '@angular/core';
import { Asignacion } from 'src/app/model/asignacion';
import { CrudService } from 'src/app/service/crud.service';



@Component({
  selector: 'app-docente-cursos',
  templateUrl: './docente-cursos.component.html',
  styleUrls: ['./docente-cursos.component.css']
})

export class DocenteCursosComponent implements OnInit {
  public message!: string
  public success: boolean = true

  public loading: boolean = false

  public data: Asignacion[] = []



  constructor(
    private crudAsignacionService: CrudService<Asignacion>,
  ){}
  async ngOnInit() {
    this.loading = true

    await this.crudAsignacionService.read('/docente/asignacion').subscribe({
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
  }

}
