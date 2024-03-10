import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Curso } from 'src/app/model/curso';
import { Matricula } from 'src/app/model/matricula';
import { User } from 'src/app/model/user';

class Cambios {
  anterior!: Curso;
  nuevo!: Curso;
  mensaje!: any;
  mensajes: any[] = [
    { msg: 'El estudiante será enviado a un grado inferior al que estaba matriculado anteriormente, esto es poco común. Los datos de notas serán eliminados. El sistema notificará el cambio al director y al estudiante.', alert: 'danger'},
    { msg: 'El estudiante será enviado a otro grupo. Las notas se conservarán y se enviarán a la cuenta de los nuevos docentes, de ser el caso. El sistema notificará el cambio al director y al estudiante.', alert: 'info'},
    { msg: 'El estudiante será promovido a un grado superior. El sistema notificará el cambio al director y al estudiante. Los datos de notas serán eliminados.', alert: 'warning'}
  ];

  evaluarGrado(): void {
      if (this.nuevo.grado.orden < this.anterior.grado.orden) {
          this.mensaje = this.mensajes[0];
      } else if (this.nuevo.grado.orden === this.anterior.grado.orden) {
          this.mensaje = this.mensajes[1];
      } else {
          this.mensaje = this.mensajes[2];
      }
  }
}


@Component({
  selector: 'app-matricula-modificar',
  templateUrl: './matricula-modificar.component.html',
  styleUrls: ['./matricula-modificar.component.css']
})
export class MatriculaModificarComponent implements OnInit, OnChanges {
  @Input() matricula!: Matricula
  @Input() cursos: Curso[] = []
  @Input() nuevocurso!: Curso
  @Input() alumno!: User
  @Input() loading: boolean = false
  @Input() config: any
  @Input() currentStep = 1;

  @Output() event = new EventEmitter

  public steps = [
    { title: 'Selección Curso', description: 'Step 1 description', alert: 'light' },
    { title: 'Cambios', description: 'Step 2 description', alert: 'info'  },
    { title: 'Finalización', description: 'Step 2 description', alert: 'info'  },
    // ... más pasos según sea necesario
  ];
  public cambio = new Cambios


  constructor(){

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.nuevocurso?.id && this.matricula?.id){
      this.cambio.anterior = this.matricula.curso
      this.cambio.nuevo = this.nuevocurso
      this.cambio.evaluarGrado()
    }
  }

  onModificar(data: any){
    this.loading = true
    this.event.emit({paso: 1, data: data})
    this.currentStep = 2
  }
  onConfirmar(){
    this.loading = true
    this.event.emit({paso: 2, data: this.nuevocurso.id})
    this.currentStep = 3
  }



}
