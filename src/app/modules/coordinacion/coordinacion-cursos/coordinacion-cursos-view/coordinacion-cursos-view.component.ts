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

import { Documento } from 'src/app/model/generardocumento';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Boletin } from 'src/app/model/boletin';
import { Consolidado } from 'src/app/model/consolidado';
import { Puesto } from 'src/app/model/puesto';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


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
  public progress: boolean = false
  public data!: Curso
  public periodos: Periodo[] = []
  public escalas: Escala[] = []
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  public matriculados: User[] = []
  public notas: AsignacionConNotas[] = []

  public boletines: Boletin[] = [];


  public generatepdf: boolean = false
  public docDefinition: any = Documento

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<Asignacion>,
    private crudMatriculaService: CrudService<any>,
  ) { }
  async ngOnInit() {
    this.loading = true
    this.id = this.route.snapshot.params['id']
    this.msg = 'Curso'
    await this.crudService.read('/coordinacion/cursos/' + this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.msg = 'Asignaciones'
        this.onAsignaciones()
      },
      error: (error) => {
        this.message = 'Error al cargar el area : ' + error
        this.success = false
        this.loading = false
        this.onMessage()
      }
    })

  }

  async onAsignaciones() {
    await this.crudAsignacionService.read('/coordinacion/asignaciones/curso/' + this.id).subscribe({
      next: (res: any) => {
        this.disponibles = res.disponibles
        this.asignaciones = res.asignaciones
        this.periodos = res.periodos
        this.escalas = res.escalas
        this.asignaciones.forEach(element => {
          let item2 = new MatrizNotas
          item2.setData(element.matriculados)
          this.notas.push({ idasignacion: element.id, data: item2 });
        });
        this.msg = 'Matriculas'
        this.onMatriculas()
      },
      error: (error) => {
        this.message = 'Error al cargar el area : ' + error
        this.success = false
        this.loading = false
        this.onMessage()
      }
    })
  }

  async onMatriculas() {
    await this.crudMatriculaService.read('/coordinacion/matriculas/curso/' + this.id).subscribe({
      next: (res: any) => {
        this.matriculados = res.data
        this.msg = ''
        this.loading = false
      },
      error: (error) => {
        this.message = 'Error al cargar el area : ' + error
        this.success = false
        this.loading = false
        this.onMessage()
      }
    })
  }
  onMessage() {
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

  onPdf(doc: string) {

    switch (doc) {
      case 'boletin-individual':
        let cursos: any = []
        this.progress = true
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.crudMatriculaService.read('/coordinacion/matriculas/notascurso/' + this.id).subscribe({
          next: async (res: any) => {
            await res.data.sort((a: any, b: any) => {
              // Comparamos por primer apellido
              if (a.alumno.primer_apellido < b.alumno.primer_apellido) return -1;
              if (a.alumno.primer_apellido > b.alumno.primer_apellido) return 1;

              // Si los primeros apellidos son iguales, comparamos por segundo apellido
              if (a.alumno.segundo_apellido < b.alumno.segundo_apellido) return -1;
              if (a.alumno.segundo_apellido > b.alumno.segundo_apellido) return 1;

              // Si los segundos apellidos también son iguales, comparamos por primer nombre
              if (a.alumno.primer_nombre < b.alumno.primer_nombre) return -1;
              if (a.alumno.primer_nombre > b.alumno.primer_nombre) return 1;

              // Finalmente, si los primeros nombres son iguales, comparamos por segundo nombre
              if (a.alumno.segundo_nombre < b.alumno.segundo_nombre) return -1;
              if (a.alumno.segundo_nombre > b.alumno.segundo_nombre) return 1;

              // Si todo es igual, mantenemos el orden original
              return 0;
            });


            await res.data.forEach((matricula: any) => {
              if (matricula.curso_r && matricula.curso_r.asignaciones) {
                matricula.curso_r.asignaciones.sort((a: any, b: any) => {
                  const areaA = a.materia.area.nombre.toLowerCase();
                  const areaB = b.materia.area.nombre.toLowerCase();
                  const materiaA = a.materia.nombre.toLowerCase();
                  const materiaB = b.materia.nombre.toLowerCase();

                  if (areaA < areaB) return -1;
                  if (areaA > areaB) return 1;
                  if (materiaA < materiaB) return -1;
                  if (materiaA > materiaB) return 1;
                  return 0;
                });
              }
            });
            await res.data.forEach((matricula: any) => {
              let boletin = new Boletin()
              boletin.setBoletin(this.data, matricula)
              this.boletines.push(boletin)
            });

            await this.boletines.forEach((boletin: Boletin) => {
              boletin.setPuesto(this.boletines);
            });

            this.docDefinition.boletinCurso(this.boletines).then(() => {
              pdfMake.createPdf(this.docDefinition.def).download('Boletin_' + this.data.nombre + '.pdf', () => {
                this.generatepdf = false
                this.progress = false
              });
            });
          }
        })
        break;
      case 'consolidado':
        this.progress = true
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.crudMatriculaService.read('/coordinacion/matriculas/notascurso/' + this.id).subscribe({
          next: async (res: any) => {
            await res.data.sort((a: any, b: any) => {
              // Comparamos por primer apellido
              if (a.alumno.primer_apellido < b.alumno.primer_apellido) return -1;
              if (a.alumno.primer_apellido > b.alumno.primer_apellido) return 1;

              // Si los primeros apellidos son iguales, comparamos por segundo apellido
              if (a.alumno.segundo_apellido < b.alumno.segundo_apellido) return -1;
              if (a.alumno.segundo_apellido > b.alumno.segundo_apellido) return 1;

              // Si los segundos apellidos también son iguales, comparamos por primer nombre
              if (a.alumno.primer_nombre < b.alumno.primer_nombre) return -1;
              if (a.alumno.primer_nombre > b.alumno.primer_nombre) return 1;

              // Finalmente, si los primeros nombres son iguales, comparamos por segundo nombre
              if (a.alumno.segundo_nombre < b.alumno.segundo_nombre) return -1;
              if (a.alumno.segundo_nombre > b.alumno.segundo_nombre) return 1;

              // Si todo es igual, mantenemos el orden original
              return 0;
            });


            await res.data.forEach((matricula: any) => {
              if (matricula.curso_r && matricula.curso_r.asignaciones) {
                matricula.curso_r.asignaciones.sort((a: any, b: any) => {
                  const areaA = a.materia.area.nombre.toLowerCase();
                  const areaB = b.materia.area.nombre.toLowerCase();
                  const materiaA = a.materia.nombre.toLowerCase();
                  const materiaB = b.materia.nombre.toLowerCase();

                  if (areaA < areaB) return -1;
                  if (areaA > areaB) return 1;
                  if (materiaA < materiaB) return -1;
                  if (materiaA > materiaB) return 1;
                  return 0;
                });
              }
            });

            let consolidado = new Consolidado();
            consolidado.setConsolidado(this.data, this.periodos, res.data, this.escalas);
            this.docDefinition.consolidadoCurso(consolidado).then(() => {
              pdfMake.createPdf(this.docDefinition.def).download('Consolidado_' + this.data.nombre + '.pdf', () => {
                this.generatepdf = false
                this.progress = false
              });
            });
          }
        })
        break;
      case 'puesto':
        this.progress = true;
        this.generatepdf = true;
        this.docDefinition = new Documento();

        const orderedRankings = Curso.calcularRankings(this.notas, this.asignaciones, this.periodos);

        if (this.generatepdf) {
          this.docDefinition.puestosCurso(orderedRankings, this.escalas).then(() => {
            pdfMake.createPdf(this.docDefinition.def).download('Puestos_' + this.data.nombre + '.pdf', () => {
              this.generatepdf = false
              this.progress = false
            });
          });
        }
        break;

    }
  }
}
