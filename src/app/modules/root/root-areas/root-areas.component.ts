import { Component, OnInit } from '@angular/core';
import { Area } from 'src/app/model/area';
import { CrudService } from 'src/app/service/crud.service';
@Component({
  selector: 'app-root-areas',
  templateUrl: './root-areas.component.html',
  styleUrls: ['./root-areas.component.css']
})
export class RootAreasComponent implements OnInit {
  public config: any
  public data: Area[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudService: CrudService<Area>
  ) {
    this.config = {
      columns: [
        { key: 'nivel.nombre', displayName: 'Nivel' },
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/root/areas/add',
        'edit': '/root/areas/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/areas').subscribe({
      next: (data: Area[]) => {
        this.data = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los areas:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/root/areas/'+ id).subscribe({
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


