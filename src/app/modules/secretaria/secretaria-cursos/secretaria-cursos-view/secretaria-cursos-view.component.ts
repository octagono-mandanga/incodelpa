import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { Materia } from 'src/app/model/materia';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

import { Periodo } from 'src/app/model/periodo';
import { Escala } from 'src/app/model/escala';
import { MatrizNotas } from 'src/app/model/matriz_notas';

import { Documento } from 'src/app/model/generardocumento';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface AsignacionConNotas {
  idasignacion: string;
  data: MatrizNotas;
}

@Component({
  selector: 'app-secretaria-cursos-view',
  templateUrl: './secretaria-cursos-view.component.html',
  styleUrls: ['./secretaria-cursos-view.component.css']
})
export class SecretariaCursosViewComponent implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string //Para mostrar mensaje de carga
  public success: boolean = true
  public loading: boolean = false

  public generatepdf: boolean = false
  public docDefinition: any = Documento

  public data!: Curso
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  public matriculados: User[] = []

  public periodos: Periodo[] = []
  public escalas: Escala[] = []
  public notas: AsignacionConNotas[] = []

  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<Asignacion>,
    private crudMatriculaService: CrudService<User>
  ){}
  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    this.msg = 'Curso'
    await this.crudService.read('/secretaria/cursos/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.msg = 'Asignaciones'
        this.onAsignaciones()
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
  }







  async onAsignaciones(){
    await this.crudAsignacionService.read('/secretaria/asignaciones/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.disponibles = res.disponibles
        this.asignaciones = res.asignaciones
        this.periodos = res.periodos
        this.escalas = res.escalas
        this.asignaciones.forEach(element => {
          let item2 = new MatrizNotas
          item2.setData(element.matriculados)
          this.notas.push({idasignacion: element.id, data: item2})
        });
        this.msg = 'Matriculas'
        this.onMatriculas()
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  async onMatriculas(){
    await this.crudMatriculaService.read('/secretaria/matriculas/curso/'+this.id).subscribe({
      next: (res: any) => {
        this.matriculados = res.data
        this.msg = ''
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
         this.onMessage()
       }
    })
  }
  onMessage(){
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }

  ordenarMatriculados(): void {
    this.matriculados.sort((a, b) => {
      const apellidoA = a.primer_apellido + a.segundo_apellido;
      const apellidoB = b.primer_apellido + b.segundo_apellido;
      const nombreA = a.primer_nombre + a.segundo_nombre;
      const nombreB = b.primer_nombre + b.segundo_nombre;

      if (apellidoA < apellidoB) return -1;
      if (apellidoA > apellidoB) return 1;
      // Si los apellidos son iguales, entonces compara por nombre
      if (nombreA < nombreB) return -1;
      if (nombreA > nombreB) return 1;
      return 0; // Los nombres y apellidos son iguales
    });
  }

  onPdf(doc: number){

    switch(doc){
      case 1:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.docDefinition.listado(this.data.matriculados, this.data).then(() => {
          pdfMake.createPdf(this.docDefinition.def).download('Listado_'+this.data.nombre+'.pdf', ()=>{
            this.generatepdf = false
          });
        });
      break;
      case 2:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.docDefinition.asignaciones(this.asignaciones, this.matriculados, this.data).then(() => {
          pdfMake.createPdf(this.docDefinition.def).download('Listado_'+this.data.nombre+'.pdf', ()=>{
            this.generatepdf = false
          });
        });
      break;
      case 3:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.docDefinition.listadoGeneral(this.asignaciones, this.matriculados, this.data).then(() => {
          pdfMake.createPdf(this.docDefinition.def).download('Listado_'+this.data.nombre+'.pdf', ()=>{
            this.generatepdf = false
          });
        });
      break;
      case 10:
        this.generatepdf = true
        this.docDefinition = new Documento()
        this.docDefinition.listadoAsistencia(this.matriculados, this.data).then(() => {

          pdfMake.createPdf(this.docDefinition.def).download('ListadosAsistencia.pdf', ()=>{
            this.generatepdf = false
          });
        });

      break;
    }
  }


  getColor(nota: number): string {
    if (!this.escalas) {
      console.warn('escalas no está definido');
      return 'black';
    }

    const escalaEncontrada = this.escalas.find((item: Escala) => nota >= item.minimo && nota <= item.maximo);
    return escalaEncontrada ? escalaEncontrada.color : 'black';
  }
}
