import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Competencia } from 'src/app/model/competencia';
import { Materia } from 'src/app/model/materia';
import { Tipocompetencia } from 'src/app/model/tipocompetencia';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-docente-competencia-asignatura-add',
  templateUrl: './docente-competencia-asignatura-add.component.html',
  styleUrls: ['./docente-competencia-asignatura-add.component.css']
})
export class DocenteCompetenciaAsignaturaAddComponent implements OnInit {
  public config: any

  public loading: boolean = false
  public loading2: boolean = false
  public success: boolean = false
  public msg: string = ''
  public message: string = ''
  public id: string = ''
  public data!: Materia
  public tipos: Tipocompetencia[] = []

  constructor(
    private crudMateriaService: CrudService<Materia>,
    private crudCompetenciaService: CrudService<Competencia>,
    private crudTipoService: CrudService<Tipocompetencia>,
    private activedRoute: ActivatedRoute
  ){}
  async ngOnInit() {
    this.config = {
      columns: [
        { key: 'materia', type: 'hidden' },
        { key: 'detalle', displayName: 'Detalle', required: true, type: 'textarea' },
        { key: 'tipo', displayName: 'Tipo Competencia', required: true, type: 'select', options: [] },
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
    this.loading = true
    this.msg = 'Tipos de Competencia';
    this.tipos = await firstValueFrom(this.crudTipoService.read('/docente/tipocompetencias'));
    const opciones = this.tipos
        .filter(entidad => entidad.estado === 'activo')
        .map(entidad => ({
          value: entidad.id.toString(),
          displayValue: entidad.nombre
        }));
    const TiposCompet = this.config.columns.find((col: any) => col.key === 'tipo');
    if (TiposCompet) {
      TiposCompet.options = opciones;
    }

    this.id = this.activedRoute.snapshot.params['id']

    this.msg = 'Materia'
    this.crudMateriaService.read('/docente/materias/' + this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.data.competencias.sort((a: any, b: any) => a.orden - b.orden);
        this.loading = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar la asignatura: '+error
         this.success = false
         this.loading = false
       }
    })
  }
  onAgregar(data: any){
    this.loading = true
    data.materia = this.id
    this.crudCompetenciaService.create(data, '/docente/competencias').subscribe({
      next: (res: any) => {
       const textComp = this.config.columns.find((col: any) => col.key === 'detalle');
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        this.message = 'Error al crear el competencia : '+error
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
