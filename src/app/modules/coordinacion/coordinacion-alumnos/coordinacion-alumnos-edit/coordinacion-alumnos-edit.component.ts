import { Component, OnInit } from '@angular/core';
import { TipoDocumento } from 'src/app/model/tipo_documento';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-coordinacion-alumnos-edit',
  templateUrl: './coordinacion-alumnos-edit.component.html',
  styleUrls: ['./coordinacion-alumnos-edit.component.css']
})
export class CoordinacionAlumnosEditComponent implements OnInit {
  //Imagen
  public imageChangedEvent: any = '';
  public croppedImage: any = '';

  public config: any

  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: User

  constructor(
    public route: ActivatedRoute,
    public crudService: CrudService<User>,
    public crudTipodocumentoService: CrudService<TipoDocumento>,
    public router: ActivatedRoute
  ){}
  async ngOnInit() {
    this.id = this.router.snapshot.params['id']
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
    const data: TipoDocumento[] = await firstValueFrom(this.crudTipodocumentoService.read('/coordinacion/tipo_documentos'));
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
    await this.crudService.read('/coordinacion/alumnos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data

        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })


  }

  onAgregar(data: any){
    this.loading = true
    this.crudService.update(data, '/coordinacion/alumnos/'+this.id).subscribe({
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      const imageUrl = URL.createObjectURL(event.blob);
      this.croppedImage = imageUrl;
      this.crudService.uploadImage(event.blob, '/coordinacion/alumnos/avatar/'+this.id).subscribe({
        next: (response) => console.log('Imagen subida con éxito', response),
        error: (error) => console.error('Error al subir imagen', error)
      });
    }
  }



}
