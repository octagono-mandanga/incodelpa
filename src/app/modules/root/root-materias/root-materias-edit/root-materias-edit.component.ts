import { Component, OnInit } from '@angular/core';
import { Materia } from 'src/app/model/materia';
import { Area } from 'src/app/model/area';
import { Grado } from 'src/app/model/grado';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root-materias-edit',
  templateUrl: './root-materias-edit.component.html',
  styleUrls: ['./root-materias-edit.component.css']
})
export class RootMateriasEditComponent  implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Materia


  public areas: Area[] = []
  public grados: Grado[] = []

  constructor(
    private crudService: CrudService<Materia>,
    private crudAreaService: CrudService<Area>,
    private crudGradoService: CrudService<Grado>,
    public route: ActivatedRoute
  ){}

  async ngOnInit(): Promise<void> {
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'area', displayName: 'Area', required: true, type: 'select', options: [], changevalue: true },
        { key: 'grado', displayName: 'Grado', required: true, type: 'select', options: [] },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        { key: 'ih', displayName: 'Intensidad', required: true, type: 'number' },
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
      this.loading = true
      this.areas = await firstValueFrom(this.crudAreaService.read('/root/areas'));
      const opcionesAreas = this.areas
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nombre
        }));

      // Encuentra el objeto de configuración para el campo 'area' y actualiza sus opciones
      const campoArea = this.config.columns.find((col: any) => col.key === 'area');
      if (campoArea) {
        campoArea.options = opcionesAreas;
      }

      this.grados = await firstValueFrom(this.crudGradoService.read('/root/grados'));

      this.crudAreaService.read('/root/materias/'+this.id).subscribe({
        next: (res: any) => {
          this.data = res.data
          this.data.area = this.data.area.id
          this.data.grado = this.data.grado.id
          this.cargarGrado({data: this.data.area})
          this.loading = false
         },
         error: (error) => {
           this.message = 'Error al crear al cargar : '+error
           this.success = false
           this.loading = false
         }
      })


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

  onActualizar(data: any){
    this.loading = true
    this.crudService.update(data, '/root/materias/'+this.id).subscribe({
      next: (res: any) => {
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
      this.onActualizar(event)
      // Aquí puedes hacer más validaciones, por ejemplo, verificar si es null

    } else if (typeof event.data === 'string' || typeof event.data === 'number') {
      this.cargarGrado(event)
    }
  }
}
