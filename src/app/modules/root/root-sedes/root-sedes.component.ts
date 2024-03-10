import { Component, OnInit } from '@angular/core';
import { Sede } from 'src/app/model/sede';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-sedes',
  templateUrl: './root-sedes.component.html',
  styleUrls: ['./root-sedes.component.css']
})
export class RootSedesComponent implements OnInit {
  public config: any
  public data: Sede[] = []
  public message!: string
  public loading: boolean = false
  public success: boolean = true

  constructor(
    private crudService: CrudService<Sede>
  ) {
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'direccion', displayName: 'Dirección' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/root/sedes/add',
        'edit': '/root/sedes/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/sedes').subscribe({
      next: (data: Sede[]) => {
        this.loading = false
        this.data = data
      },
      error: (error) => {
        console.error('Error al obtener las sedes:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/root/sedes/'+ id).subscribe({
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
}
