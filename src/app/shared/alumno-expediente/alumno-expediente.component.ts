import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Matricula } from 'src/app/model/matricula';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-alumno-expediente',
  templateUrl: './alumno-expediente.component.html',
  styleUrls: ['./alumno-expediente.component.css']
})
export class AlumnoExpedienteComponent  implements OnInit, OnChanges {
  @Input() alumno!: User
  @Input() matriculas: Matricula[] = []
  @Input() loading: boolean = false
  @Input() config: any
  public matricula!: Matricula

  constructor(){}
  async ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const matriculaActiva = this.matriculas.find(matricula => matricula.estado === 'activo');
    if (matriculaActiva) {
      this.matricula = new Matricula;
      this.matricula = matriculaActiva;
    }

  }

}
