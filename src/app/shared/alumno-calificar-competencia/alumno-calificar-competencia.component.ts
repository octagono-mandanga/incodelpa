import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Competencia } from 'src/app/model/competencia';
import { Escala } from 'src/app/model/escala';

@Component({
  selector: 'app-alumno-calificar-competencia',
  templateUrl: './alumno-calificar-competencia.component.html',
  styleUrls: ['./alumno-calificar-competencia.component.css']
})
export class AlumnoCalificarCompetenciaComponent implements OnInit {
  @ViewChild('lanota') miInput!: ElementRef<HTMLInputElement>;
  @Input() competencia!: Competencia
  @Input() escalas: Escala[] = []
  @Output() emitirLaNota = new EventEmitter();
  @Output() focoSiguiente = new EventEmitter<void>();
  @Input() nota!: any
  public claseNota: string = 'warning';
  public checkboxState: boolean = true; // Controla el estado del checkbox
  private notaTemporal: any; // Almacena temporalmente el valor de la nota

  public mensajeNota: string = '';
  public claseColor: string = '';



  constructor(){}
  ngOnInit(): void {
    this.onValidar();
  }

  onValidar(): void {
    if (!this.checkboxState) return;

    if (this.nota === null || this.nota === undefined || this.nota === '') {
      this.claseNota = 'warning';
      this.mensajeNota = '';
      this.notaTemporal = null;
      return;
    }

    const notaNum = parseFloat(this.nota);
    const escalaValida = this.escalas.some(escala => notaNum >= escala.minimo && notaNum <= escala.maximo);

    if (escalaValida) {
      this.claseNota = 'info';
      this.notaTemporal = this.nota; // Almacena la nota válida temporalmente
    } else {
      this.claseNota = 'danger';
    }


    const escalaEncontrada = this.escalas.find(escala => notaNum >= escala.minimo && notaNum <= escala.maximo);

    if (escalaEncontrada) {
      this.mensajeNota = escalaEncontrada.nombre; // Nombre de la escala
      this.claseColor = escalaEncontrada.color;
    } else {
      this.mensajeNota = 'Error';
      this.claseColor = '#FF0000';
    }

  }

  checkboxChange(): void {
    if (this.checkboxState) {
      if (this.notaTemporal !== null) {
        this.nota = this.notaTemporal;
        this.onValidar();
      }
    } else {
      this.nota = '';
      this.claseNota = 'warning';
    }
  }

  manejarKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if(this.mensajeNota != 'Error'){
        if(!isNaN(this.nota)){
          this.emitirLaNota.emit({nota: this.nota, competencia: this.competencia.id})
        }
        this.focoSiguiente.emit();
      }
    }
  }

  public enfocarInput(): void {
    this.miInput.nativeElement.focus();
  }
}
