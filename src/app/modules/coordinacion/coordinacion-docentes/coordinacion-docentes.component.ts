import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-docentes',
  templateUrl: './coordinacion-docentes.component.html',
  styleUrls: ['./coordinacion-docentes.component.css']
})
export class CoordinacionDocentesComponent implements OnInit {
  public config: any

  public data: User[] = []
  public filter: User[] = []
  public roles: Role[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudRoleService: CrudService<Role>,
    private crudService: CrudService<User>,
  ){
    this.config = {
      columns: [
        { key: 'avatar_url', displayName: '-' },
        { key: 'primer_nombre', displayName: 'Nombres' },
        { key: 'segundo_nombre', displayName: '' },
        { key: 'primer_apellido', displayName: 'Apellidos' },
        { key: 'segundo_apellido', displayName: '' },
        { key: 'email', displayName: 'Email' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/coordinacion/docentes/add',
        'edit': '/coordinacion/docentes/edit/',
        'view': '/coordinacion/docentes/view/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/coordinacion/docentes').subscribe({
      next: (data: User[]) => {
        this.data = data
        this.loadRoles()
      },
      error: (error) => {
        this.loading = false
        console.error('Error al obtener los docentes:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/coordinacion/docentes/'+ id).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(r => r.id !== id);
        this.message = res.message
        this.success = false
        this.loading = false
      },
      error: (error) => {


        this.message = 'Error al actualizar '+ error;
        this.success = false
        this.loading = false

      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  loadRoles(){
    this.crudRoleService.read('/coordinacion/docentes').subscribe({
      next: (data: Role[]) => {
        this.roles = data
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        console.error('Error al obtener los docentes:', error);
      }
    });
  }
  onRole(idrol: string){
    this.filter = []
    this.filter = this.data.filter(user =>
      user.roles.some((role: any) => role.id === idrol)
    );
  }
}
