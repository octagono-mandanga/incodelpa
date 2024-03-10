import { Component, OnInit } from '@angular/core';
import { Nivel } from 'src/app/model/nivel';
import { Lectivo } from 'src/app/model/lectivo';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root-lectivos-edit',
  templateUrl: './root-lectivos-edit.component.html',
  styleUrls: ['./root-lectivos-edit.component.css']
})
export class RootLectivosEditComponent   implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Lectivo

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Lectivo>,
    private crudNivelService: CrudService<Nivel>,
  ){}

  async ngOnInit(): Promise<void> {
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'nivel', displayName: 'Nivel', required: true, type: 'select', options: [] },
        { key: 'inicio', displayName: 'Fecha Inicio', required: true, type: 'date' },
        { key: 'fin', displayName: 'Fecha Fin', required: true, type: 'date' },
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
      const data: Nivel[] = await firstValueFrom(this.crudNivelService.read('/root/niveles'));

      this.crudService.read('/root/lectivos/'+this.id).subscribe({
        next: (res: any) => {
          this.data = res.data
          this.data.nivel = res.data.nivel.id
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
    this.crudService.update(data, '/root/lectivos/'+this.id).subscribe({
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
