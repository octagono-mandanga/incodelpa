import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Escala } from 'src/app/model/escala';
import { Matricula } from 'src/app/model/matricula';
import { Notacompetencia } from 'src/app/model/notacompetencia';
import { Periodo } from 'src/app/model/periodo';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-docente-calificar-reporte',
  templateUrl: './docente-calificar-reporte.component.html',
  styleUrls: ['./docente-calificar-reporte.component.css']
})
export class DocenteCalificarReporteComponent implements OnInit {
  public id!: string
  public message!: string
  public msg!: string
  public success: boolean = true

  public loading: boolean = false
  public asignacion: Asignacion = new Asignacion
  public escalas: Escala [] = []
  public data: any

  public matriz: any

  constructor(
    private crudAsignacionService: CrudService<Asignacion>,
    private crudNotaService: CrudService<Notacompetencia>,
    private activedRoute: ActivatedRoute
  ) {}
  async ngOnInit() {
    this.id = this.activedRoute.snapshot.params['id']
    this.loading = true
    this.msg = 'Asignación'
    await this.crudAsignacionService.read('/docente/asignaciones/'+this.id).subscribe({
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
    })
  }
  cargarNotas(){
    this.crudNotaService.read('/docente/notas/notas-asignacion/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res
        this.escalas = res.escalas
        this.cargarMatriz()
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  cargarMatriz() {
    this.matriz = { alumnos: [] };

    this.data.matriculas.forEach((item:  any) => {
      const alumnoConPeriodos = {
        ...item.alumno, // Copia las propiedades del alumno
        periodos: this.data.periodos.map((periodo: any) => ({ ...periodo, notasPorCompetencia: [], notaTotal: 0 })) // Crea una copia de los periodos para cada alumno
      };
      this.matriz.alumnos.push(alumnoConPeriodos);
    });

    this.matriz.alumnos.forEach((alumno: any) => {
      alumno.periodos.forEach((periodo: any) => {
        const notasDePeriodo = this.data.data.filter((nota: any) =>
          nota.matricula.alumno.id === alumno.id && nota.periodo.id === periodo.id
        );

        let sumaNotas = 0;

        notasDePeriodo.forEach((nota: any) => {
          periodo.notasPorCompetencia.push({
            competencia: nota.competencia,
            nota: parseFloat(nota.nota)
          });
          sumaNotas += parseFloat(nota.nota);
        });

        if (notasDePeriodo.length > 0) {
          periodo.notaTotal = sumaNotas / notasDePeriodo.length;
          periodo.notaTotal = Number(periodo.notaTotal)
          periodo.notaTotal = parseFloat(periodo.notaTotal.toFixed(1))
        }
      });
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
