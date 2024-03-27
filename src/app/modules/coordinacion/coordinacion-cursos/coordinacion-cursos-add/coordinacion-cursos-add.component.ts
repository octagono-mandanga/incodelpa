import { Grado } from './../../../../model/grado';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Curso } from 'src/app/model/curso';
import { Sede } from 'src/app//model/sede';
import { Lectivo } from 'src/app/model/lectivo';
import { CrudService } from 'src/app/service/crud.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-coordinacion-cursos-add',
  templateUrl: './coordinacion-cursos-add.component.html',
  styleUrls: ['./coordinacion-cursos-add.component.css']
})
export class CoordinacionCursosAddComponent implements OnInit {
  public config: any

  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public data!: Curso
  public lectivos: Lectivo[] = []
  public grados: Grado[] = []
  public docentes: User[] = []

  constructor(
    private crudLectivoService: CrudService<Lectivo>,
    private crudSedeService: CrudService<Sede>,
    private crudGradoService: CrudService<Grado>,
    private crudService: CrudService<Curso>,
    private crudDocenteService: CrudService<User>,
  ){}

  async ngOnInit(): Promise<void> {

    this.config = {
      columns: [
        { key: 'lectivo', displayName: 'Lectivo', required: true, type: 'select', options: [], changevalue: true },
        { key: 'grado', displayName: 'Grado', required: true, type: 'select', options: [] },
        { key: 'sede', displayName: 'Sede', required: true, type: 'select', options: [] },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        { key: 'director', displayName: 'Director Curso', required: false, type: 'select', options: [] },
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
      this.msg = 'Cargando Lectivos...';
      this.lectivos = await firstValueFrom(this.crudLectivoService.read('/coordinacion/lectivos'));
      const opcionesActivas =       this.lectivos
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nivel.nombre
        }));

      // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones
      const campoLectivo = this.config.columns.find((col: any) => col.key === 'lectivo');
      if (campoLectivo) {
        campoLectivo.options = opcionesActivas;
      }

      this.msg = 'Cargando Sedes...';
      const datasede: Sede[] = await firstValueFrom(this.crudSedeService.read('/coordinacion/sedes'));
      const opcionesSedesActivas = datasede
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nombre
        }));

      // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones
      const campoSede = this.config.columns.find((col: any) => col.key === 'sede');
      if (campoSede) {
        campoSede.options = opcionesSedesActivas;
      }

      this.msg = 'Cargando Grados...';
      this.grados = await firstValueFrom(this.crudGradoService.read('/coordinacion/grados'));


      this.msg = 'Cargando Docentes...';
      this.docentes = await firstValueFrom(this.crudDocenteService.read('/coordinacion/docentes'));
      const opcionesDocentes = this.docentes
      .filter(entidad => entidad.estado === 'activo')
      .map(entidad => ({
        value: entidad.id.toString(),
        displayValue: `${entidad.primer_nombre} ${entidad.segundo_nombre || ''} ${entidad.primer_apellido} ${entidad.segundo_apellido || ''}`.trim()
      }));

      // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones
      const campoDirector = this.config.columns.find((col: any) => col.key === 'director');
      if (campoDirector) {
        campoDirector.options = opcionesDocentes;
      }

      this.loading = false

      // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones

    } catch (error) {
      console.error('Error:', error);
    }
  }

  onAgregar(data: any){
    this.loading = true
    this.crudService.create(data, '/coordinacion/cursos').subscribe({
      next: (res: any) => {
       this.data = new Curso
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el curso : '+error
        this.success = false
        this.loading = false
      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
  cargarGrado(event: any){
    const area = this.lectivos.find((col: Lectivo) => col.id === event.data);
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
  onEvento(event: any){

    if (typeof event.data !== 'string') {
      // Es un objeto y no un Array
      this.onAgregar(event)
      // Aquí puedes hacer más validaciones, por ejemplo, verificar si es null

    } else if (typeof event.data === 'string' || typeof event.data === 'number') {
      const campoGrado = this.config.columns.find((col: any) => col.key === 'grado');
      if (campoGrado) {
        campoGrado.options = [];
      }
      this.cargarGrado(event)
    }
  }
}
