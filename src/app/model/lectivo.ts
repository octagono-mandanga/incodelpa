import { Curso } from "./curso";

export class Lectivo {
  public id!: string;
  public inicio!: string;
  public fin!: string;
  public nivel!: any;
  public estado!: string;
  public orden!: string;
  public cursos: Curso[] = [];
  constructor(){
  }
  setData(data: any){
    this.id = data.id;
    this.inicio = data.inicio;
    this.fin = data.fin;
    this.nivel = data.nivel.nombre;
    this.estado = data.estado;
    this.orden = data.orden;
  }
  setCursos(cursos: any[]){
    cursos.map((curso: any) => {
      this.cursos.push(curso);
    });
  }
}
