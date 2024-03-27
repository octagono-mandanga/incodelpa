import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Escala } from 'src/app/model/escala';
import { Notacompetencia } from 'src/app/model/notacompetencia';
import { Periodo } from 'src/app/model/periodo';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

interface iMatriz {
  alumno: User
  notas: number[]
  total: number
}
@Component({
  selector: 'app-docente-asignacion-item',
  templateUrl: './docente-asignacion-item.component.html',
  styleUrls: ['./docente-asignacion-item.component.css']
})
export class DocenteAsignacionItemComponent implements OnInit {
  public loading: boolean =  false
  public success: boolean =  false
  public id!: string
  public message!: string
  public msg: string = ''

  public asignacion!: Asignacion
  public escalas: Escala[] = []
  public periodos: Periodo[] = []
  public data: any
  public matriz!: iMatriz[]

  constructor(
    private crudAsignacionService: CrudService<Asignacion>,
    private crudNotasService: CrudService<Notacompetencia>,
    private activedRoute: ActivatedRoute
  ){}
  ngOnInit() {
    this.id = this.activedRoute.snapshot.params['id']
    this.loading = true
    this.msg = 'Asignación'
    this.crudAsignacionService.read('/docente/asignaciones/'+this.id).subscribe({
      next: (res: any) => {
        this.asignacion = res.data
        this.msg = 'Notas'
        this.cargarNotas()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    });
  }

  cargarNotas(){
    this.crudAsignacionService.read('/docente/notas/notas-asignacion2/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.escalas = res.escalas
        this.periodos = res.periodos
        this.onMatriz()
        this.loading = false
        this.msg = 'Matriz'
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    });
  }

  onMatriz() {
    // Asegurarse de que matriz está inicializada y es un array vacío al comienzo
    this.matriz = [];

    this.data.forEach((element: any) => {
        // Construir el nombre completo del alumno
        const alumnoNombre = new User;

        // Buscar si el alumno ya existe en la matriz
        const alumnoIndex = this.matriz.findIndex(matrizItem => matrizItem.alumno.id === element.id);

        if (alumnoIndex !== -1) {
            // Si el alumno ya existe, solo añadir la nota a sus notas
            this.matriz[alumnoIndex].notas.push(element.lanota);
            this.matriz[alumnoIndex].total = this.matriz[alumnoIndex].total + (element.lanota * element.porcentaje/100);
        } else {
            // Si el alumno no existe, añadir un nuevo objeto para el alumno con la primera nota
            alumnoNombre.setData(element)
            this.matriz.push({
                alumno: alumnoNombre,
                notas: [element.lanota],
                total: element.lanota * element.porcentaje/100
            });
        }
        this.msg = ''
    });
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
