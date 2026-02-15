import { Periodo } from "../periodo";

class Encabezado {
  public asignatura!: string;
  public docente!: string;
  public curso!: string;
  public grado!: string;
  public lectivo!: string;
  public sede!: string;
  public director!: string;
  public periodos: Periodo[] = [];

}

class Nota {
  public id!: string;
  public nota!: number;
  public idperiodo!: string;
  public periodo!: string;
}

class Alumno {
  public id!: string;
  public codigo!: string;
  public apellidos!: string;
  public nombres!: string;
  public fullname!: string;
  public notas: Nota[] = [];
  public acumulado: number = 0;
}

export class Listado {
  public encabezado: Encabezado = new Encabezado();
  public alumnos: Alumno[] = [];

  constructor(curso: any, asignacion: any, periodos: Periodo[]) {
    this.encabezado.asignatura = asignacion.materia.nombre;
    this.encabezado.docente = asignacion.docente.primer_nombre + ' ' + asignacion.docente.primer_apellido;
    this.encabezado.curso = curso.nombre;
    this.encabezado.grado = curso.grado.nombre;
    this.encabezado.lectivo = curso.lectivo.fin.substring(0, 4);
    this.encabezado.sede = curso.sede.nombre;
    this.encabezado.director = curso.director.primer_nombre + ' ' + curso.director.primer_apellido;
    this.encabezado.periodos = periodos;
    // Inicializa notas para todos los periodos
    let periodosMap = periodos.reduce((acc: any, periodo: any) => {
      acc[periodo.id] = periodo;
      return acc;
    }, {});

    for (let alumno of asignacion.matriculados) {
      let existingAlumno = this.alumnos.find(a => a.id === alumno.id);
      if (!existingAlumno) {
        let a = new Alumno();
        a.id = alumno.id;
        a.codigo = alumno.nid;
        a.apellidos = alumno.primer_apellido;
        if (alumno.segundo_apellido) {
          a.apellidos += ' ' + alumno.segundo_apellido;
        }
        a.nombres = alumno.primer_nombre;
        if (alumno.segundo_nombre) {
          a.nombres += ' ' + alumno.segundo_nombre;
        }
        a.fullname = a.apellidos + ', ' + a.nombres;
        a.acumulado = 0;
        a.notas = [];

        // Inicializa todas las notas en cero para cada periodo
        for (let idPeriodo in periodosMap) {
          let nota = new Nota();
          nota.nota = 0;
          nota.idperiodo = idPeriodo;
          nota.periodo = periodosMap[idPeriodo].nombre;
          a.notas.push(nota);
        }

        if(alumno.lanota){
          let notaIndex = a.notas.findIndex(n => n.idperiodo === alumno.pid);
          if (notaIndex !== -1) {
            a.notas[notaIndex].nota = alumno.lanota;
            a.acumulado += alumno.lanota * alumno.porcentaje / 100;
          }
        }
        this.alumnos.push(a);
      } else {
        let notaIndex = existingAlumno.notas.findIndex(n => n.idperiodo === alumno.pid);
        if (notaIndex !== -1 && alumno.lanota) {
          existingAlumno.notas[notaIndex].nota = alumno.lanota;
          existingAlumno.acumulado += alumno.lanota * alumno.porcentaje / 100;
        }
      }
    }
  }
}
