import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Competencia } from 'src/app/model/competencia';
import { Periodo } from 'src/app/model/periodo';
import { Escala } from 'src/app/model/escala';
import { CompetenciasSeleccionadasService } from 'src/app/service/competencias-seleccionadas.service';
import { CrudService } from 'src/app/service/crud.service';
import { Location } from '@angular/common';
import { Matricula } from 'src/app/model/matricula';
import { AlumnoCalificarComponent } from 'src/app/shared/alumno-calificar/alumno-calificar.component';
import { Notacompetencia } from 'src/app/model/notacompetencia';

@Component({
  selector: 'app-docente-calificar-ingresar-notas',
  templateUrl: './docente-calificar-ingresar-notas.component.html',
  styleUrls: ['./docente-calificar-ingresar-notas.component.css']
})
export class DocenteCalificarIngresarNotasComponent implements AfterViewInit {
  @ViewChildren(AlumnoCalificarComponent) alumnoCalif?: QueryList<AlumnoCalificarComponent>



  public id!: string
  public message!: string
  public msg!: string
  public success: boolean = true

  public loading: boolean = false
  public loading2: boolean = false

  public metodo: boolean = false

  public selectedCompetencias: Competencia[] = [];
  public periodo: Periodo = new Periodo;
  public asignacion: Asignacion = new Asignacion
  public escalas: Escala[] = []
  public matriculas: Matricula[] = []
  public notas: Notacompetencia[] = []

  private listalumnoCalif: AlumnoCalificarComponent[] = [];

  constructor(
    private activedRoute: ActivatedRoute,
    private competenciasService: CompetenciasSeleccionadasService,
    private crudService: CrudService<Asignacion>,
    private crudMatriculaService: CrudService<Matricula>,
    private crudEscalaService: CrudService<Escala>,
    private crudNotaService: CrudService<Notacompetencia>,
    private location: Location
  ){}

  async ngOnInit() {
    this.id = this.activedRoute.snapshot.params['id']
    this.loading = true
    this.msg = 'Asignación'
    this.competenciasService.competenciasSeleccionadas.subscribe(items => {
      this.selectedCompetencias = items;
    });
    await this.competenciasService.periodo.subscribe(item => {
      this.periodo = item;
      if (!this.periodo || Object.keys(this.periodo).length === 0) {
        this.location.back();
      }
    });
    await this.crudService.read('/docente/asignaciones/'+this.id).subscribe({
      next: (res: any) => {
        this.asignacion = res.data
        this.cargarMatricula()
        this.msg = 'Alumnos'
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })

  }

  ngAfterViewInit(): void {
    this.alumnoCalif?.changes.subscribe((comps: QueryList<AlumnoCalificarComponent>) => {
      this.listalumnoCalif = comps.toArray()
      this.listalumnoCalif[0].enfocarSiguienteInput(-1);
    });
  }

  async cargarMatricula(){
    await this.crudMatriculaService.read('/docente/matriculas/'+this.asignacion.curso.id).subscribe({
      next: (res: any) => {
        this.matriculas = res.data
        this.msg = 'Escalas'
        this.cargarEscala()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async cargarEscala(){
    await this.crudEscalaService.read('/docente/escalas/'+this.asignacion.curso.lectivo.nivel).subscribe({
      next: (res: any) => {
        this.escalas = res.data
        this.msg = 'Notas'
        this.cargarNotas()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async cargarNotas(){
    await this.crudNotaService.read('/docente/notas/asignacion/'+this.id).subscribe({
      next: (res: any) =>{
        this.notas = res.data
        this.loading = false
        this.msg = ''
      },
      error: (error) =>{},
    })
  }
  enfocarAlumno(index: number): void {
    const siguienteIndex = index + 1;
    if (this.listalumnoCalif && siguienteIndex < this.listalumnoCalif.length) {
      this.listalumnoCalif[siguienteIndex].enfocarSiguienteInput(-1);
    }
  }

  //Usada para pasar a la siguiente FullNota
  enfocarSiguienteAlumno(index: number): void {
    const siguienteIndex = index + 1;
    if (this.listalumnoCalif && siguienteIndex < this.listalumnoCalif.length) {
      this.listalumnoCalif[siguienteIndex].enfocarFullInput(-1);
    }
  }
  procesarNota(data: any){
    const matricula = this.matriculas.find(item => item.alumno.id === data.alumno)
    data.matricula =  matricula?.id
    data.asignacion = this.id
    data.periodo = this.periodo.id
    this.loading2 = true
    this.crudNotaService.create(data, '/docente/notas').subscribe({
      next: (res: any) => {
        this.loading2 = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })


  }

  procesarNotaFull(data: any){
    const matricula = this.matriculas.find(item => item.alumno.id === data.alumno)
    data.matricula =  matricula?.id
    data.asignacion = this.id
    data.periodo = this.periodo.id
    data.competencias = []
    this.selectedCompetencias.forEach((item)=>{
      data.competencias.push(item.id)
    })

    this.loading2 = true
    this.crudNotaService.create(data, '/docente/notas/full').subscribe({
      next: (res: any) => {
        this.loading2 = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })


  }

  filtrarNotas(matricula: string): Notacompetencia[]{
    const notas = this.notas.filter(item => (item.matricula == matricula)&&(item.periodo == this.periodo.id))
    return notas
  }
}
