import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/model/role';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-usuarios',
  templateUrl: './root-usuarios.component.html',
  styleUrls: ['./root-usuarios.component.css']
})

export class RootUsuariosComponent implements OnInit {
  public data: User[] = []
  public filter: User[] = []
  public roles: Role[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudRoleService: CrudService<Role>,
    private crudService: CrudService<User>,
  ){}
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/usuarios').subscribe({
      next: (data: User[]) => {
        this.data = data
        this.loadRoles()
      },
      error: (error) => {
        this.loading = false
        console.error('Error al obtener los usuarios:', error);
      }
    });
  }
  loadRoles(){
    this.crudRoleService.read('/root/roles').subscribe({
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
