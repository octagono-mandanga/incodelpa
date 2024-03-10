import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TipoDocumento } from 'src/app/model/tipo_documento';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-perfil',
  templateUrl: './coordinacion-perfil.component.html',
  styleUrls: ['./coordinacion-perfil.component.css']
})
export class CoordinacionPerfilComponent implements OnInit {
  public config: any
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: User

  constructor(
    private crudService: CrudService<User>,
    private crudTipodocumentoService: CrudService<TipoDocumento>,
  ){}
  async ngOnInit() {
    this.loading = true
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
    await this.crudService.read('/coordinacion/auth').subscribe({
      next: (res: any) => {
        this.data = res.data
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el datos : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  onActualizar(event: any){

    this.loading = true
    this.crudService.update(event, '/coordinacion/auth/update').subscribe({
      next: (res: any) => {
        this.data = res.data
        this.message = res.message
       this.success = true
       this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el datos : '+error
         this.success = false
         this.loading = false
       }
    })
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);

  }

}
