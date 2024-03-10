import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Sede } from 'src/app/model/sede';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-sedes-edit',
  templateUrl: './root-sedes-edit.component.html',
  styleUrls: ['./root-sedes-edit.component.css']
})
export class RootSedesEditComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Sede

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService<Sede>
    ){

  }
  ngOnInit(): void {
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Nombre', type: 'text' },
        { key: 'direccion', displayName: 'Dirección', type: 'text' },
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

    this.loading = true
    this.id = this.route.snapshot.params['id']
    this.crudService.read('/root/sedes/'+this.id).subscribe({
      next: (response: any) => {
        this.data = response.data
        this.loading = false
      },
      error: (error) => {
        this.message = 'Error al obtener los datos '+ error;
        this.success = false
      }
    });

  }

  onEditar(data: any){
    this.loading = true
    this.crudService.update(data, '/root/sedes/'+this.id).subscribe({
      next: (response: any) => {
        this.data = response.data
        this.message = response.message
        this.success = true
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        this.message = 'Error al actualizar '+ error;
        this.success = false
      }
    })
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

}
