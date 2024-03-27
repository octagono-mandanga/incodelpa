import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { Escala } from 'src/app/model/escala';
import { Materia } from 'src/app/model/materia';
import { MatrizNotas } from 'src/app/model/matriz_notas';
import { Periodo } from 'src/app/model/periodo';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

interface AsignacionConNotas {
  idasignacion: string;
  data: MatrizNotas;
}

@Component({
  selector: 'app-coordinacion-cursos-view',
  templateUrl: './coordinacion-cursos-view.component.html',
  styleUrls: ['./coordinacion-cursos-view.component.css']
})
export class CoordinacionCursosViewComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Curso
  public periodos: Periodo[] = []
  public escalas: Escala[] = []
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  public matriculados: User[] = []
  public notas: AsignacionConNotas[] = []

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<Asignacion>,
    private crudMatriculaService: CrudService<User>,
  ){}
  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    this.msg = 'Curso'
    await this.crudService.read('/coordinacion/cursos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.msg = 'Asignaciones'
        this.onAsignaciones()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
         this.onMessage()
       }
    })

  }

  async onAsignaciones(){
    await this.crudAsignacionService.read('/coordinacion/asignaciones/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.disponibles = res.disponibles
        this.asignaciones = res.asignaciones
        this.periodos = res.periodos
        this.escalas = res.escalas
        this.asignaciones.forEach(element => {
          let item2 = new MatrizNotas
          item2.setData(element.matriculados)
          this.notas.push({idasignacion: element.id, data: item2})
        });
        this.msg = 'Matriculas'
        this.onMatriculas()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
         this.onMessage()
       }
    })
  }

  async onMatriculas(){
    await this.crudMatriculaService.read('/coordinacion/matriculas/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.matriculados = res.data
        this.msg = ''
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

  getColor(nota: number): string {
    if (!this.escalas) {
      console.warn('escalas no está definido');
      return 'black';
    }

    const escalaEncontrada = this.escalas.find((item: Escala) => nota >= item.minimo && nota <= item.maximo);
    return escalaEncontrada ? escalaEncontrada.color : 'black';
  }
}
