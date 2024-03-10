import { Component, OnInit } from '@angular/core';
import { Nivel } from 'src/app/model/nivel';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-niveles',
  templateUrl: './root-niveles.component.html',
  styleUrls: ['./root-niveles.component.css']
})
export class RootNivelesComponent implements OnInit {
  public config: any
  public data: Nivel[] = []
  public message!: string
  public loading: boolean = false
  public success: boolean = true

  constructor(
    private crudService: CrudService<Nivel>
  ) {
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/root/niveles/add',
        'edit': '/root/niveles/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/niveles').subscribe({
      next: (data: Nivel[]) => {
        this.loading = false
        this.data = data
      },
      error: (error) => {
        console.error('Error al obtener los roles:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/root/niveles/'+ id).subscribe({
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
