import { Component, OnInit } from '@angular/core';
import { Lectivo } from 'src/app/model/lectivo';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-lectivos',
  templateUrl: './root-lectivos.component.html',
  styleUrls: ['./root-lectivos.component.css']
})
export class RootLectivosComponent implements OnInit {
  public config: any
  public data: Lectivo[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudService: CrudService<Lectivo>
  ) {
    this.config = {
      columns: [
        { key: 'nivel.nombre', displayName: 'Nivel' },
        { key: 'inicio', displayName: 'Fecha Inicio' },
        { key: 'fin', displayName: 'Fecha Fin' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/root/lectivos/add',
        'edit': '/root/lectivos/edit/',
        'delete': true,
      }
    };
  }

  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/lectivos').subscribe({
      next: (data: Lectivo[]) => {
        this.data = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los lectivos:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/root/lectivos/'+ id).subscribe({
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
