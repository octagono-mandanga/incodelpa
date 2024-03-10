import { Component, OnInit } from '@angular/core';
import { Entity } from 'src/app/model/entity';
import { Role } from 'src/app/model/role';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-roles',
  templateUrl: './root-roles.component.html',
  styleUrls: ['./root-roles.component.css']
})
export class RootRolesComponent implements OnInit {
  public config: any
  public data: Role[] = []
  constructor(
    private crudService: CrudService<Role>
  ) {
    this.config = {
      columns: [
        { key: 'name', displayName: 'Nombre' },
      ],
      actions: {
        'add': '/root/roles/add',
        'edit': '/root/roles/edit/',
        'delete': false,
      }
    };
  }
  ngOnInit(): void {
    this.crudService.read('/root/roles').subscribe({
      next: (data: Role[]) => {
       this.data = data
      },
      error: (error) => {
        console.error('Error al obtener los roles:', error);
      }
    });
  }

  onBorrar(id: any){
    this.crudService.delete('/root/roles/'+ id).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(r => r.id !== id);
      },
      error: (error) => {
        console.error('Error al obtener los roles:', error);
      }
    });
  }
}
