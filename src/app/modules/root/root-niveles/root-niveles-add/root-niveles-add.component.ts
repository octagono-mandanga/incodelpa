import { Component, OnInit } from '@angular/core';
import { Nivel } from 'src/app/model/nivel';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-niveles-add',
  templateUrl: './root-niveles-add.component.html',
  styleUrls: ['./root-niveles-add.component.css']
})
export class RootNivelesAddComponent  implements OnInit {
  public config: any

  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Nivel

  constructor(
    public crudService: CrudService<Nivel>
  ){}
  ngOnInit(): void {
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
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
    this.crudService.create(data, '/root/niveles').subscribe({
      next: (res: any) => {
       this.data = new Nivel
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
