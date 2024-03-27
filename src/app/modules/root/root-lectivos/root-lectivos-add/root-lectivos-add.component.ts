import { Component, OnInit } from '@angular/core';
import { Lectivo } from 'src/app/model/lectivo';
import { Nivel } from 'src/app/model/nivel';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root-lectivos-add',
  templateUrl: './root-lectivos-add.component.html',
  styleUrls: ['./root-lectivos-add.component.css']
})
export class RootLectivosAddComponent implements OnInit {
  public config: any

  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Lectivo

  constructor(
    private crudNivelService: CrudService<Nivel>,
    private crudService: CrudService<Lectivo>,
  ){}

  async ngOnInit(): Promise<void> {
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
      const data: Nivel[] = await firstValueFrom(this.crudNivelService.read('/root/niveles'));
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

  onAgregar(data: any){
    this.loading = true
    this.crudService.create(data, '/root/lectivos').subscribe({
      next: (res: any) => {
       this.data = new Lectivo
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el lectivo : '+error
        this.success = true
        this.loading = false
      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
}
