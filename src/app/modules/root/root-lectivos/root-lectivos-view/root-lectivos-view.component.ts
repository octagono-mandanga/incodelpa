import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from 'src/app/service/crud.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Matricula } from 'src/app/model/matricula';
import { Lectivo } from 'src/app/model/lectivo';
import { firstValueFrom } from 'rxjs';
import { Boletin } from 'src/app/model/boletin';

@Component({
  selector: 'app-root-lectivos-view',
  templateUrl: './root-lectivos-view.component.html',
  styleUrls: ['./root-lectivos-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      // Animación al insertar el elemento
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      // Animación al remover el elemento
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
      ])
    ])
  ]
})
export class RootLectivosViewComponent implements OnInit {
  public id!: string
  public success: boolean = true
  public loading: boolean = false
  public progress: boolean = false
  public progreso: number = 0

  public config: any
  public message!: string
  public msg!: string

  public curso: any
  public cont: number = 0
  public totalEstudiantes: number = 0
  public processedEstudiantes: number = 0
  public alumno: any
  public cursoalumnos: any = []
  public data = new Lectivo()
  public boletin = new Boletin();
  public boletines: Boletin[] = [];

  // Estado para los botones: 'cerrar', 'confirmar' y 'procesando'
  public actionState: string = 'cerrar';

  constructor(
    public activeRoute: ActivatedRoute,
    public router: Router,
    private crudService: CrudService<Lectivo>,
    private crudAnyService: CrudService<any>,
    private crudMatriculaService: CrudService<Matricula>,
  ) { }

  async ngOnInit() {
    this.loading = true
    this.msg = 'Lectivo'
    this.id =  this.activeRoute.snapshot.params['id']

    this.config = {
      columns: [
        { key: 'nivel', displayName: 'Nivel' },
        { key: 'inicio', displayName: 'Inicio' },
        { key: 'fin', displayName: 'Fin' },
        { key: 'estado', displayName: 'Estado' },
        { key: 'orden', displayName: 'Orden' },
      ],
      actions: {

      }
    };

    await this.crudService.read('/root/cursos/lectivo/'+this.id).subscribe({
      next: (res: any) => {
        this.data.setData(res.lectivo)
        this.data.setCursos(res.data)
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
         this.onMessage()
       }
    })
  }

  onMessage(){
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  // Al hacer clic en "Cerrar Lectivo" se pasa al estado 'confirmar'
  onCerrar() {
    this.actionState = 'confirmar';
  }

   // Al hacer clic en "Confirmar" se pasa al estado 'procesando'
   async onConfirmar() {
    this.actionState = 'procesando';
    this.progreso = 0;

    // 1. Calcular el total de estudiantes de todos los cursos
    this.totalEstudiantes = 0;
    for (const curso of this.data.cursos) {
      this.totalEstudiantes += curso.matriculas.length;
    }

    // Contador global de estudiantes procesados
    this.processedEstudiantes = 0;

    // Recorre cada curso de forma secuencial
    for (const curso of this.data.cursos) {
      // Inicializa el arreglo de alumnos por curso y asigna el curso actual
      this.cursoalumnos = [];
      this.curso = curso;
      this.cont++;

      // Recorre cada matrícula dentro del curso
      for (const matricula of curso.matriculas) {
        // Agrega el alumno actual
        this.cursoalumnos.push(matricula.alumno);
        this.alumno = matricula.alumno;

        // Incrementar el contador global de estudiantes procesados
        this.processedEstudiantes++;
        this.progreso = (this.processedEstudiantes / this.totalEstudiantes) * 100;

        // Llama a la API y espera a que la petición se complete

            this.boletin = new Boletin();
            const res: any = await firstValueFrom(this.crudMatriculaService.read('/root/matricula/' + matricula.id));
            await this.boletin.setBoletin(curso, res.data);
            await this.boletin.setPromocion(res.data);
            if(this.boletin.promocion.id===2){
              const habilita: any = await firstValueFrom(
                this.crudMatriculaService.read(`/root/habilitacion/${matricula.id}`)
              );
              await this.boletin.verificarHabilitacion(habilita.data);
            }
            await firstValueFrom(this.crudMatriculaService.read('/root/matricula/cerrar/' + matricula.id + '/' + this.boletin.promocion.id));
            this.boletines.push(this.boletin);

        }
        await firstValueFrom(this.crudAnyService.read(`/root/cursos/inactivar/${curso.id}`));
    }
    const res2: any = await firstValueFrom(this.crudAnyService.read(`/root/lectivos/inactivar/${this.id}`));
    if(res2.data.estado==='anterior'){
      this.router.navigate(['/root/lectivos/']);
    }
    // Finalmente, vuelve al estado 'cerrar' u otro que necesites
    this.curso = null;
    this.actionState = 'cerrar';
  }


  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



}
