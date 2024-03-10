import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/model/materia';
import { Grado } from 'src/app/model/grado';
import { Area } from 'src/app/model/area';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root-materias-add',
  templateUrl: './root-materias-add.component.html',
  styleUrls: ['./root-materias-add.component.css']
})
export class RootMateriasAddComponent implements OnInit {
  public config: any

  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public areas: Area[] = []
  public grados: Grado[] = []

  public data!: Materia

  constructor(
    private crudService: CrudService<Materia>,
    private crudAreaService: CrudService<Area>,
    private crudGradoService: CrudService<Grado>,
  ){}

  async ngOnInit(): Promise<void> {
    this.config = {
      columns: [
        { key: 'area', displayName: 'Area', required: true, type: 'select', options: [], changevalue: true },
        { key: 'grado', displayName: 'Grado', required: true, type: 'select', options: [] },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        { key: 'ih', displayName: 'Intensidad Horaria', required: true, type: 'number' },
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
      this.areas = await firstValueFrom(this.crudAreaService.read('/root/areas'));
      const opcionesAreas = this.areas
        .filter(area => area.estado === 'activo')
        .map(area => ({
          value: area.id.toString(),
          displayValue: area.nombre
        }));

      // Encuentra el objeto de configuración para el campo 'area' y actualiza sus opciones
      const campoArea = this.config.columns.find((col: any) => col.key === 'area');
      if (campoArea) {
        campoArea.options = opcionesAreas;
      }

      this.grados = await firstValueFrom(this.crudGradoService.read('/root/grados'));
      /*
      const opcionesGrados = this.grados
      .filter(grado => grado.estado === 'activo')
      .map(grado => ({
        value: grado.id.toString(),
        displayValue: grado.nombre
      }));

      const campoGrado = this.config.columns.find((col: any) => col.key === 'grado');
      if (campoGrado) {
        campoGrado.options = opcionesGrados;
      }
      */

    } catch (error) {
      console.error('Error:', error);
    }
  }
  cargarGrado(event: any){
    const area = this.areas.find((col: Area) => col.id === event.data);
    const opcionesGrados = this.grados
    .filter(grado => (grado.estado === 'activo' && grado.nivel.id === area?.nivel.id))
    .map(grado => ({
      value: grado.id.toString(),
      displayValue: grado.nombre
    }));


    // Encuentra el objeto de configuración para el campo 'area' y actualiza sus opciones
    const campoGrado = this.config.columns.find((col: any) => col.key === 'grado');
    if (campoGrado) {
      campoGrado.options = opcionesGrados;
    }
  }

  onAgregar(data: any){
    this.loading = true
    this.crudService.create(data, '/root/materias').subscribe({
      next: (res: any) => {
       this.data = new Materia
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el area : '+error
        this.success = false
        this.loading = false
      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  onEvento(event: any){

    if (typeof event.data !== 'string') {
      // Es un objeto y no un Array
      this.onAgregar(event)
      // Aquí puedes hacer más validaciones, por ejemplo, verificar si es null

    } else if (typeof event.data === 'string' || typeof event.data === 'number') {
      this.cargarGrado(event)
    }
  }
}
