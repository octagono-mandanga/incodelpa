import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Institucion } from 'src/app/model/institucion';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-root-institucion-form',
  templateUrl: './root-institucion-form.component.html',
  styleUrls: ['./root-institucion-form.component.css']
})
export class RootInstitucionFormComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Institucion
  constructor(
    private route: ActivatedRoute,
    private crudService: CrudService<Institucion>
    ){}
  ngOnInit(): void {
    this.config = {
      columns: [
        { key: 'tipo', displayName: 'Tipo', required: true, type: 'text' },
        { key: 'nombre', displayName: 'Nombre', required: true, type: 'text' },
        { key: 'direccion', displayName: 'Direccion', required: true, type: 'text' },
        { key: 'telefono', displayName: 'Telefono', type: 'text' },
        { key: 'email', displayName: 'Email', required: true, type: 'email' },
        { key: 'dane', displayName: 'Dane', type: 'text' },
        { key: 'url', displayName: 'URL', type: 'text' },
      ],
      actions: {
      }
    };
    this.loading = true
    this.id = this.route.snapshot.params['id']
    this.crudService.read('/root/institucion').subscribe({
      next: (response: any) => {
        this.data = response.data
        this.loading = false
      },
      error: (error) => {
        this.message = 'Error al obtener los datos '+ error;
        this.success = false

      }
    });
  }
  onActualizar(data: any) {
    this.loading = true
    this.crudService.update(data, '/root/institucion/'+this.id).subscribe({
      next: (response: any) => {
        this.data = response.data
        this.message = response.message
        this.success = true
        this.loading = false
      },
      error: (error) => {
        this.loading = false
        this.message = 'Error al actualizar '+ error;
        this.success = false
      }
    })
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
}
