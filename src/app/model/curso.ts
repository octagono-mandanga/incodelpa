export class Curso {
  public id!: string;
  public nombre!: string;
  public lectivo!: any;
  public sede!: any;
  public grado!: any;
  public director!: any;
  public coordinador!: any;
  public matriculados!: any;
  public matriculas!: any;
  public asignaciones!: any;
  public estado!: string;
  static calcularRankings(notas: any[], asignaciones: any[], periodos: any[]): any {
    return {
      asignaturas: this.calcularRankingAsignaturas(notas, asignaciones, periodos),
      general: this.calcularRankingGeneral(notas, asignaciones, periodos)
    };
  }

  private static assignRanks(list: any[], scoreKey: string) {
    // Sort by Score Desc, then Name Asc
    list.sort((a, b) => {
      if (b[scoreKey] !== a[scoreKey]) {
        return b[scoreKey] - a[scoreKey];
      }
      const nameA = (a.alumno.primer_apellido + ' ' + a.alumno.segundo_apellido + ' ' + a.alumno.primer_nombre + ' ' + a.alumno.segundo_nombre).toLowerCase();
      const nameB = (b.alumno.primer_apellido + ' ' + b.alumno.segundo_apellido + ' ' + b.alumno.primer_nombre + ' ' + b.alumno.segundo_nombre).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    // Assign Ranks
    list.forEach((item, index) => {
      if (index > 0 && item[scoreKey] === list[index - 1][scoreKey]) {
        item.puesto = list[index - 1].puesto;
      } else {
        item.puesto = index + 1;
      }
    });
  }

  static calcularRankingAsignaturas(notas: any[], asignaciones: any[], periodos: any[]): any[] {
    const rawRankings: any = {};

    notas.forEach(asignacionNote => {
      const asignacion = asignaciones.find(a => a.id === asignacionNote.idasignacion);
      if (!asignacion) return;
      const nombreMateria = asignacion.materia.nombre;

      if (!rawRankings[nombreMateria]) {
        rawRankings[nombreMateria] = {
          periodos: {},
          general: []
        };
      }

      asignacionNote.data.matriz.forEach((item: any) => {
        item.notas.forEach((notaVal: any, index: number) => {
          const notaNum = parseFloat(notaVal);
          if (!isNaN(notaNum)) {
            const periodoName = periodos[index]?.nombre || `Periodo ${index + 1}`;
            if (!rawRankings[nombreMateria].periodos[periodoName]) {
              rawRankings[nombreMateria].periodos[periodoName] = [];
            }
            rawRankings[nombreMateria].periodos[periodoName].push({
              alumno: item.alumno,
              nota: notaNum
            });
          }
        });

        rawRankings[nombreMateria].general.push({
          alumno: item.alumno,
          nota: item.total
        });
      });
    });

    // Assign Ranks
    Object.keys(rawRankings).forEach(materia => {
      Object.keys(rawRankings[materia].periodos).forEach(p => {
        this.assignRanks(rawRankings[materia].periodos[p], 'nota');
      });
      this.assignRanks(rawRankings[materia].general, 'nota');
    });

    // Sort Subjects Alphabetically
    const sortedKeys = Object.keys(rawRankings).sort((a, b) => {
      return a.localeCompare(b, 'es', { sensitivity: 'base' });
    });

    const orderedAsignaturas: any[] = [];
    sortedKeys.forEach(key => {
      const subjectData = rawRankings[key];
      const orderedPeriodData: any[] = [];
      periodos.forEach(p => {
        if (subjectData.periodos[p.nombre]) {
          orderedPeriodData.push({
            periodo: p.nombre,
            orden: p.orden,
            data: subjectData.periodos[p.nombre]
          });
        }
      });

      orderedAsignaturas.push({
        materia: key,
        periodos: orderedPeriodData,
        general: subjectData.general
      });
    });

    return orderedAsignaturas;
  }

  static calcularRankingGeneral(notas: any[], asignaciones: any[], periodos: any[]): any {
    const studentAggregates: any = {};
    const generalData: any = {
      periodos: {},
      total: []
    };

    notas.forEach(asignacionNote => {
      asignacionNote.data.matriz.forEach((item: any) => {
        const studentId = item.alumno.id;

        if (!studentAggregates[studentId]) {
          studentAggregates[studentId] = {
            alumno: item.alumno,
            periodoSums: {},
            periodoCounts: {},
            generalSum: 0,
            generalCount: 0
          };
        }

        item.notas.forEach((notaVal: any, index: number) => {
          const notaNum = parseFloat(notaVal);
          if (!isNaN(notaNum)) {
            if (!studentAggregates[studentId].periodoSums[index]) {
              studentAggregates[studentId].periodoSums[index] = 0;
              studentAggregates[studentId].periodoCounts[index] = 0;
            }
            studentAggregates[studentId].periodoSums[index] += notaNum;
            studentAggregates[studentId].periodoCounts[index]++;
          }
        });

        studentAggregates[studentId].generalSum += item.total;
        studentAggregates[studentId].generalCount++;
      });
    });

    // Compute General Rankings per Period
    periodos.forEach((p, index) => {
      const pName = p.nombre;
      generalData.periodos[pName] = [];
      Object.values(studentAggregates).forEach((agg: any) => {
        if (agg.periodoCounts[index] > 0) {
          const avg = agg.periodoSums[index] / agg.periodoCounts[index];
          generalData.periodos[pName].push({
            alumno: agg.alumno,
            promedio: avg
          });
        }
      });
      this.assignRanks(generalData.periodos[pName], 'promedio');
    });

    // Compute Overall General Ranking
    Object.values(studentAggregates).forEach((agg: any) => {
      if (agg.generalCount > 0) {
        const avg = agg.generalSum / agg.generalCount;
        generalData.total.push({
          alumno: agg.alumno,
          promedio: avg
        });
      }
    });
    this.assignRanks(generalData.total, 'promedio');

    // Create ordered output
    const orderedGeneral: any = {
      periodos: [],
      total: generalData.total
    };

    periodos.forEach(p => {
      if (generalData.periodos[p.nombre]) {
        orderedGeneral.periodos.push({
          periodo: p.nombre,
          data: generalData.periodos[p.nombre]
        });
      }
    });

    return orderedGeneral;
  }
}
