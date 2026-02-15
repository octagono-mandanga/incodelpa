import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Curso } from 'src/app/model/curso';
import { Asignacion } from 'src/app/model/asignacion';
import { Periodo } from 'src/app/model/periodo';
import { Escala } from 'src/app/model/escala';
import { Materia } from 'src/app/model/materia';
import { User } from 'src/app/model/user';

import { CrudService } from 'src/app/service/crud.service';

import { Listado } from 'src/app/model/docs/listado';
import { Boletin } from 'src/app/model/boletin';
import { MatrizNotas } from 'src/app/model/matriz_notas';

import { Documento } from 'src/app/model/generardocumento';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface AsignacionConNotas {
  idasignacion: string;
  data: MatrizNotas;
}

@Component({
  selector: 'app-secretaria-cursos',
  templateUrl: './secretaria-cursos.component.html',
  styleUrls: ['./secretaria-cursos.component.css']
})
export class SecretariaCursosComponent implements OnInit {
  public config: any
  public data: Curso[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  public generatepdf: boolean = false
  public generatepdfMsg: string | undefined
  public docDefinition: any = Documento

  /** Variables para documentos con notas */
  public periodos: Periodo[] = []
  public escalas: Escala[] = []
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  public matriculados: User[] = []
  public notas: AsignacionConNotas[] = []

  public listados: Listado[] = [];
  public  boletines: Boletin[] = [];

  constructor(
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<any>,
    private crudMatriculaService: CrudService<any>,
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
        'view': '/secretaria/cursos/view/'
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/secretaria/cursos').subscribe({
      next: (data: Curso[]) => {
        this.data = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los areas:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/secretaria/cursos/'+ id).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(r => r.id !== id);
        this.message = res.message
        this.success = false
        this.loading = false
      },
      error: (error) => {


        this.message = 'Error al actualizar '+ error;
        this.success = false
        this.loading = false

      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  async onPdf(doc: number){
    this.generatepdfMsg = undefined
    const cursos: any = []

    switch(doc){
      case 1:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.data.forEach((element: any) => {
          cursos.push({curso: element, matriculados: element.matriculas})
        });
        this.docDefinition.listadoTodosCursos(cursos).then(() => {
          pdfMake.createPdf(this.docDefinition.def).download('Listados.pdf', ()=>{
            this.generatepdf = false
          });
        });

      break;

      case 2:
        this.generatepdf = true
        this.docDefinition = new Documento()

        this.docDefinition.cursosAsignaciones(this.data).then(() => {
          pdfMake.createPdf(this.docDefinition.def).download('Listados_asignacion.pdf', ()=>{
            this.generatepdf = false
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
            pdfMake.createPdf(this.docDefinition.def).download('ListadosConNotas.pdf', ()=>{
              this.generatepdf = false
            });
          });
        } catch (error) {
          this.generatepdf = false;
          this.generatepdfMsg = 'Iniciando Proceso ...'+error
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
            pdfMake.createPdf(this.docDefinition.def).download('Boletin_Generales.pdf', ()=>{
              this.generatepdf = false

            });
          });
        } catch (error) {
          console.log('Error al generar boletines: ', error)
          this.generatepdfMsg = 'Iniciando Proceso ...'+error
        }
      break;

      case 10:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.generatepdfMsg = 'Iniciando Proceso ...'
        this.data.forEach((element: any) => {
          cursos.push({curso: element, matriculados: element.matriculas})
        });
        this.docDefinition.listadoTodosCursosAsistencia(cursos).then(() => {
          pdfMake.createPdf(this.docDefinition.def).download('ListadosAsistencia.pdf', ()=>{
            this.generatepdf = false
          });
        });

      break;

      }

  }


  async onLoadListados(){
    for (const curso of this.data) {
      this.generatepdfMsg = `Cargando Notas de  ${curso.grado.nombre} (${curso.nombre})...`;
      try {
        const res: any = await firstValueFrom(this.crudAsignacionService.read(`/secretaria/asignaciones/curso/${curso.id}`));
        //this.disponibles = res.disponibles;
        this.asignaciones = res.asignaciones;
        this.periodos = res.periodos;
        //this.escalas = res.escalas;

        for(let asignacion of this.asignaciones){
          let item = new Listado(curso, asignacion, this.periodos);
          this.listados.push(item);
        }
      }
      catch(error) {
        this.generatepdfMsg = `Error al cargar las asignaciones: ${error}`;
        this.success = false
        console.log('Error al cargar las asignaciones: ', error)
        break;
      }
    }
  }

  async onLoadBoletines(){

    for (const curso of this.data) {

      this.generatepdfMsg = `Cargando Información de  ${curso.grado.nombre} (${curso.nombre})...`;

      try {
        const res: any = await firstValueFrom(this.crudMatriculaService.read('/secretaria/matriculas/notascurso/'+curso.id));

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
            matricula.curso_r.asignaciones.sort((a: any, b: any ) => {
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
          boletin.setBoletin(curso, matricula)
          this.boletines.push(boletin)
        });
        await this.boletines.forEach((boletin: Boletin) => {
          boletin.setPuesto(this.boletines);
        });

      }
      catch(error) {

      }

    }

  }
}


