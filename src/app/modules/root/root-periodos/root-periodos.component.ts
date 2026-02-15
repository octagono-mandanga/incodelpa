import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/model/periodo';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-periodos',
  templateUrl: './root-periodos.component.html',
  styleUrls: ['./root-periodos.component.css']
})
export class RootPeriodosComponent implements OnInit {
  public config: any

  public data: Periodo[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudService: CrudService<Periodo>
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
        'add': '/root/periodos/add',
        'edit': '/root/periodos/edit/',
        'delete': true,
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/root/periodos').subscribe({
      next: (data: Periodo[]) => {
        this.data = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los periodos:', error);
      }
    });
  }

  onBorrar(id: any) {
    this.loading = true
    this.crudService.delete('/root/periodos/' + id).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(r => r.id !== id);
        this.message = res.message
        this.success = false
        this.loading = false
      },
      error: (error) => {


        this.message = 'Error al actualizar ' + error;
        this.success = false
        this.loading = false

      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  onToggleEstado(item: Periodo) {
    this.loading = true;
    const originalEstado = item.estado;
    const nuevoEstado = item.estado === 'activo' ? 'inactivo' : 'activo';

    // Crear una copia del objeto para no modificar el original antes de tiempo
    // y para ajustar el formato de 'lectivo' que espera el backend (id en lugar de objeto)
    const payload: any = {
      ...item,
      estado: nuevoEstado,
      lectivo: item.lectivo?.id || item.lectivo // Si es objeto tomamos el id, si ya es id lo dejamos
    };

    this.crudService.update(payload, '/root/periodos/' + item.id).subscribe({
      next: (res: any) => {
        item.estado = nuevoEstado; // Actualizar el estado local solo tras éxito
        this.message = res.message || 'Estado actualizado con éxito';
        this.success = true;
        this.loading = false;
        setTimeout(() => (this.message = ''), 3000);
      },
      error: (error) => {
        this.message = 'Error al actualizar el estado: ' + error;
        this.success = false;
        this.loading = false;
        setTimeout(() => (this.message = ''), 5000);
      }
    });
  }

}
