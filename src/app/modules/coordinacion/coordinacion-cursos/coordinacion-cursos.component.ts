import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Curso } from 'src/app/model/curso';
import { Asignacion } from 'src/app/model/asignacion';
import { Periodo } from 'src/app/model/periodo';
import { Escala } from 'src/app/model/escala';
import { Materia } from 'src/app/model/materia';
import { User } from 'src/app/model/user';

import { ConsolidadoCurso, IApiResponse } from 'src/app/model/docs/consolidadoCurso';
import { Listado } from 'src/app/model/docs/listado';
import { Boletin } from 'src/app/model/boletin';
import { MatrizNotas } from 'src/app/model/matriz_notas';

import { CrudService } from 'src/app/service/crud.service';


import { Documento } from 'src/app/model/generardocumento';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { EBGaramond } from 'src/app/fonts/EBGaramond';
import { Lectivo } from 'src/app/model/lectivo';

//(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
(<any>pdfMake).vfs = {
  ...pdfFonts.pdfMake.vfs, // Mantén las fuentes predeterminadas
  ...EBGaramond // Agrega tu fuente personalizada
};

(<any>pdfMake).fonts = {
  Roboto: { // Esto mantiene la fuente predeterminada
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  },
  EBGaramondFont: { // Aquí defines tu fuente personalizada
    normal: 'EBGaramond.ttf',
    italics: 'EBGaramond-Italic.ttf'
  }
};

interface AsignacionConNotas {
  idasignacion: string;
  data: MatrizNotas;
}

@Component({
  selector: 'app-coordinacion-cursos',
  templateUrl: './coordinacion-cursos.component.html',
  styleUrls: ['./coordinacion-cursos.component.css']
})
export class CoordinacionCursosComponent implements OnInit {
  public config: any
  public data: Curso[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false


  public generatepdf: boolean = false
  public generatepdfMsg: string | undefined
  public docDefinition: any = Documento


  /** Soloa al inicio de año */
  public lectivos: Lectivo[] = []

  /** Variables para documentos con notas */
  public periodos: Periodo[] = []
  public escalas: Escala[] = []
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  public matriculados: User[] = []
  public notas: AsignacionConNotas[] = []

  public listados: Listado[] = [];
  public boletines: Boletin[] = [];


  public consolidadosPorCurso: ConsolidadoCurso[] = [];

  constructor(
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<any>,
    private crudMatriculaService: CrudService<any>,
    private crudLectivoService: CrudService<Lectivo>,
  ) {
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Curso' },
        { key: 'lectivo.nivel.nombre', displayName: 'Nivel' },
        { key: 'grado.nombre', displayName: 'Grado' },
        { key: 'director.primer_nombre', displayName: 'Director' },
        { key: 'director.primer_apellido', displayName: '' },
        { key: 'sede.nombre', displayName: 'Sede' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'add': '/coordinacion/cursos/add',
        'edit': '/coordinacion/cursos/edit/',
        'view': '/coordinacion/cursos/view/',
        'delete': true,
      }
    };
  }
  async ngOnInit() {
    this.loading = true

    this.crudService.read('/coordinacion/cursos').subscribe({
      next: async (data: Curso[]) => {
        this.data = data
        if (data.length === 0) {
          await this.loadLectivos();
        }
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los areas:', error);
      }
    });
  }

  onBorrar(id: any) {
    this.loading = true
    this.crudService.delete('/coordinacion/cursos/' + id).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(r => r.id !== id);
        this.message = res.message
        this.success = false
        this.loading = false
      },
      error: (error) => {


        this.message = 'Error al actualizar ' + error;
        this.success = false
        this.loading = false

      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  async onPdf(doc: number) {
    this.generatepdfMsg = undefined
    let cursos: any = []
    switch (doc) {
      case 1:
        this.generatepdf = true
        this.generatepdfMsg = 'Iniciando Proceso ...'
        this.docDefinition = new Documento()
        this.data.forEach((element: any) => {
          cursos.push({ curso: element, matriculados: element.matriculas })
        });
        this.docDefinition.listadoTodosCursos(cursos, (msg: string) => {
          this.generatepdfMsg = msg
        }).then(() => {
          this.generatepdfMsg = 'Generando Listados Simples ...'
          pdfMake.createPdf(this.docDefinition.def).download('Listados.pdf', () => {
            this.generatepdf = false
            this.generatepdfMsg = undefined
          });
        });
        break;
      case 2:
        this.generatepdf = true
        this.generatepdfMsg = 'Iniciando Proceso ...'
        this.docDefinition = new Documento()

        this.docDefinition.cursosAsignaciones(this.data, false, (msg: string) => {
          this.generatepdfMsg = msg
        }).then(() => {
          this.generatepdfMsg = 'Generando Listados por Asignatura ...'
          pdfMake.createPdf(this.docDefinition.def).download('Listados_asignacion.pdf', () => {
            this.generatepdf = false
            this.generatepdfMsg = undefined
          });
        });

        break;
      case 3:
        this.generatepdf = true
        this.generatepdfMsg = 'Iniciando Proceso ...'
        this.docDefinition = new Documento()
        try {
          await this.onLoadListados();
          this.generatepdfMsg = 'Generando Listados ...'


          this.docDefinition.listadoGeneralNotas(this.listados).then(() => {
            pdfMake.createPdf(this.docDefinition.def).download('ListadosConNotas.pdf', () => {
              this.generatepdf = false
            });
          });
        } catch (error) {
          this.generatepdf = false;
          this.generatepdfMsg = 'Iniciando Proceso ...' + error
        }

        break;
      case 4:
        this.generatepdf = true
        this.generatepdfMsg = 'Iniciando Proceso ...'
        this.docDefinition = new Documento()
        try {
          await this.onLoadBoletines();
          this.generatepdfMsg = 'Generando Boletines ...'
          this.docDefinition.boletinCurso(this.boletines).then(() => {
            pdfMake.createPdf(this.docDefinition.def).download('Boletin_Generales.pdf', () => {
              this.generatepdf = false

            });
          });
        } catch (error) {
          console.log('Error al generar boletines: ', error)
          this.generatepdfMsg = 'Proceso Fallo ...' + error
        }
        break;
      case 5:
        this.generatepdf = true
        this.generatepdfMsg = 'Iniciando Proceso ...'
        this.docDefinition = new Documento()
        try {
          await this.onLoadBoletines();
          this.generatepdfMsg = 'Generando Certificados ...'
          this.docDefinition.certificadoPromocion(this.boletines).then(() => {
            pdfMake.createPdf(this.docDefinition.def).download('Certificados_Generales.pdf', () => {
              this.generatepdf = false
            });
          });
        } catch (error) {
          console.log('Error al generar certificados: ', error)
          this.generatepdfMsg = 'Proceso errores ...' + error
        }
        break;
      case 6:
        this.generatepdf = true;
        this.generatepdfMsg = 'Iniciando proceso de consolidados...';
        try {
          // Llama al nuevo método que hace todo el trabajo
          await this.onLoadConsolidados();
          this.generatepdfMsg = this.success ? 'Proceso finalizado con éxito.' : 'Proceso detenido por un error.';
        } catch (error) {
          console.error('Error general en el proceso de consolidados: ', error);
          this.generatepdfMsg = `Proceso falló con errores: ${error}`;
          this.success = false;
        } finally {
          this.generatepdf = false; // Asegura que el spinner se oculte al final
        }
        break;
      case 7:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.data.forEach((element: any) => {
          cursos.push({ curso: element, matriculados: element.matriculas })
        });
        this.docDefinition.pazysalvo(cursos).then(() => {
          //PazSalvo.pdf es el nombre del archivo y necesito agregar el año
          let archivo = 'PazSalvo' + new Date().getFullYear() + '.pdf';
          pdfMake.createPdf(this.docDefinition.def).download(archivo, () => {
            this.generatepdf = false
          });
        });
        break;
      case 8:
        this.generatepdf = true;
        this.docDefinition = new Documento();
        this.generatepdfMsg = 'Calculando Rankings Generales...';
        console.log('Iniciando cálculo de rankings generales para todos los cursos...');

        const coursesResults: any[] = [];

        for (const curso of this.data) {
          try {
            this.generatepdfMsg = `Procesando ${curso.nombre}...`;
            // Fetch assignments/grades similar to onAsignaciones in view component
            const res: any = await firstValueFrom(this.crudAsignacionService.read('/coordinacion/asignaciones/curso/' + curso.id));

            const asignaciones = res.asignaciones;
            const periodos = res.periodos;
            this.escalas = res.escalas;
            const notas: any[] = [];

            // Transform to MatrizNotas structure
            asignaciones.forEach((element: any) => {
              let item2 = new MatrizNotas();
              item2.setData(element.matriculados);
              notas.push({ idasignacion: element.id, data: item2 });
            });

            // Calculate General Ranking
            const rankingGeneral = Curso.calcularRankingGeneral(notas, asignaciones, periodos);

            coursesResults.push({ curso: curso, ranking: rankingGeneral });

          } catch (error) {
            console.error(`Error calculando ranking para curso ${curso.nombre}:`, error);
          }
        }

        if (coursesResults.length > 0) {
          this.generatepdfMsg = 'Generando PDF...';
          this.docDefinition.puestosMultiplesCursos(coursesResults, this.escalas).then(() => {
            pdfMake.createPdf(this.docDefinition.def).download('Puestos_General.pdf', () => {
              this.generatepdf = false;
              this.generatepdfMsg = undefined;
            });
          });
        } else {
          this.generatepdf = false;
          this.generatepdfMsg = undefined;
        }
        console.log('Cálculo de rankings finalizado.');
        break;
    }
  }

  async onLoadConsolidados() {
    this.success = true;
    const consolidadosProcesados: ConsolidadoCurso[] = []; // Array para acumular resultados

    console.log("Fase 1...");
    // FASE 1: Recopilar y procesar los datos de todos los cursos
    for (const curso of this.data) {
      this.generatepdfMsg = `Cargando notas de ${curso.grado.nombre} (${curso.nombre})...`;
      try {
        const res: IApiResponse = await firstValueFrom(
          this.crudMatriculaService.readObject<IApiResponse>(`/coordinacion/matriculas/notascurso/${curso.id}`)
        );
        const consolidado = new ConsolidadoCurso(res.data);
        if (consolidado.alumnos.length > 0) {
          consolidadosProcesados.push(consolidado);
        } else {
          console.warn(`Curso ${curso.nombre} omitido por no tener alumnos.`);
        }
      } catch (error) {
        console.error('Error al cargar datos del curso: ', curso.nombre, error);
        this.generatepdfMsg = `Error cargando ${curso.nombre}: ${error}`;
        this.success = false;
        break;
      }
    }

    if (!this.success) return;
    console.log("Fase 2...");
    // FASE 2: Generar el PDF único si hay datos para mostrar
    if (consolidadosProcesados.length > 0) {
      this.generatepdfMsg = 'Generando documento PDF con todos los cursos...';

      this.docDefinition = new Documento();
      // Llamamos al nuevo método que maneja la LISTA de consolidados
      this.docDefinition.consolidadosMultiplesCursos(consolidadosProcesados).then(() => {
        pdfMake.createPdf(this.docDefinition.def).download('Consolidados_Generales.pdf', () => {
          this.generatepdf = false
          this.generatepdfMsg = 'Proceso finalizado con éxito.';
        });
      });
    } else {
      this.generatepdfMsg = 'No se encontraron alumnos en los cursos seleccionados.';
    }
  }

  async onLoadListados() {

    for (const curso of this.data) {
      this.generatepdfMsg = `Cargando Notas de  ${curso.grado.nombre} (${curso.nombre})...`;
      try {
        const res: any = await firstValueFrom(this.crudAsignacionService.read(`/coordinacion/asignaciones/curso/${curso.id}`));
        //this.disponibles = res.disponibles;
        this.asignaciones = res.asignaciones;
        this.periodos = res.periodos;
        //this.escalas = res.escalas;

        for (let asignacion of this.asignaciones) {
          let item = new Listado(curso, asignacion, this.periodos);
          this.listados.push(item);
        }
      }
      catch (error) {
        this.generatepdfMsg = `Error al cargar las asignaciones: ${error}`;
        this.success = false
        console.log('Error al cargar las asignaciones: ', error)
        break;
      }
    }
  }

  async onLoadBoletines() {
    for (const curso of this.data) {
      this.generatepdfMsg = `Cargando Información de ${curso.grado.nombre} (${curso.nombre})...`;

      try {
        const res: any = await firstValueFrom(
          this.crudMatriculaService.read('/coordinacion/matriculas/notascurso/' + curso.id)
        );

        // **🔹 Ordenar los alumnos alfabéticamente**
        res.data.sort((a: any, b: any) => {
          return a.alumno.primer_apellido.localeCompare(b.alumno.primer_apellido) ||
            a.alumno.segundo_apellido.localeCompare(b.alumno.segundo_apellido) ||
            a.alumno.primer_nombre.localeCompare(b.alumno.primer_nombre) ||
            a.alumno.segundo_nombre.localeCompare(b.alumno.segundo_nombre);
        });

        for (const matricula of res.data) {
          let boletin = new Boletin();
          boletin.setBoletin(curso, matricula);
          this.boletines.push(boletin);

          // **🔹 Verificar habilitación si el concepto es "Debes habilitar las siguientes áreas"**
          if (boletin.promocion.concepto.includes('Debes habilitar las siguientes áreas:')) {
            console.log("🔍 Verificando habilitación para matrícula: ", matricula);
            await this.verificarHabilitacion(matricula.id, boletin);
          }
        }

        // **🔹 Asignar el puesto de cada boletín**
        this.boletines.forEach((boletin: Boletin) => {
          boletin.setPuesto(this.boletines);
        });

      } catch (error) {
        console.error('Error al cargar los boletines:', error);
      }


    }
  }
  async verificarHabilitacion(matriculaId: string, boletin: Boletin) {
    try {
      const res: any = await firstValueFrom(
        this.crudMatriculaService.read(`/coordinacion/habilitacion/verificar/${matriculaId}`)
      );


      if (res.data && res.data.asignaturas_aprobadas?.length > 0) {

        // Convertir lista de áreas aprobadas a un Set de nombres de áreas
        const areasAprobadas = new Set(res.data.asignaturas_aprobadas.map((a: any) => a.area));


        // Filtrar las áreas perdidas para ver si fueron habilitadas
        const nuevasAreasPerdidas = boletin.promocion.areasPerdidas.filter((area: string) => !areasAprobadas.has(area));

        if (nuevasAreasPerdidas.length < boletin.promocion.areasPerdidas.length) {
          boletin.promocion.areasPerdidas = nuevasAreasPerdidas;

          // Si ya no tiene áreas perdidas, modificar concepto
          if (nuevasAreasPerdidas.length === 0) {
            boletin.promocion.concepto = `El alumno realizó proceso de recuperación y aprobó todas las áreas.`;
          } else {
            boletin.promocion.concepto = `El alumno realizó proceso de recuperación en las siguientes áreas: ${nuevasAreasPerdidas.join(", ")}`;
          }

        }
      }
    } catch (error) {
      console.error(`❌ Error al verificar habilitación de la matrícula ${matriculaId}:`, error);
    }
  }

  async loadLectivos() {
    this.loading = true
    await this.crudLectivoService.read('/coordinacion/lectivos').subscribe({
      next: (data: Lectivo[]) => {
        this.lectivos = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los lectivos:', error);
      }
    });
  }


  onImportar() {
    this.message = 'Simulando importación de cursos...';
    this.success = true;
    setTimeout(() => (this.message = ''), 3000);
  }
}


