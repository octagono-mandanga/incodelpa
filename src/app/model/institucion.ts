export class Institucion {
  public id!: string;
  public tipo!: string;
  public nombre!: string;
  public direccion!: string;
  public telefono!: string;
  public email!: string;
  public dane!: string;
  public url!: string;
  constructor(data: any){
    this.id = data.id
    this.tipo = data.tipo
    this.nombre = data.nombre
    this.direccion = data.direccion
    this.telefono = data.estado
    this.email = data.email
    this.dane = data.dane
    this.url = data.url
  }
}
