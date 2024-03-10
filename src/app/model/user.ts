export class User {
  public id!: string;
  public avatar_url!: string;
  public primer_nombre!: string;
  public segundo_nombre!: string;
  public primer_apellido!: string;
  public segundo_apellido!: string;
  public nid!: string;
  public celular!: string;
  public email!: string;
  public estado!: string;


  public tipo_documento!: string;
  public roles!: any;
  constructor(){

  }
  public get fullname(){
    return `${this.primer_nombre} ${this.segundo_nombre || ''} ${this.primer_apellido} ${this.segundo_apellido || ''}`.trim();
  }
}

