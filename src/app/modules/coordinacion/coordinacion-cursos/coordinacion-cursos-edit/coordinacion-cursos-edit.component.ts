import { Grado } from './../../../../model/grado';
import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Curso } from 'src/app/model/curso';
import { Sede } from 'src/app//model/sede';
import { Lectivo } from 'src/app/model/lectivo';
import { CrudService } from 'src/app/service/crud.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-coordinacion-cursos-edit',
  templateUrl: './coordinacion-cursos-edit.component.html',
  styleUrls: ['./coordinacion-cursos-edit.component.css']
})
export class CoordinacionCursosEditComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public data!: Curso
  public lectivos: Lectivo[] = []
  public grados: Grado[] = []
  public docentes: User[] = []

  constructor(
    public route: ActivatedRoute,
    private crudLectivoService: CrudService<Lectivo>,
    private crudSedeService: CrudService<Sede>,
    private crudGradoService: CrudService<Grado>,
    private crudDocenteService: CrudService<User>,
    private crudService: CrudService<Curso>,
  ){}

  async ngOnInit(): Promise<void> {
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'lectivo', displayName: 'Lectivo', required: true, type: 'select', options: [], changevalue: true },
        { key: 'grado', displayName: 'Grado', required: true, type: 'select', options: [] },
        { key: 'sede', displayName: 'Sede', required: true, type: 'select', options: [] },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        { key: 'director', displayName: 'Dirección Curso', required: false, type: 'select', options: [] },
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
      this.msg = 'Cargando Curso...';
      await this.crudService.read('/coordinacion/cursos/'+this.id).subscribe({
        next: (res: any) => {
          this.data = res.data
          this.data.sede = res.data.sede.id
          this.data.grado = res.data.grado.id
          this.data.lectivo = res.data.lectivo.id
          const lectivo = this.lectivos.find((col: Lectivo) => col.id === this.data.lectivo);
          const opcionesGrados = this.grados
          .filter(grado => (grado.estado === 'activo' && grado.nivel.id === lectivo?.nivel.id))
          .map(grado => ({
            value: grado.id.toString(),
            displayValue: grado.nombre
          }));
          const campoGrado = this.config.columns.find((col: any) => col.key === 'grado');
          if (campoGrado) {
            campoGrado.options = opcionesGrados;
          }
          this.loading = false
         },
         error: (error) => {
           this.message = 'Error al cargar el area : '+error
           this.success = false
           this.loading = false
         }
      })
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
      // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones

    } catch (error) {
      console.error('Error:', error);
    }
  }

  onAgregar(data: any){
    this.loading = true
    this.crudService.update(data, '/coordinacion/cursos/'+this.id).subscribe({
      next: (res: any) => {
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
    const lectivo = this.lectivos.find((col: Lectivo) => col.id === event.data);
    const opcionesGrados = this.grados
    .filter(grado => (grado.estado === 'activo' && grado.nivel.id === lectivo?.nivel.id))
    .map(grado => ({
      value: grado.id.toString(),
      displayValue: grado.nombre
    }));


    // Encuentra el objeto de configuración para el campo 'lectivo' y actualiza sus opciones
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
