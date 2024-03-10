import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-alumnos',
  templateUrl: './coordinacion-alumnos.component.html',
  styleUrls: ['./coordinacion-alumnos.component.css']
})
export class CoordinacionAlumnosComponent implements OnInit {
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
        { key: 'avatar_url', displayName: 'Foto' },
        { key: 'primer_nombre', displayName: 'Nombres' },
        { key: 'segundo_nombre', displayName: '' },
        { key: 'primer_apellido', displayName: 'Apellidos' },
        { key: 'segundo_apellido', displayName: '' },
        { key: 'email', displayName: 'Email' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/coordinacion/alumnos/add',
        'edit': '/coordinacion/alumnos/edit/',
        'view': '/coordinacion/alumnos/view/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/coordinacion/alumnos').subscribe({
      next: (data: User[]) => {
        this.data = data
        this.loadRoles()
      },
      error: (error) => {
        this.loading = false
        console.error('Error al obtener los alumnos:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/coordinacion/cursos/'+ id).subscribe({
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
    this.crudRoleService.read('/coordinacion/alumnos').subscribe({
      next: (data: Role[]) => {
        this.roles = data
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        console.error('Error al obtener los roles:', error);
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
