import { Escala } from "./escala";
import { Materia } from "./materia";
import { Periodo } from "./periodo";

class Curso {
  public nombre: string = '';
  public grado: string = '';
  public director: string = '';
  public sede: string = '';
  public periodos: Periodo[] = [];
  public materias: Materia[] = [];
}

class Nota {
  public nota: number = 0;
  public color: string = '#222222';
  public materia = new Materia();
  public periodo = new Periodo();
}

class Alumno {
  public nombre: string = '';
  public codigo: string = '';
  //public notas: Nota[] = [];
  public notasPorMateriaYPeriodo: { [periodo: string]: { [materiaId: string]: Nota | null } } = {};

  obtenerNota(materiaId: string, periodoNombre: string): Nota | null {
    return this.notasPorMateriaYPeriodo[periodoNombre]?.[materiaId] || null;
  }

  // Función para inicializar el objeto de notas por materia y periodo
  inicializarNotasPorMateriaYPeriodo(materias: Materia[], periodos: Periodo[]) {
    periodos.forEach(periodo => {
      this.notasPorMateriaYPeriodo[periodo.nombre] = {};
      materias.forEach(materia => {
        this.notasPorMateriaYPeriodo[periodo.nombre][materia.id] = null;
      });
    });
  }
}



export class Consolidado {
  public curso: Curso = new Curso();
  public alumnos: Alumno[] = [];

  constructor(){
  }

  setConsolidado(curso: any, periodos: any, data: any, escalas: any){

    this.curso.nombre = curso.nombre;
    this.curso.grado = curso.grado.nombre;
    this.curso.director = `${curso.director.primer_nombre} ${curso.director.primer_apellido} ${curso.director.segundo_apellido}`;
    this.curso.sede = curso.sede.nombre;
    this.curso.periodos = periodos;
    //Asignando materias al curso para saber las columnas
    data.forEach((item: any) => {
      item.curso_r.asignaciones.forEach((asignacion: any) => {
        if (!this.curso.materias.some(materia => materia.id === asignacion.materia.id)) {
          this.curso.materias.push(asignacion.materia);
        }
      });
    });

    data.forEach((item: any) => {
      let alumno = new Alumno();
      alumno.nombre = `${item.alumno.primer_apellido} ${item.alumno.segundo_apellido} ${item.alumno.primer_nombre} ${item.alumno.segundo_nombre}`;
      alumno.codigo = item.alumno.alumno.codigo;

      alumno.inicializarNotasPorMateriaYPeriodo(this.curso.materias, periodos);

      item.curso_r.asignaciones.forEach((asignacion: any) => {
        if(asignacion.notas){
          asignacion.notas.forEach((nota: any) => {
            let n = new Nota();
            n.nota = nota.lanota;
            n.color = this.getEscalas(escalas, nota.lanota);
            n.materia = asignacion.materia;
            n.periodo.id = nota.periodo_id;
            n.periodo.nombre = nota.nombre;
            alumno.notasPorMateriaYPeriodo[nota.nombre][asignacion.materia.id] = n;
          });
        }
      });
      this.alumnos.push(alumno);
    });
  }

  getEscalas(escalas: Escala[], nota: number): any {
    let escala = escalas.find((escala: any) => {
      return nota >= escala.minimo && nota <= escala.maximo;
    });
    return escala?.color || '#000000';
  }
}
