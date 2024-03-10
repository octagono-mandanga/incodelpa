import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-curso-notas',
  templateUrl: './curso-notas.component.html',
  styleUrls: ['./curso-notas.component.css']
})
export class CursoNotasComponent implements OnInit {
  @Input() loading: boolean = false
  @Input() asignaciones: Asignacion[] = []
  @Input() alumnos: User[] = []
  @Input() config!: any
  constructor(
    public router: Router
  ){}
  ngOnInit() {

  }
  onDocente(id: string){
    this.router.navigate([this.config.actions.docente, id])
  }
  onAlumno(id: string){
    this.router.navigate([this.config.actions.alumno, id])
  }
}
