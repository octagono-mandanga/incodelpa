import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Escala } from 'src/app/model/escala';
import { MatrizNotas } from 'src/app/model/matriz_notas';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';
import { DomSanitizer } from '@angular/platform-browser';

interface AsignacionConNotas {
  idasignacion: string;
  data: MatrizNotas;
}

@Component({
  selector: 'app-coordinacion-docentes-view',
  templateUrl: './coordinacion-docentes-view.component.html',
  styleUrls: ['./coordinacion-docentes-view.component.css']
})
export class CoordinacionDocentesViewComponent implements OnInit {
  public id!: string
  public msg!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: User
  public asignaciones: Asignacion [] = []
  public notas: AsignacionConNotas[] = []


  constructor(
    public activatedRoute: ActivatedRoute,
    public crudService: CrudService<User>,
    public crudAsignacionService: CrudService<Asignacion>,
    private sanitizer: DomSanitizer

  ){}
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id']
    this.msg = 'Docente'
    this.loading = true
    this.crudService.read('/coordinacion/docentes/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        //this.loading = false
        this.msg = ''
        this.cargarAsignaciones()
       },
       error: (error) => {
         this.message = 'Error al cargar docente : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  cargarAsignaciones() {
    this.msg = 'Asignaciones'
    this.loading = true
    this.crudAsignacionService.read('/coordinacion/asignaciones/docente/'+this.id).subscribe({
      next: (res: any) => {
        this.asignaciones = res.asignaciones
        this.asignaciones.forEach(element => {
          let item2 = new MatrizNotas
          item2.setData(element.matriculados)
          this.notas.push({idasignacion: element.id, data: item2})
        });
        this.loading = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar el asignaciones : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  getColor(nota: number, asignacion: Asignacion): string {
    if (!asignacion.escalas) {
      console.warn('escalas no está definido');
      return 'black';
    }

    const escalaEncontrada = asignacion.escalas.find((item: Escala) => nota >= item.minimo && nota <= item.maximo);
    return escalaEncontrada ? escalaEncontrada.color : 'black';
  }

  getSanitizedUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
