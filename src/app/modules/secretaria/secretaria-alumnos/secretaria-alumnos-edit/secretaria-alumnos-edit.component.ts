import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TipoDocumento } from 'src/app/model/tipo_documento';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-secretaria-alumnos-edit',
  templateUrl: './secretaria-alumnos-edit.component.html',
  styleUrls: ['./secretaria-alumnos-edit.component.css']
})
export class SecretariaAlumnosEditComponent implements  OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: User

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<User>,
    private crudTipodocumentoService: CrudService<TipoDocumento>,
  ){}

  async ngOnInit() {
    this.id = this.route.snapshot.params['id']
    this.loading = true
    this.config = {
      columns: [
        { key: 'primer_apellido', displayName: 'Primer Apellido', required: true, type: 'text' },
        { key: 'segundo_apellido', displayName: 'Segundo Apellido', required: false, type: 'text' },
        { key: 'primer_nombre', displayName: 'Primer Nombre', required: true, type: 'text' },
        { key: 'segundo_nombre', displayName: 'Segundo Nombre', required: false, type: 'text' },
        { key: 'celular', displayName: 'Numero Celular', required: true, type: 'text' },
        { key: 'rol',  type: 'hidden', value: this.id },
        { key: 'email', displayName: 'Email', required: true, type: 'email' },
        { key: 'tipo_documento', displayName: 'Tipo Documento', required: true, type: 'select', options: [] },
        { key: 'nid', displayName: 'Numero Documento', required: true, type: 'text' },

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
    await this.crudService.read('/secretaria/alumnos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data

        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el docente : '+error
         this.success = false
         this.loading = false
       }
    })

  }


  onAgregar(data: any){
    this.loading = true
    this.crudService.update(data, '/secretaria/alumnos/'+this.id).subscribe({
      next: (res: any) => {
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el usuario : '+error
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
