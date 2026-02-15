import { Component, OnInit } from '@angular/core';
import { Asignacion } from 'src/app/model/asignacion';
import { CrudService } from 'src/app/service/crud.service';
import { Documento } from 'src/app/model/generardocumento';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { MatrizNotas } from 'src/app/model/matriz_notas';
import { Curso } from 'src/app/model/curso';
import { firstValueFrom } from 'rxjs';
import { Listado } from 'src/app/model/docs/listado';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-docente-asignaciones',
  templateUrl: './docente-asignaciones.component.html',
  styleUrls: ['./docente-asignaciones.component.css']
})
export class DocenteAsignacionesComponent implements OnInit {
  public message!: string
  public success: boolean = true

  public loading: boolean = false
  public generatepdf: boolean = false
  public generatepdfMsg: string | undefined
  public docDefinition: any
  public escalas: any[] = []
  public listados: any[] = []

  public data: Asignacion[] = []



  constructor(
    private crudAsignacionService: CrudService<Asignacion>,
  ) { }
  async ngOnInit() {
    this.loading = true

    await this.crudAsignacionService.read('/docente/asignaciones').subscribe({
      next: (res: any) => {
        this.data = res.data
        this.loading = false
      },
      error: (error) => {
        this.message = 'Error al cargar el area : ' + error
        this.success = false
        this.loading = false
      }
    })
  }

  async fetchDetails(id: string): Promise<any> {
    try {
      const res: any = await firstValueFrom(this.crudAsignacionService.read('/docente/asignaciones/' + id));
      return res.data;
    } catch (error) {
      console.error(`Error fetching details for assignment ${id}:`, error);
      return null;
    }
  }

  async onPdf(doc: number, itemId?: string) {
    this.generatepdf = true;
    this.generatepdfMsg = 'Obteniendo detalles de estudiantes...';
    this.success = true;

    try {
      this.docDefinition = new Documento();

      let itemsToProcess: any[] = [];

      if (itemId) {
        const detail = await this.fetchDetails(itemId);
        if (detail) {
          // Prioritize detail.curso.matriculas based on user feedback
          detail.matriculados = detail.curso?.matriculas || detail.matriculas || detail.matriculados || [];

          // Normalize structure
          if (detail.matriculados.length > 0) {
            detail.matriculados.forEach((m: any, index: number) => {
              // Case: Nested alumno.alumno
              if (m.alumno && m.alumno.alumno) {
                m.alumno = { ...m.alumno, ...m.alumno.alumno };
              }
              // Case: Raw student object (no alumno wrapper)
              else if (!m.alumno && m.primer_apellido) {
                detail.matriculados[index] = { alumno: m };
              }
            });
          }
          itemsToProcess.push(detail);
        }
      } else {
        // Fetch details for ALL assignments sequentially to show progress and avoid overload
        const total = this.data.length;
        for (let i = 0; i < total; i++) {
          const item = this.data[i];
          this.generatepdfMsg = `Cargando datos de ${item.materia.nombre} [${item.curso.nombre}] (${i + 1}/${total})...`;
          const detail = await this.fetchDetails(item.id);

          if (detail) {
            // Prioritize detail.curso.matriculas based on user feedback
            detail.matriculados = detail.curso?.matriculas || detail.matriculas || detail.matriculados || [];

            // Normalize structure
            if (detail.matriculados.length > 0) {
              detail.matriculados.forEach((m: any, index: number) => {
                // Case: Nested alumno.alumno
                if (m.alumno && m.alumno.alumno) {
                  m.alumno = { ...m.alumno, ...m.alumno.alumno };
                }
                // Case: Raw student object (no alumno wrapper)
                else if (!m.alumno && m.primer_apellido) {
                  detail.matriculados[index] = { alumno: m };
                }
              });
            }

            itemsToProcess.push(detail);
          }
        }
      }
      this.generatepdfMsg = 'Generando documento...';

      switch (doc) {
        case 1: // Listados Simples
          const cursos: any[] = itemsToProcess.map(item => ({
            curso: item.curso,
            matriculados: item.matriculados,
            asignatura: item.materia.nombre
          }));
          await this.docDefinition.listadoTodosCursos(cursos);
          pdfMake.createPdf(this.docDefinition.def).download('Listados_Simples.pdf');
          break;

        case 2: // Listados por Asignatura
          // Wrap assignments in a structure mimicking a Course with 'asignaciones' and 'matriculas'
          const dummyCourses = itemsToProcess.map(a => {
            // Create safe assignment with robust teacher data to prevent crash
            const safeAsignacion = {
              ...a,
              docente: {
                ...a.docente,
                primer_nombre: a.docente?.primer_nombre || '',
                primer_apellido: a.docente?.primer_apellido || ''
              }
            };

            return {
              ...a.curso,
              //nombre: a.materia.nombre, // Reverting: let original course name be used. 
              // Header of "Curso" col will be "COURSE - GRADE" handled by isDocente flag
              matriculas: a.matriculados || [],
              asignaciones: [safeAsignacion]
            };
          });
          // Pass true for isDocente to hide Docente column and reformat Curso column
          await this.docDefinition.cursosAsignaciones(dummyCourses, true);
          pdfMake.createPdf(this.docDefinition.def).download('Listados_Asignatura.pdf');
          break;

        case 3: // Listados con Notas
          this.generatepdfMsg = 'Cargando datos extendidos...';
          const listados: Listado[] = [];
          for (let i = 0; i < itemsToProcess.length; i++) {
            const item = itemsToProcess[i];
            this.generatepdfMsg = `Cargando notas de ${item.materia.nombre} [${item.curso.nombre}] (${i + 1}/${itemsToProcess.length})...`;

            // Fetch grades for this assignment
            const gradeData = await this.fetchGrades(item.id);

            if (gradeData) {
              // Construct a temporary assignment object where 'matriculados' holds the raw grade data
              // This is what Listado constructor expects to pivot the data
              const tempAsignacion = {
                ...item,
                matriculados: gradeData.data
              };

              const listado = new Listado(item.curso, tempAsignacion, gradeData.periodos);
              listados.push(listado);
            }
          }
          await this.docDefinition.listadoGeneralNotas(listados, true);
          pdfMake.createPdf(this.docDefinition.def).download('Listados_Notas.pdf');
          break;

        case 8: // Puestos
          this.generatepdfMsg = 'Calculando Rankings...';

          const coursesResults: any[] = [];

          // Process each assignment individually to generate Subject-Specific Rankings
          for (let i = 0; i < itemsToProcess.length; i++) {
            const item = itemsToProcess[i];
            this.generatepdfMsg = `Obteniendo notas calculo ranking ${item.materia.nombre}...`;
            const grades = await this.fetchGrades(item.id);

            if (grades) {
              // Calculate ranking for THIS assignment only
              const itemWithGrades = { ...item, matriculados: grades.data };

              let item2 = new MatrizNotas();
              item2.setData(grades.data);

              // We wrap it in an array because the calculator expects a list of assignments
              const notas = [{ idasignacion: item.id, data: item2 }];
              const assignmentsList = [itemWithGrades];

              const rankingGeneral = Curso.calcularRankingGeneral(notas, assignmentsList, grades.periodos);

              // Create a dummy course object to Display SUBJECT NAME in the header
              // The 'puestosMultiplesCursos' method uses curso.nombre for the header title.
              const dummyCourseHeader = {
                ...item.curso,
                nombre: item.materia.nombre // Override Course Name with Subject Name
              };

              // Capture scales from the first available source
              if (!this.escalas || this.escalas.length === 0) {
                this.escalas = grades.escalas;
              }

              coursesResults.push({ curso: dummyCourseHeader, ranking: rankingGeneral });
            }
          }

          if (coursesResults.length > 0) {
            await this.docDefinition.puestosMultiplesCursos(coursesResults, this.escalas, true);
            pdfMake.createPdf(this.docDefinition.def).download('Puestos.pdf');
          }
          break;
      }

      this.generatepdfMsg = 'Proceso finalizado con éxito.';

    } catch (error) {
      console.error('Error general en el proceso: ', error);
      this.generatepdfMsg = `Proceso falló con errores: ${error}`;
      this.success = false;
    } finally {
      this.generatepdf = false;
    }
  }

  async fetchGrades(id: string): Promise<any> {
    try {
      const res: any = await firstValueFrom(this.crudAsignacionService.read(`/docente/notas/notas-asignacion2/${id}`));
      return { data: res.data, periodos: res.periodos, escalas: res.escalas };
    } catch (error) {
      console.error(`Error fetching grades for assignment ${id}:`, error);
      return null;
    }
  }

}
