import { Component, OnInit } from '@angular/core';
import { Lectivo } from 'src/app/model/lectivo';
import { Periodo } from 'src/app/model/periodo';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-periodos',
  templateUrl: './coordinacion-periodos.component.html',
  styleUrls: ['./coordinacion-periodos.component.css']
})
export class CoordinacionPeriodosComponent  implements OnInit {
  public config: any

  public data: Periodo[] = []
  /** Solo funcional al inicio de año */
  public lectivos: Lectivo[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudService: CrudService<Periodo>,
    private crudLectivoService: CrudService<Lectivo>,
  ) {
    this.config = {
      columns: [
        { key: 'lectivo.nivel.nombre', displayName: 'Lectivo' },
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'inicio', displayName: 'Fecha Inicio' },
        { key: 'fin', displayName: 'Fecha Fin' },
        { key: 'porcentaje', displayName: 'Porcentaje' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/coordinacion/periodos/add',
        'edit': '/coordinacion/periodos/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/coordinacion/periodos').subscribe({
      next: (data: Periodo[]) => {
        this.data = data
        if(data.length === 0){
          this.loadLectivos();
        }
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los periodos:', error);
      }
    });
  }
  async loadLectivos(){
    this.loading = true
    await this.crudLectivoService.read('/coordinacion/lectivos').subscribe({
      next: (data: Lectivo[]) => {
        this.lectivos = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los lectivos:', error);
      }
    });
  }
  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/coordinacion/periodos/'+ id).subscribe({
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
