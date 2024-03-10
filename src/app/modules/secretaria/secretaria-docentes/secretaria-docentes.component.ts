import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { TipoDocumento } from 'src/app/model/tipo_documento';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-secretaria-docentes',
  templateUrl: './secretaria-docentes.component.html',
  styleUrls: ['./secretaria-docentes.component.css']
})
export class SecretariaDocentesComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false
  public loading2: boolean = false
  public data: User = new User

  public searchList: User[] = []
  public newList: User[] = []

  public tipoDoc: TipoDocumento[] = []


  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private crudService: CrudService<User>,
    private crudTipodocumentoService: CrudService<TipoDocumento>
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
      ],
      actions: {

      }
    };

    this.tipoDoc = await firstValueFrom(this.crudTipodocumentoService.read('/secretaria/tipo_documentos'));
    this.onResetForm()

    this.crudService.read('/secretaria/docentes').subscribe({
      next: (res: any) => {
        this.newList = res.data
        this.success = true
        this.loading = false
        this.onResetForm()
       },
       error: (error) => {
         this.message = 'Error al crear el docente : '+error
         this.success = false
         this.loading = false
       }
    })
  }
  onResetForm(){
    this.data = new User
    const opcionesActivas = this.tipoDoc
    .filter(entidad => entidad.estado === 'activo')
    .map(entidad => ({
      value: entidad.id.toString(),
      displayValue: entidad.nombre
    }));
    const campoTipodocumento = this.config.columns.find((col: any) => col.key === 'tipo_documento');
    if (campoTipodocumento) {
      campoTipodocumento.options = opcionesActivas;
    }
  }
  onAgregar(data: any){
    this.loading = true
    this.crudService.create(data, '/secretaria/docentes').subscribe({
      next: (res: any) => {
       this.message = res.message
       this.success = true
       this.loading = false
       this.onResetForm()
      },
      error: (error) => {
        this.message = 'Error al crear el docente : '+error
        this.success = false
        this.loading = false
      }
    });
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  async onEvent(event: any){
    if(event.term){
      this.loading2 = true
      await this.crudService.read('/secretaria/docentes/search/'+event.term).subscribe({
        next: (res: any) => {
          this.searchList = res.data;
          this.loading2 = false
         },
         error: (error) => {
           this.message = 'Error al cargar el docentes : '+error
           this.success = false
           this.loading = false
         }
      })
    } else if(event.user) {
      this.router.navigate(['/secretaria/docentes/view/', event.user])
    }
  }
}
