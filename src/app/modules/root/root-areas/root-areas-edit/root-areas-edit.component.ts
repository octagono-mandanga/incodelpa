import { Component, OnInit } from '@angular/core';
import { Nivel } from 'src/app/model/nivel';
import { Area } from 'src/app/model/area';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root-areas-edit',
  templateUrl: './root-areas-edit.component.html',
  styleUrls: ['./root-areas-edit.component.css']
})
export class RootAreasEditComponent  implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Area

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Nivel>,
    private crudAreaService: CrudService<Area>,
  ){}

  async ngOnInit(): Promise<void> {
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'nivel', displayName: 'Nivel', required: true, type: 'select', options: [] },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        {
          key: 'obligatoriedad',
          displayName: 'Obligatoriedad',
          type: 'select',
          options: [
            { value: 'obligatorio', displayValue: 'Obligatorio' },
            { value: 'optativo', displayValue: 'Optativo' }
          ],
          required: true
        },
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
      const data: Nivel[] = await firstValueFrom(this.crudService.read('/root/niveles'));
      this.crudAreaService.read('/root/areas/'+this.id).subscribe({
        next: (res: any) => {
          this.data = res.data
          this.loading = false
         },
         error: (error) => {
           this.message = 'Error al cargar el area : '+error
           this.success = false
           this.loading = false
         }
      })

      const opcionesActivas = data
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nombre
        }));

      // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones
      const campoNivel = this.config.columns.find((col: any) => col.key === 'nivel');
      if (campoNivel) {
        campoNivel.options = opcionesActivas;
      }

    } catch (error) {
      console.error('Error:', error);
    }
  }

  onEditar(data: any){
    this.loading = true
    this.crudAreaService.update(data, '/root/areas/'+this.id).subscribe({
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
