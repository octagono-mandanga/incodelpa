import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Competencia } from 'src/app/model/competencia';
import { Notacompetencia } from 'src/app/model/notacompetencia';
import { Periodo } from 'src/app/model/periodo';
import { CompetenciasSeleccionadasService } from 'src/app/service/competencias-seleccionadas.service';
import { CrudService } from 'src/app/service/crud.service';

interface CompetenciaUsada {
  pid: string;
  cid: string;
}

@Component({
  selector: 'app-docente-calificar-competencias',
  templateUrl: './docente-calificar-competencias.component.html',
  styleUrls: ['./docente-calificar-competencias.component.css']
})
export class DocenteCalificarCompetenciasComponent implements OnInit {
  public id!: string
  public msg!: string
  public loading: boolean = false

  public message!: string
  public success: boolean = true

  public data: Asignacion = new Asignacion
  public periodo: Periodo = new Periodo
  public competencias: Competencia[] = []
  public competenciasUsadas: CompetenciaUsada[] = []

  public  form! : FormGroup;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,

    private crudPeriodoService: CrudService<Periodo>,
    private crudAsignacionService: CrudService<Asignacion>,
    private crudCompetenciaService: CrudService<Competencia>,
    private competenciasService: CompetenciasSeleccionadasService,
    private crudNotacompetenciaService: CrudService<Notacompetencia>,
    private fb: FormBuilder
  ){}
  async ngOnInit() {
    this.id = this.activedRoute.snapshot.params['id']
    this.loading = true
    this.msg = 'Asignación'
    this.form = this.fb.group({
      competenciasSeleccionadas: this.fb.array([]) // Inicializa con un array vacío
    });

    await this.crudAsignacionService.read('/docente/asignaciones/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.cargarPeriodo()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })


  }
  // Calcula las competencias usadas para el periodo actual
  validarChecking(id: string): boolean {

    const competencias = this.competenciasUsadas.filter(cu => cu.pid === this.periodo.id);
    if (competencias.find(co => co.cid === id)) {
      return true
    }
    return false;
  }

  async cargarPeriodo(){
    this.msg = 'Periodo'
    await this.crudPeriodoService.read('/docente/asignaciones/periodoactivo/'+this.id).subscribe({
      next: (res: any) => {
        this.periodo = res.data
        if(!this.periodo){
          this.router.navigate(['/docente/periodos'])
        }
        this.cargarCompetencias()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async cargarCompetencias(){
    this.msg = 'Competencias'
    await this.crudCompetenciaService.read('/docente/asignaciones/competencias/'+this.id).subscribe({
      next: (res: any) => {
        this.competencias = res.data
        // Actualiza el FormArray después de cargar las competencias

        this.cargarCompetenciasUsadas()

        this.msg = 'Competencias Usadas'
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  /** Cargar las competencias usadas en esta asignacion */
  async cargarCompetenciasUsadas(){
    await this.crudNotacompetenciaService.read('/docente/notas/competencias/'+this.id).subscribe({
      next: (res: any) => {
        this.competenciasUsadas = res.data
        this.competencias.forEach((competencia) => {
          const esUsada = this.validarChecking(competencia.id);
            const control = this.fb.control({
              value: esUsada,
              disabled: false
            });
            this.competenciasSeleccionadas.push(control);
        });
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  get competenciasSeleccionadas(): FormArray {
    return this.form.get('competenciasSeleccionadas') as FormArray;
  }


  public getNumSeleccionadas(): number {
    return this.competenciasSeleccionadas.controls.filter(control => control.value).length;
  }

  onSubmit() {
    const selectedCompetencias = this.form.value.competenciasSeleccionadas
      .map((selected: any, i: any) => selected ? this.competencias[i] : null)
      .filter((v: any) => v !== null);
    this.competenciasService.setCompetenciasSeleccionadas(selectedCompetencias);
    this.competenciasService.setPeriodo(this.periodo);

    // Aquí envías los IDs seleccionados donde lo necesites
    this.router.navigate(['/docente/calificar/'+this.id+'/notas/', this.id])

  }

}
