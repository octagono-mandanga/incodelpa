import { Component, OnInit } from '@angular/core';
import { Periodo } from 'src/app/model/periodo';
import { Lectivo } from 'src/app/model/lectivo';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-coordinacion-periodos-edit',
  templateUrl: './coordinacion-periodos-edit.component.html',
  styleUrls: ['./coordinacion-periodos-edit.component.css']
})
export class CoordinacionPeriodosEditComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Periodo

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Periodo>,
    private crudLectivoService: CrudService<Lectivo>,
  ){}

  async ngOnInit(): Promise<void> {
    this.id =  this.route.snapshot.params['id']
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
        { key: 'porcentaje', displayName: 'Porcentaje', required: true , type: 'number'},
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
      this.loading = true
      const data: Lectivo[] = await firstValueFrom(this.crudLectivoService.read('/coordinacion/lectivos'));
      this.crudService.read('/coordinacion/periodos/'+this.id).subscribe({
        next: (res: any) => {
          this.data = res.data
          this.data.lectivo = res.data.lectivo.id

          this.loading = false
         },
         error: (error) => {
           this.message = 'Error al editar el lectivo : '+error
           this.success = false
           this.loading = false
         }
      })
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


  onEditar(data: any){
    this.loading = true
    this.crudService.update(data, '/coordinacion/periodos/'+this.id).subscribe({
      next: (response: any) => {
        this.data = response.data
        this.message = response.message
        this.success = true
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        this.message = 'Error al actualizar '+ error;
        this.success = false
      }
    })
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
}
