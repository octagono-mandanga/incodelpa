import { Component, OnInit } from '@angular/core';
import { Grado } from 'src/app/model/grado';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-grados',
  templateUrl: './root-grados.component.html',
  styleUrls: ['./root-grados.component.css']
})
export class RootGradosComponent implements OnInit {
  public config: any
  public data: Grado[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudService: CrudService<Grado>
  ) {
    this.config = {
      columns: [
        { key: 'nivel.nombre', displayName: 'Nivel' },
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/root/grados/add',
        'edit': '/root/grados/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/grados').subscribe({
      next: (data: Grado[]) => {
        this.data = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los grados:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/root/grados/'+ id).subscribe({
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
