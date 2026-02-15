import { Area } from "./area";
import { Escala } from "./escala";
import { Periodo } from "./periodo";

class Curso {
  public nombre: string = '';
  public grado: string = '';
  public director: string = '';
  public sede: string = '';
  public periodos: Periodo[] = [];
  public areas: Area[] = [];
}

class Nota {
  public nota: number = 0;
  public color: string = '#222222';
  public area = new Area();
  public periodo = new Periodo();
}

class Alumno {
  public nombre: string = '';
  public codigo: string = '';
  public notasPorAreaYPeriodo: { [periodo: string]: { [areaId: string]: Nota | null } } = {};

  obtenerNota(areaId: string, periodoNombre: string): Nota | null {
    return this.notasPorAreaYPeriodo[periodoNombre]?.[areaId] || null;
  }

  // Función para inicializar el objeto de notas por materia y periodo
  inicializarNotasPorAreaYPeriodo(areas: Area[], periodos: Periodo[]) {
    periodos.forEach(periodo => {
      this.notasPorAreaYPeriodo[periodo.nombre] = {};
      areas.forEach(area => {
        this.notasPorAreaYPeriodo[periodo.nombre][area.id] = null;
      });
    });
  }

  // Calcula la nota del área considerando el peso de cada materia dentro del área.
  calcularNotaDelArea(periodoNombre: string, areaId: string, asignaciones: any[]): number | null {
    let sumaPonderadaNotas = 0;
    let sumaPesos = 0;

    // Filtrar las asignaciones por área y período
    const asignacionesArea = asignaciones.filter(asig => asig.materia.area.id === areaId && asig.periodos.some((p: any) => p.nombre === periodoNombre));

    asignacionesArea.forEach(asignacion => {
      asignacion.notas.forEach((nota:  any) => {
        if(nota.periodo_id === periodoNombre) {
          sumaPonderadaNotas += nota.nota * (asignacion.materia.porcentaje / 100);
          sumaPesos += asignacion.materia.porcentaje;
        }
      });
    });

    // Verificar que haya notas y pesos para calcular el promedio
    if(sumaPesos > 0) {
      return sumaPonderadaNotas / sumaPesos;
    } else {
      return null; // No hay notas para este área y período
    }
  }

  // Calcula el promedio por área en un período dado.
  calcularPromedioPorArea(periodoNombre: string): { [areaId: string]: number } {
    let promediosPorArea: { [areaId: string]: number } = {};
    const notasArea = this.notasPorAreaYPeriodo[periodoNombre];

    for (const areaId in notasArea) {
      const nota = notasArea[areaId];
      if (nota) {
        // Aquí asumimos que `nota` incluye el porcentaje para calcular el promedio ponderado.
        // Esta línea es solo un placeholder; ajusta la lógica según tus necesidades.
        promediosPorArea[areaId] = nota.nota; // Asume que ya está ponderado por el porcentaje de la materia en el área.
      }
    }

    return promediosPorArea;
  }

  // Calcula el promedio general del período basado en promedios de áreas.
  calcularPromedioGeneralPeriodo(periodoNombre: string, areas: Area[]): number {
    const promediosPorArea = this.calcularPromedioPorArea(periodoNombre);
    let promedioGeneral = 0;
    let totalPeso = 0;

    areas.forEach(area => {
      if (promediosPorArea[area.id]) {
        promedioGeneral += promediosPorArea[area.id]; // Asume igual peso para cada área, ajusta según necesites.
        totalPeso += 1; // Ajusta según el peso real de cada área.
      }
    });

    return totalPeso > 0 ? promedioGeneral / totalPeso : 0;
  }
}



export class Puesto {
  public curso: Curso = new Curso();
  public alumnos: Alumno[] = [];

  constructor(){
  }

  setPuesto(curso: any, periodos: any, data: any, escalas: any){
    this.curso.nombre = curso.nombre;
    this.curso.grado = curso.grado.nombre;
    this.curso.director = `${curso.director.primer_nombre} ${curso.director.primer_apellido} ${curso.director.segundo_apellido}`;
    this.curso.sede = curso.sede.nombre;
    this.curso.periodos = periodos;

    data.forEach((item: any) => {
      let alum = new Alumno();
      alum.nombre = `${item.alumno.primer_nombre} ${item.alumno.primer_apellido} ${item.alumno.segundo_apellido}`;
      alum.codigo = item.alumno.alumno.codigo;
      //alum.inicializarNotasPorAreaYPeriodo(item.materia.area, periodos);
      this.alumnos.push(alum);
      item.curso_r.asignaciones.forEach((asignacion: any) => {

        /*
        alum.inicializarNotasPorAreaYPeriodo(item.materia.area, periodos);

        item.periodos.forEach((periodo: any) => {
          if(alum.notasPorAreaYPeriodo[periodo.nombre]){
            item.notas.forEach((nota: any) => {
              console.log(nota);
              if(nota.area.id==item.materia.area.id){
                item.notasPorAreaYPeriodo[periodo.nombre][item.materia.area.id]+= nota.nota*item.materia.porcentaje/100;
              }
            });
          };
        });
        */
      });
    });
  }

  getEscalas(escalas: Escala[], nota: number): any {
    let escala = escalas.find((escala: any) => {
      return nota >= escala.minimo && nota <= escala.maximo;
    });
    return escala?.color || '#000000';
  }
}
