import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Curso } from 'src/app/model/curso';


import { TipoDocumento } from 'src/app/model/tipo_documento';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-secretaria-cursos-registro-alumno',
  templateUrl: './secretaria-cursos-registro-alumno.component.html',
  styleUrls: ['./secretaria-cursos-registro-alumno.component.css']
})
export class SecretariaCursosRegistroAlumnoComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public curso!: Curso

  public data!: User




  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<User>,
    private crudCursoService: CrudService<Curso>,
    private crudTipodocumentoService: CrudService<TipoDocumento>,

    private fb: FormBuilder
  ){}
  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']


    this.config = {
      columns: [
        { key: 'primer_apellido', displayName: 'Primer Apellido', required: true, type: 'text' },
        { key: 'segundo_apellido', displayName: 'Segundo Apellido', required: false, type: 'text' },
        { key: 'primer_nombre', displayName: 'Primer Nombre', required: true, type: 'text' },
        { key: 'segundo_nombre', displayName: 'Segundo Nombre', required: false, type: 'text' },
        { key: 'celular', displayName: 'Numero Celular', required: true, type: 'text' },
        { key: 'email', displayName: 'Email', required: true, type: 'email' },
        { key: 'tipo_documento', displayName: 'Tipo Documento', required: true, type: 'select', options: [] },
        { key: 'nid', displayName: 'Numero Documento', required: true, type: 'text' },
        { key: 'curso', type: 'hidden', value: this.id },

      ],
      actions: {

      }
    };

    const data: TipoDocumento[] = await firstValueFrom(this.crudTipodocumentoService.read('/secretaria/tipo_documentos'));
    const opcionesActivas = data
      .filter(entidad => entidad.estado === 'activo')
      .map(entidad => ({
        value: entidad.id.toString(),
        displayValue: entidad.nombre
      }));
    const campoTipodocumento = this.config.columns.find((col: any) => col.key === 'tipo_documento');
    if (campoTipodocumento) {
      campoTipodocumento.options = opcionesActivas;
    }

    await this.crudCursoService.read('/secretaria/cursos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = new User
        this.curso = res.data
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })

  }

  onAgregar(data: any){
    data.curso  = this.id
    this.loading = true
    this.crudService.create(data, '/secretaria/alumnos').subscribe({
      next: (res: any) => {
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el docente : '+error
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
