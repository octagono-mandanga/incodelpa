import { Escala } from "./escala"
import { Materia } from "./materia"
import { Periodo } from "./periodo"
import { User } from "./user"

class Nota {
  nota: number = 0
  periodo!: Periodo
  setNota(data: any) {
    this.nota = data.lanota
    this.periodo = new Periodo
    this.periodo.id = data.periodo_id
    this.periodo.nombre = data.nombre
    this.periodo.porcentaje = data.porcentaje
  }
}

class VectorAsignatura {
  docente!: User
  materia!: Materia
  periodos!: Periodo[]
  escalas!: Escala[]
  notas: Nota[] = []
  total: number = 0
}

export class MatrizNotasAlumno {
  matriz: VectorAsignatura[] = []

  setData(data: any) {
    // Asegurarse de que matriz está inicializada y es un array vacío al comienzo
    this.matriz = [];

    data.asignaciones.forEach((element: any) => {
        const docente = new User;
        const materia = new Materia;
        let nota = new Nota;
        let notas: Nota[] = [];
        let total: number = 0;

        // Buscar si la materia ya existe en la matriz
        const materiaIndex = this.matriz.findIndex(matrizItem => matrizItem.materia.id === element.id);

        if (materiaIndex !== -1) {
            // Si la materia ya existe, solo añadir la nota a sus notas
            this.matriz[materiaIndex].notas.push(element.lanota);
            this.matriz[materiaIndex].total = this.matriz[materiaIndex].total + (element.lanota * element.porcentaje/100);
        } else {
            // Si el alumno no existe, añadir un nuevo objeto para el alumno con la primera nota
            docente.setData(element.docente)
            materia.setData(element.materia)
            element.notas.forEach((item: any) => {
              nota = new Nota
              nota.setNota(item)
              notas.push(nota)
              total = total + (item.lanota * item.porcentaje/100)
            });
            this.matriz.push({
                docente: docente,
                materia: materia,
                notas: notas,
                periodos: element.periodos,
                escalas: element.escalas,
                total: total
            });
        }
    });
  }
}
