// =================================================================
// 1. INTERFAZ PARA LOS DATOS CRUDOS DE ENTRADA
// =================================================================
// Esta interfaz describe la estructura completa de la respuesta de la API
export interface IApiResponse {
  data: IMatriculaAlumno[];
}

// Esta interfaz describe la estructura de CADA objeto dentro del array que recibes
export interface IMatriculaAlumno {
  id: string;
  curso: {
    nombre: string;
    grado: { nombre: string };
    director: {
      primer_nombre: string;
      segundo_apellido: string | null;
    };
  };
  alumno: {
    id: string;
    primer_nombre: string;
    segundo_nombre: string | null;
    primer_apellido: string;
    segundo_apellido: string | null;
    alumno: { codigo: string };
  };
  escalas: IEscala[];
  curso_r: {
    asignaciones: IAsignacion[];
  };
}

// Interfaces auxiliares que componen a IMatriculaAlumno
interface IEscala {
  nombre: string;
  minimo: number;
  maximo: number;
  color: string;
}

interface IPeriodo {
  id: string;
  nombre: string;
  orden: number;
}

interface IAsignacion {
  materia: {
    nombre: string;
    porcentaje: number;
    area: { nombre: string };
  };
  notas: {
    periodo_id: string;
    lanota: string;
  }[];
  periodos: IPeriodo[];
}


// =================================================================
// 2. ESTRUCTURA DE DATOS PROCESADOS (SALIDA)
// =================================================================

export interface ICursoInfo {
  grado: string;
  curso: string;
  director: string;
}

export interface IPeriodoProcesado {
  nombre_periodo: string;
  orden: number;
  nota: number;
  escala: string;
  color: string;
}

export interface IEstudianteProcesado {
  id: string;
  codigo: string;
  nombre_completo: string;
  periodos: IPeriodoProcesado[];
}

export interface IMateriaProcesada {
  nombre_materia: string;
  porcentaje: number;
  estudiantes: IEstudianteProcesado[];
}

export interface IAreaProcesada {
  nombre_area: string;
  porcentaje_valido: boolean;
  porcentaje_total: number;
  materias: IMateriaProcesada[];
}


// =================================================================
// 3. CLASE PRINCIPAL QUE PROCESA LOS DATOS
// =================================================================

export class ConsolidadoCurso {
  // --- Propiedades Públicas para Almacenar el Resultado ---
  public cursoInfo: ICursoInfo;
  public areas: IAreaProcesada[];

  public alumnos: { id: string; codigo: string; nombre_completo: string; }[] = [];

  public escalas: IEscala[] = [];

  /**
   * El constructor recibe el array de matrículas del curso y lo procesa.
   * @param matriculas Array con los registros de todos los alumnos del curso.
   */
  constructor(matriculas: IMatriculaAlumno[]) {
    // Inicializar propiedades por defecto
    this.cursoInfo = { grado: '', curso: '', director: '' };
    this.areas = [];


    if (!matriculas || matriculas.length === 0) {
      console.warn("No se proporcionaron datos para procesar.");
      return;
    }

    // --- Inicia el procesamiento ---

    // 1. Extraer Datos Comunes del Curso
    const primerRegistro = matriculas[0];
    this.escalas = primerRegistro.escalas;
    this.cursoInfo = {
      grado: primerRegistro.curso.grado.nombre,
      curso: primerRegistro.curso.nombre,
      director: `${primerRegistro.curso.director.primer_nombre || ''} ${primerRegistro.curso.director.segundo_apellido || ''}`.trim(),
    };

    // 2. Agrupar la información en una estructura temporal
    const areasTemporales: Record<string, { materias: Record<string, IMateriaProcesada> }> = {};

    for (const matricula of matriculas) {
      const alumno = matricula.alumno;

      for (const asignacion of matricula.curso_r.asignaciones) {
        const areaNombre = asignacion.materia.area.nombre;
        const materia = asignacion.materia;

        // Asegurar que el área y la materia existan en la estructura temporal
        if (!areasTemporales[areaNombre]) {
          areasTemporales[areaNombre] = { materias: {} };
        }
        if (!areasTemporales[areaNombre].materias[materia.nombre]) {
          areasTemporales[areaNombre].materias[materia.nombre] = {
            nombre_materia: materia.nombre,
            porcentaje: materia.porcentaje,
            estudiantes: [],
          };
        }

        // Procesar las notas del alumno para esta materia
        const periodosOrdenados = [...asignacion.periodos].sort((a, b) => a.orden - b.orden);
        const notasDelAlumno = periodosOrdenados.map(periodo => {
          const notaEncontrada = asignacion.notas.find(n => n.periodo_id === periodo.id);
          const notaValor = notaEncontrada ? parseFloat(notaEncontrada.lanota) : 0;
          const escalaInfo = this.getEscalaParaNota(notaValor);

          return {
            nombre_periodo: periodo.nombre,
            orden: periodo.orden,
            nota: notaValor,
            escala: escalaInfo.nombre,
            color: escalaInfo.color,
          };
        });

        // Agregar al estudiante procesado a la materia correspondiente
        areasTemporales[areaNombre].materias[materia.nombre].estudiantes.push({
          id: alumno.id,
          codigo: alumno.alumno.codigo,
          nombre_completo: `${alumno.primer_apellido} ${alumno.segundo_apellido || ''} ${alumno.primer_nombre} ${alumno.segundo_nombre || ''}`.replace(/\s+/g, ' ').trim(),
          periodos: notasDelAlumno,
        });


        const alumnosMap = new Map<string, { id: string; codigo: string; nombre_completo: string; }>();
        matriculas.forEach(m => {
          if (!alumnosMap.has(m.alumno.id)) {
            alumnosMap.set(m.alumno.id, {
              id: m.alumno.id,
              codigo: m.alumno.alumno.codigo,
              nombre_completo: `${m.alumno.primer_apellido} ${m.alumno.segundo_apellido || ''} ${m.alumno.primer_nombre} ${m.alumno.segundo_nombre || ''}`.replace(/\s+/g, ' ').trim()
            });
          }
        });
        // Convertimos el mapa en un array y lo ordenamos alfabéticamente
        this.alumnos = Array.from(alumnosMap.values()).sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));

      }
    }

    // 3. Convertir la estructura temporal al resultado final, ordenando y validando
    this.areas = Object.keys(areasTemporales).map(areaNombre => {
      const areaTemp = areasTemporales[areaNombre];
      let porcentajeTotalArea = 0;

      const materiasProcesadas = Object.values(areaTemp.materias).map(materia => {
        porcentajeTotalArea += materia.porcentaje;
        // Ordenar estudiantes alfabéticamente por nombre completo
        materia.estudiantes.sort((a, b) => a.nombre_completo.localeCompare(b.nombre_completo));
        return materia;
      });

      return {
        nombre_area: areaNombre,
        porcentaje_valido: porcentajeTotalArea === 100,
        porcentaje_total: porcentajeTotalArea,
        materias: materiasProcesadas,
      };
    });
  }

  /**
   * Método privado para encontrar la escala de calificación de una nota.
   */
  private getEscalaParaNota(nota: number): { nombre: string; color: string } {
    for (const escala of this.escalas) {
      if (nota >= escala.minimo && nota <= escala.maximo) {
        return { nombre: escala.nombre, color: escala.color };
      }
    }
    return { nombre: 'N/A', color: '#808080' };
  }
}
