import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/model/role';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-roles-add',
  templateUrl: './root-roles-add.component.html',
  styleUrls: ['./root-roles-add.component.css']
})
export class RootRolesAddComponent  implements OnInit {
  public config: any

  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Role

  constructor(
    public crudService: CrudService<Role>
  ){}
  ngOnInit(): void {
    this.config = {
      columns: [
        { key: 'name', displayName: 'Nombre', required: true, type: 'text' },
        /*
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
        */
      ],
      actions: {

      }
    };
  }
  onAgregar(data: any){
    this.crudService.create(data, '/root/roles').subscribe({
      next: (res: any) => {
       this.data = new Role
       this.message = res.message
       this.success = true
      },
      error: (error) => {
        this.message = 'Error al crear el rol : '+error
        this.success = false
      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
}
