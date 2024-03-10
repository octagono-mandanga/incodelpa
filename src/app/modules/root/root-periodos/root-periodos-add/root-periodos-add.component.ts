import { Component, OnInit } from '@angular/core';

import { Lectivo } from 'src/app/model/lectivo';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';

import { Periodo } from 'src/app/model/periodo';

@Component({
  selector: 'app-root-periodos-add',
  templateUrl: './root-periodos-add.component.html',
  styleUrls: ['./root-periodos-add.component.css']
})
export class RootPeriodosAddComponent implements OnInit {
  public config: any
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Periodo

  constructor(
    private crudLectivoService: CrudService<Lectivo>,
    private crudService: CrudService<Periodo>,
  ){}

  async ngOnInit(): Promise<void> {
    this.config = {
      columns: [
        { key: 'lectivo', displayName: 'Lectivo', required: true, type: 'select', options: [] },
        {
          key: 'nombre',
          displayName: 'Nombre',
          type: 'select',
          options: [
            { value: 'primero', displayValue: 'Primero' },
            { value: 'segundo', displayValue: 'Segundo' },
            { value: 'tercero', displayValue: 'Tercero' },
            { value: 'cuarto', displayValue: 'Cuarto' },
          ],
          required: true
        },
        { key: 'inicio', displayName: 'Fecha Inicio', required: true, type: 'date' },
        { key: 'fin', displayName: 'Fecha Fin', required: true, type: 'date' },
        { key: 'porcentaje', displayName: 'Porcentaje', required: true, type: 'number' },
        {
          key: 'estado',
          displayName: 'Estado',
          type: 'select',
          options: [
            { value: 'activo', displayValue: 'Activo' },
            { value: 'inactivo', displayValue: 'Inactivo' }
          ],
          required: true
        },
      ],
      actions: {}
    };
    try {
      const data: Lectivo[] = await firstValueFrom(this.crudLectivoService.read('/root/lectivos'));
      const opcionesActivas = data
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nivel.nombre + ' (' + entidad.inicio + ' ' + entidad.fin + ')'
        }));

      // Encuentra el objeto de configuración para el campo 'lectivo' y actualiza sus opciones
      const campoLectivo = this.config.columns.find((col: any) => col.key === 'lectivo');
      if (campoLectivo) {
        campoLectivo.options = opcionesActivas;
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }


  onAgregar(data: any){
    this.loading = true
    this.crudService.create(data, '/root/periodos').subscribe({
      next: (res: any) => {
       this.data = new Periodo
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el periodo : '+error
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
