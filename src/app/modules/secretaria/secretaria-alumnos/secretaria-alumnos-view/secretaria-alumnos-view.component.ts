import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/model/user';
import { Matricula } from 'src/app/model/matricula';
import { CrudService } from 'src/app/service/crud.service';
import { Curso } from 'src/app/model/curso';

@Component({
  selector: 'app-secretaria-alumnos-view',
  templateUrl: './secretaria-alumnos-view.component.html',
  styleUrls: ['./secretaria-alumnos-view.component.css']
})
export class SecretariaAlumnosViewComponent implements  OnInit {
  public config: any
  public config2: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public data!: User

  public matriculas: Matricula[] = []

  public cursos: Curso[] = []

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<User>,
    private crudMatriculaService: CrudService<Matricula>,
    private crudCursoService: CrudService<Curso>,
  ){}

  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    this.config = {
      columns: [
        { key: 'curso', displayName: 'Curso', required: true, type: 'select', options: [] },
        { key: 'alumno', type: 'hidden' },
      ],
      actions: {}
    };
    this.config2 = {
      actions: {
        edit: '/secretaria/alumnos/edit',
        view: '/secretaria/alumnos/detail',
        modify: '/secretaria/alumnos/modify',
      }
    }
    this.cargarMatricula()
  }
  async cargarMatricula(){
    this.cursos = []
    await this.crudService.read('/secretaria/alumnos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.matriculas = res.data.matriculas;
        let matricula = this.matriculas.find(item => item.estado==='activo')
        if(!matricula) {
          this.cursosDisponibles();
        }
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
  }
  cursosDisponibles() {
    this.crudCursoService.read('/secretaria/cursos/pa-matricular/' + this.id).subscribe({
      next: (res: any) =>{
        this.cursos = res.data
        const opcionesActivas =  this.cursos
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nombre + ' [' + entidad.grado.nombre +']'
        }));
        // Encuentra el objeto de configuración para el campo 'nivel' y actualiza sus opciones
        const campoCurso = this.config.columns.find((col: any) => col.key === 'curso');
        if (campoCurso) {
          campoCurso.options = opcionesActivas;
        }
      },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
  }
  onMatricular(data: any){
    data.alumno = this.id
    this.crudCursoService.create(data, '/secretaria/matricula').subscribe({
      next: (res: any) =>{
        if(res.data) {
          this.cargarMatricula()
        }
      },
      error: (error) => {
        this.message = 'Error al cargar el curso : '+error
        this.success = false
        this.loading = false
      }
    })
  }
}
