export class Materia {
  public id!: string;
  public nombre!: string;
  public ih!: number;
  public estado!: string;
  public grado!: any;
  public area!: any;
  public competencias: any = [];
  public porcentaje!: number;
  constructor(){

  }
  setData(data: any){
    this.id = data.id
    this.nombre = data.nombre
    this.ih = data.ih
    this.estado = data.estado
    this.porcentaje = data.porcentaje
  }
}
