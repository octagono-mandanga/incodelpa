import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Entity } from 'src/app/model/entity';
import { Institucion } from 'src/app/model/institucion';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-institucion',
  templateUrl: './root-institucion.component.html',
  styleUrls: ['./root-institucion.component.css']
})
export class RootInstitucionComponent implements OnInit {
  public config: any
  public data!: Entity
  public loading: boolean = false
  constructor(private crudService: CrudService<Institucion> ) {
    this.config = {
      columns: [
        { key: 'tipo', displayName: 'Tipo' },
        { key: 'nombre', displayName: 'Nombre' },
        { key: 'direccion', displayName: 'Direccion' },
        { key: 'telefono', displayName: 'Telefono' },
        { key: 'email', displayName: 'Email' },
        { key: 'dane', displayName: 'Dane' },
        { key: 'url', displayName: 'URL' },
      ],
      actions: {
        'edit': '/root/institucion/form',
      }
    };
  }
  ngOnInit() {
    this.loading = true
    this.crudService.read('/root/institucion/', {}).subscribe({
      next: (response: any) => {
        this.data = response.data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los roles del usuario', error);
      }
    });
  }
}
