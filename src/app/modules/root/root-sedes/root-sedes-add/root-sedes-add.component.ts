import { Component, OnInit } from '@angular/core';
import { Sede } from 'src/app/model/sede';
import { CrudService } from 'src/app/service/crud.service';


@Component({
  selector: 'app-root-sedes-add',
  templateUrl: './root-sedes-add.component.html',
  styleUrls: ['./root-sedes-add.component.css']
})
export class RootSedesAddComponent  implements OnInit {
  public config: any

  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Sede

  constructor(
    public crudService: CrudService<Sede>
  ){}
  ngOnInit(): void {
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        { key: 'direccion', displayName: 'Direccion', required: true, type: 'text' },
        {
          key: 'estado',
          displayName: 'Estado',
          type: 'select',
          options: [
            { value: 'activo', displayValue: 'Activo' },
            { value: 'inactivo', displayValue: 'Inactivo' }
          ],
          required: true
        },
      ],
      actions: {

      }
    };
  }

  onAgregar(data: any){
    this.loading = true
    this.crudService.create(data, '/root/sedes').subscribe({
      next: (res: any) => {
       this.data = new Sede
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el nivel : '+error
        this.success = false
        this.loading = false
      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
}
