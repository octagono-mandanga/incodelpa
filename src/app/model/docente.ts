import { Asignacion } from "./asignacion";
import { User } from "./user";

export class Docente extends User {
  public asignaciones: Asignacion[] = []
  constructor(){
    super()
  }

}

