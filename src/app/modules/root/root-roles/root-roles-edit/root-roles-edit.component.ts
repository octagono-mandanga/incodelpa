import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Role } from 'src/app/model/role';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-roles-edit',
  templateUrl: './root-roles-edit.component.html',
  styleUrls: ['./root-roles-edit.component.css']
})
export class RootRolesEditComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Role

  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService<Role>){

  }
  ngOnInit(): void {
    this.config = {
      columns: [
        { key: 'name', displayName: 'Nombre', required: true, type: 'text' },
      ],
      actions: {

      }
    };

    this.loading = true
    this.id = this.route.snapshot.params['id']
    this.crudService.read('/root/roles/'+this.id).subscribe({
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
    this.crudService.update(data, '/root/roles/'+this.id).subscribe({
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
