export class User {
  public id!: string;
  public avatar_url!: string;
  public primer_nombre: string = '';
  public segundo_nombre: string = '';
  public primer_apellido: string = '';
  public segundo_apellido: string = '';
  public nid!: string;
  public celular!: string;
  public email!: string;
  public estado!: string;

  public alumno!: any;
  public codigo!: any;

  public tipo_documento!: string;
  public roles!: any;
  constructor(){

  }
  public get fullname(){
    return `${this.primer_nombre} ${this.segundo_nombre } ${this.primer_apellido} ${this.segundo_apellido }`.trim();
  }
  public setData(data: any){
    this.id = data.id
    this.avatar_url = data.avatar_url
    this.primer_nombre = data.primer_nombre
    if(data.segundo_nombre)
      this.segundo_nombre = data.segundo_nombre
    this.primer_apellido = data.primer_apellido
    if(data.segundo_apellido)
      this.segundo_apellido = data.segundo_apellido
    this.alumno = data.alumno
    this.nid = data.nid
    this.celular = data.celular
    this.email = data.email
    this.estado = data.estado
  }
}

