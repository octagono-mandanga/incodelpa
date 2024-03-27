import { User } from "./user"

class VectorAlumno {
  alumno!: User
  notas: number[] = []
  total: number = 0
}

export class MatrizNotas {
  matriz: VectorAlumno[] = []

  setData(data: any) {
    // Asegurarse de que matriz está inicializada y es un array vacío al comienzo
    this.matriz = [];
    data.forEach((element: any) => {
        const alumno = new User;

        // Buscar si el alumno ya existe en la matriz
        const alumnoIndex = this.matriz.findIndex(matrizItem => matrizItem.alumno.id === element.id);

        if (alumnoIndex !== -1) {
            // Si el alumno ya existe, solo añadir la nota a sus notas
            this.matriz[alumnoIndex].notas.push(element.lanota);
            this.matriz[alumnoIndex].total = this.matriz[alumnoIndex].total + (element.lanota * element.porcentaje/100);
        } else {
            // Si el alumno no existe, añadir un nuevo objeto para el alumno con la primera nota
            alumno.setData(element)
            this.matriz.push({
                alumno: alumno,
                notas: [element.lanota],
                total: element.lanota * element.porcentaje/100
            });
        }
    });
  }
}
