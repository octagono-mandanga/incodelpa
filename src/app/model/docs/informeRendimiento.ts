import { Periodo } from "../periodo";

class Alumno {
  public id!: string;
  public codigo!: string;
  public apellidos!: string;
  public nombres!: string;
  public fullname!: string;
}

class Encabezado {
  public matricula!: string;
  public lectivo!: string;
  public grado!: string;
  public curso!: string;
  public director!: string;
  public coordinador!: string;
  public sede!: string;
  public periodos: Periodo[] = [];
  public detallesPeriodo: { promedio: number; puesto: number; }[] = [];
}

class Area {
  public nombre!: string;
  public detallesPeriodo: { periodo: Periodo; promedio: number; nota: number; }[] = [];
  public materias: Materia[] = [];
}

class Materia {
  public nombre!: string;
  public docente!: string;
  public detallesPeriodo: {
    periodo: Periodo;
    competencias: { competencia: string; nota: number; }[];
    notas: number[];
  }[] = [];
  public porcentaje: number = 0;
}

export class InformeRendimiento {
  public encabezado: Encabezado = new Encabezado();
  public alumno: Alumno = new Alumno();
  public areas: Area[] = [];
  constructor(data: any, periodos: Periodo[]){

  }
}
