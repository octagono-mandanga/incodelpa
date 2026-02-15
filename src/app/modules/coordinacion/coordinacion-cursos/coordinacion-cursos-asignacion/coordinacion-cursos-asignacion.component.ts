import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { Materia } from 'src/app/model/materia';
import { CrudService } from 'src/app/service/crud.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-coordinacion-cursos-asignacion',
  templateUrl: './coordinacion-cursos-asignacion.component.html',
  styleUrls: ['./coordinacion-cursos-asignacion.component.css']
})

export class CoordinacionCursosAsignacionComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string

  public success: boolean = true
  public loading: boolean = false
  public loading2: boolean = false
  public data!: Curso
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []

  /**
   * Formulario
   *
   */

  public form!: FormGroup;
  public docentes: User[] = []; // Suponiendo que aquí iría la data de los docentes
  public asignaturas: Materia [] = []; // Suponiendo que aquí iría la data de las asignaturas
  public estados = ['Activo', 'Inactivo']; // Los posibles estados


  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Curso>,
    private crudMateriaService: CrudService<Materia>,
    private crudAsignacionService: CrudService<Asignacion>,
    private crudDocenteService: CrudService<User>,
    private fb: FormBuilder
  ){}
  async ngOnInit() {
    this.loading = true

    this.id =  this.route.snapshot.params['id']

    this.form = this.fb.group({
      curso: [this.id, Validators.required],
      docente: [null, Validators.required],
      materias: [null, Validators.required],
      estado: ['Activo', Validators.required]
    });

    await this.crudService.read('/coordinacion/cursos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.loadAsignacion();
        this.loadDocentes()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })


  }
  async loadAsignacion(){
    await this.crudAsignacionService.read('/coordinacion/asignaciones/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.disponibles = res.disponibles
        this.asignaciones = res.asignaciones
        this.loading2 = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
         this.loading2 = false
       }
    })
  }
  async loadMaterias(){
    await this.crudMateriaService.read('/coordinacion/asignaciones/libres/'+this.id).subscribe({
      next: (res: any) => {
        this.asignaturas = res.data
        this.loadDocentes()
       },
       error: (error) => {
         this.message = 'Error al cargar el materia : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async loadDocentes(){
    await this.crudDocenteService.read('/coordinacion/docentes/').subscribe({
      next: (res: any) => {
        this.docentes = res
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el materia : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async onSubmit() {
    if (this.form.valid) {
        this.loading2 = true
        await this.crudAsignacionService.create(this.form.value,  '/coordinacion/asignaciones').subscribe({
        next: (res: any) => {
          this.loadAsignacion();
          this.message = res.message
          this.success = true
        },
        error: (error) => {
          this.message = 'Error al crear el curso : '+error
          this.success = false
          this.loading2 = false
        }
      });
    }
  }

  async onDelete(id: string){
    this.loading2 = true
    await this.crudAsignacionService.delete('/coordinacion/asignaciones/'+id).subscribe({
      next: (res: any) => {
        this.loadAsignacion()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
         this.loading2 = false
       }
    })
  }

}
