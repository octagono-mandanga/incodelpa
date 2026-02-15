  class Encabezado {
    public codigo!: string;
    public nombre_alumno!: string;
    public nombre_periodo!: string;
    public matricula!: string;
    public lectivo!: string;
    public grado!: string;
    public curso!: string;
    public director!: string;
    public promedio= {primero: 0, segundo: 0, tercero: 0, cuarto: 0};
    public puesto = {primero: 0, segundo: 0, tercero: 0, cuarto: 0};
  }

  class Area {
    public nombre!: string;
    public promedio = {primero: 0, segundo: 0, tercero: 0, cuarto: 0};
    public materias: Materia[] = [];
  }

  class Materia {
    public nombre!: string;
    public docente!: string;
    public competencias: {primero: any[], segundo: any[], tercero: any[], cuarto: any[]} = {primero: [], segundo: [], tercero: [], cuarto: []};
    public porcentaje: number = 0;
    public ih: number = 0;
    public notas: {primero: number, segundo: number, tercero: number, cuarto: number} = {primero: 0, segundo: 0, tercero: 0, cuarto: 0};
  }

  export class Boletin {
    public encabezado: Encabezado = new Encabezado();
    public areas: Area[] = [];
    public observaciones: any = '';
    public promocion: { id: number, concepto: string; areasPerdidas: string[]; _escalas: any[] } = { id: 0, concepto: '', areasPerdidas: [], _escalas: [] };

    constructor(){
    }

    setBoletin(curso: any, asignacion: any) {
      type PeriodoNombre = 'primero' | 'segundo' | 'tercero' | 'cuarto';

      // Acumulador para promedios por área (clave: id del área)
      const promediosPorAreaPeriodo: any = {};
      let promediosPorPeriodo = {
        primero: 0,
        segundo: 0,
        tercero: 0,
        cuarto: 0,
      };

      // Configuración del encabezado general
      this.encabezado.lectivo = curso.lectivo.fin.substring(0, 4);
      this.encabezado.grado = curso.grado.nombre;
      this.encabezado.curso = curso.nombre;
      this.encabezado.director =
        curso.director.primer_nombre +
        (curso.director.segundo_nombre ? ' ' + curso.director.segundo_nombre : '') +
        ' ' +
        curso.director.primer_apellido;
      // Usamos un mapa para agrupar las áreas por su id
      const areasMap: { [areaId: string]: Area } = {};
      asignacion.curso_r.asignaciones.forEach((item: any, index: number) => {
        // Configurar datos del encabezado en la primera asignación
        if (index === 0) {
          const uuid = asignacion.id;
          const lastPart = uuid.split('-').pop();
          this.encabezado.matricula = lastPart?.substring(0, 6);
          this.encabezado.codigo = asignacion.alumno.alumno.codigo;
          this.encabezado.nombre_alumno = (
            asignacion.alumno.primer_apellido +
            ' ' +
            (asignacion.alumno.segundo_apellido ? asignacion.alumno.segundo_apellido + ' ' : '') +
            asignacion.alumno.primer_nombre +
            ' ' +
            (asignacion.alumno.segundo_nombre ? asignacion.alumno.segundo_nombre : '')
          ).toUpperCase();
          this.encabezado.nombre_periodo = '';
        }

        // Extraer identificador y nombre del área
        const areaId = item.materia.area.id;
        const areaNombre = item.materia.area.nombre;
        // Inicializar el acumulador de promedios para el área si no existe aún
        if (!promediosPorAreaPeriodo[areaId]) {
          promediosPorAreaPeriodo[areaId] = {
            nombre: areaNombre,
            primero: 0,
            segundo: 0,
            tercero: 0,
            cuarto: 0,
          };
        }

        // Inicializar las variables para las notas y competencias por período para la asignatura
        const notasPorPeriodo: { [key in PeriodoNombre]: number } = {
          primero: 0,
          segundo: 0,
          tercero: 0,
          cuarto: 0,
        };
        // Usamos un arreglo para competencias; si es posible, declara en la clase Materia
        const competenciasPorPeriodo: { [key in PeriodoNombre]: any[] } = {
          primero: [],
          segundo: [],
          tercero: [],
          cuarto: [],
        };

        // Agrupar las competencias por período
        item.competencias.forEach((competencia: any) => {
          const periodoNombre = competencia.nombre.toLowerCase() as PeriodoNombre;
          if (competenciasPorPeriodo.hasOwnProperty(periodoNombre)) {
            competenciasPorPeriodo[periodoNombre].push(competencia.competencia);
          }
        });

        // Procesar las notas de la asignación y acumular el promedio ponderado para el área
        item.notas.forEach((nota: any) => {
          const periodoNombre = nota.nombre.toLowerCase() as PeriodoNombre;
          if (notasPorPeriodo.hasOwnProperty(periodoNombre)) {
            this.encabezado.nombre_periodo = periodoNombre;
            notasPorPeriodo[periodoNombre] =
              nota?.lanota !== 0 ? parseFloat(nota.lanota) : 0;
            if (!isNaN(notasPorPeriodo[periodoNombre])) {
              notasPorPeriodo[periodoNombre] = parseFloat(
                notasPorPeriodo[periodoNombre].toFixed(1)
              );
            } else {
              notasPorPeriodo[periodoNombre] = 0;
            }
            const valorNota: number = (nota?.lanota * item.materia.porcentaje) / 100;
            promediosPorAreaPeriodo[areaId][periodoNombre] +=
              valorNota !== 0 ? parseFloat(valorNota.toFixed(1)) : 0;
          }
        });

        // Crear la instancia de Materia con los datos procesados
        let materia = new Materia();
        materia.nombre = item.materia.nombre;
        materia.docente =
          item.docente.primer_nombre +
          ' ' +
          (item.docente.segundo_nombre ? item.docente.segundo_nombre + ' ' : '') +
          item.docente.primer_apellido;
        // Asignar las competencias y notas ya agrupadas
        materia.competencias = competenciasPorPeriodo;
        materia.porcentaje = item.materia.porcentaje;
        materia.ih = item.materia.ih;
        materia.notas = notasPorPeriodo;

        // Agrupar la materia en el área correspondiente
        if (!areasMap[areaId]) {
          let area = new Area();
          area.nombre = areaNombre;
          area.promedio = promediosPorAreaPeriodo[areaId];
          area.materias = [materia];
          areasMap[areaId] = area;
        } else {
          areasMap[areaId].materias.push(materia);
        }
      });
      // Convertir el mapa de áreas a un arreglo
      this.areas = Object.values(areasMap);

      // Calcular los promedios globales por período a partir de los promedios de cada área
      this.areas.forEach((area: Area) => {
        promediosPorPeriodo.primero += area.promedio.primero;
        promediosPorPeriodo.segundo += area.promedio.segundo;
        promediosPorPeriodo.tercero += area.promedio.tercero;
        promediosPorPeriodo.cuarto += area.promedio.cuarto;
      });
      promediosPorPeriodo.primero /= this.areas.length;
      promediosPorPeriodo.primero =
        promediosPorPeriodo.primero !== 0
          ? parseFloat(promediosPorPeriodo.primero.toFixed(2))
          : 0;
      promediosPorPeriodo.segundo /= this.areas.length;
      promediosPorPeriodo.segundo =
        promediosPorPeriodo.segundo !== 0
          ? parseFloat(promediosPorPeriodo.segundo.toFixed(2))
          : 0;
      promediosPorPeriodo.tercero /= this.areas.length;
      promediosPorPeriodo.tercero =
        promediosPorPeriodo.tercero !== 0
          ? parseFloat(promediosPorPeriodo.tercero.toFixed(2))
          : 0;
      promediosPorPeriodo.cuarto /= this.areas.length;
      promediosPorPeriodo.cuarto =
        promediosPorPeriodo.cuarto !== 0
          ? parseFloat(promediosPorPeriodo.cuarto.toFixed(2))
          : 0;
      this.encabezado.promedio = promediosPorPeriodo;

      // Llamar a setPromocion después de calcular el promedio del cuarto período
      if (this.encabezado.promedio.cuarto > 0) {
        this.setPromocion(asignacion);
      }
    }






    async setPromocion(asignacion: any) {
      let _periodos = asignacion.periodos; // Array de periodos
      let _escalas = asignacion.escalas; // Array de escalas
      let _escalaBajo = _escalas.find((escala: any) => escala.nombre === 'bajo');
      let _escalaBajoMax = _escalaBajo.maximo; // Máximo valor para considerar una nota como "baja"

      const areasPerdidas: string[] = [];

      // Definir los nombres de los periodos como tipo explícito
      type PeriodoNombre = 'primero' | 'segundo' | 'tercero' | 'cuarto';

      // Calcular el promedio ponderado por área
      this.areas.forEach((area) => {
          let promedioPonderado = 0;

          _periodos.forEach((periodo: any) => {
              const periodoNombre = periodo.nombre.toLowerCase() as PeriodoNombre;
              const periodoPorcentaje = periodo.porcentaje / 100;

              // Validar que la clave pertenece al tipo PeriodoNombre
              if (area.promedio.hasOwnProperty(periodoNombre)) {
                  promedioPonderado += area.promedio[periodoNombre] * periodoPorcentaje;
              }
          });

          // Redondear a una cifra decimal
          promedioPonderado = parseFloat(promedioPonderado.toFixed(1));

          // Verificar si el área se considera "perdida"
          if (promedioPonderado <= _escalaBajoMax) {
              areasPerdidas.push(area.nombre);
          }
      });

      // Determinar el concepto de promoción
      if (areasPerdidas.length === 0) {
          this.promocion = {
              id: 1,
              concepto: '¡Felicitaciones! Has aprobado todas las áreas y has sido promovido.',
              areasPerdidas: [],
              _escalas

          };
      } else if (areasPerdidas.length <= 2) {
          const areasTexto = areasPerdidas.join(', ');
          this.promocion = {
              id: 2,
              concepto: `Debes habilitar las siguientes áreas: ${areasTexto}.`,
              areasPerdidas,
              _escalas
          };
      } else {
          const areasTexto = areasPerdidas.join(', ');
          this.promocion = {
              id: 3,
              concepto: `Desafortunadamente, has reprobado el año. Perdiste ${areasPerdidas.length} áreas: ${areasTexto}.`,
              areasPerdidas,
              _escalas
          };
      }
    }


    setPuesto(boletines: Boletin[]){
      let puestos = {
        primero: 0,
        segundo: 0,
        tercero: 0,
        cuarto: 0
      }
      if(this.encabezado.promedio.primero>0){
        puestos.primero = 1;
      }
      if(this.encabezado.promedio.segundo>0){
        puestos.segundo = 1;
      }
      if(this.encabezado.promedio.tercero>0){
        puestos.tercero = 1;
      }
      if(this.encabezado.promedio.cuarto>0){
        puestos.cuarto = 1;
      }
      boletines.forEach((boletin: Boletin) => {
        if (boletin !== this) {
          if (boletin.encabezado.promedio.primero > this.encabezado.promedio.primero) {
            puestos.primero++;
          }
          if (boletin.encabezado.promedio.segundo > this.encabezado.promedio.segundo) {
            puestos.segundo++;
          }
          if (boletin.encabezado.promedio.tercero > this.encabezado.promedio.tercero) {
            puestos.tercero++;
          }
          if (boletin.encabezado.promedio.cuarto > this.encabezado.promedio.cuarto) {
            puestos.cuarto++;
          }
        }
      });
      this.encabezado.puesto = puestos;
    }


    async verificarHabilitacion(data: any) {

      if (data && data.asignaturas_aprobadas?.length > 0) {

          // Convertir lista de áreas aprobadas a un Set de nombres de áreas
          const areasAprobadas = new Set(data.asignaturas_aprobadas.map((a: any) => a.area));


          // Filtrar las áreas perdidas para ver si fueron habilitadas
          const nuevasAreasPerdidas = this.promocion.areasPerdidas.filter((area: string) => !areasAprobadas.has(area));

          if (nuevasAreasPerdidas.length < this.promocion.areasPerdidas.length) {
              this.promocion.areasPerdidas = nuevasAreasPerdidas;

              // Si ya no tiene áreas perdidas, modificar concepto
              if (nuevasAreasPerdidas.length === 0) {
                this.promocion.id = 1;
                  this.promocion.concepto = `El alumno realizó proceso de recuperación y aprobó todas las áreas.`;
              } else {
                this.promocion.id = 3;
                this.promocion.concepto = `El alumno realizó proceso de recuperación en las siguientes áreas: ${nuevasAreasPerdidas.join(", ")}`;
              }
          }
      }

    }
  }
