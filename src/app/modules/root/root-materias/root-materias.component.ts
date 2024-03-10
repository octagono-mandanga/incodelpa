import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/model/materia';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-materias',
  templateUrl: './root-materias.component.html',
  styleUrls: ['./root-materias.component.css']
})
export class RootMateriasComponent implements OnInit {
  public config: any
  public data: Materia[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false


  constructor(
    private crudService: CrudService<Materia>
  ) {
    this.config = {
      columns: [
        { key: 'grado.nombre', displayName: 'Grado' },
        { key: 'area.nombre', displayName: 'Area' },
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'ih', displayName: 'IH' },
        { key: 'porcentaje', displayName: '%' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/root/materias/add',
        'edit': '/root/materias/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/materias').subscribe({
      next: (data: Materia[]) => {
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
    this.crudService.delete('/root/materias/'+ id).subscribe({
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
