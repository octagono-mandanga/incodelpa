import { Component, OnInit } from '@angular/core';
import { Grado } from 'src/app/model/grado';
import { Nivel } from 'src/app/model/nivel';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root-grados-add',
  templateUrl: './root-grados-add.component.html',
  styleUrls: ['./root-grados-add.component.css']
})
export class RootGradosAddComponent implements OnInit {
  public config: any

  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Grado

  constructor(
    private crudNivelService: CrudService<Nivel>,
    private crudService: CrudService<Grado>,
  ){}

  async ngOnInit(): Promise<void> {
    this.config = {
      columns: [
        { key: 'nivel', displayName: 'Nivel', required: true, type: 'select', options: [] },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
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
    this.crudService.create(data, '/root/grados').subscribe({
      next: (res: any) => {
       this.data = new Grado
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el grado : '+error
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
