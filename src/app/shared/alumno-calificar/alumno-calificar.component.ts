import { Notacompetencia } from './../../model/notacompetencia';
import { AlumnoCalificarCompetenciaComponent } from '../alumno-calificar-competencia/alumno-calificar-competencia.component';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { Competencia } from 'src/app/model/competencia';
import { Escala } from 'src/app/model/escala';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-alumno-calificar',
  templateUrl: './alumno-calificar.component.html',
  styleUrls: ['./alumno-calificar.component.css']
})
export class AlumnoCalificarComponent implements OnInit, OnChanges  {
  @ViewChildren(AlumnoCalificarCompetenciaComponent) alumnoCalificar?: QueryList<AlumnoCalificarCompetenciaComponent>
  @ViewChild('fullnota') fullInput!: ElementRef<HTMLInputElement>;

  @Input() alumno!: User
  @Input() competencias: Competencia[] = []
  @Input() escalas: Escala[] = []
  @Input() notas: Notacompetencia[] = []
  @Output() emitirCalificacion = new EventEmitter();
  @Output() focoSiguiente = new EventEmitter<void>();


  /** Nota Full  */
  @Output() focoFullSiguiente = new EventEmitter<void>();
  @Output() emitirCalificacionNotaFull = new EventEmitter();


  @Input() notafull!: any
  @Input() metodo: boolean = false
  public claseNota: string = 'warning';
  public checkboxState: boolean = true;
  public mensajeNota: string = '';
  public claseColor: string = '';

  @Output() emitirLaNota = new EventEmitter();

  constructor(){}
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngAfterViewInit(): void {
  }

  enfocarSiguienteInput(index: number): void {
    const componentes = this.alumnoCalificar?.toArray();
    const siguienteIndex = index + 1;

    if (componentes && siguienteIndex < componentes.length) {
      componentes[siguienteIndex].enfocarInput();
    } else {
      this.focoSiguiente.emit();
    }
  }

  emitirNota(data: any){
    data.alumno = this.alumno.id
    this.emitirCalificacion.emit(data);
  }


  filtrarNota(competencia: string): number | ''{
    const nota = this.notas.find(item => item.competencia == competencia)
    if (nota === undefined) {
      return ''
    }
    const valorNota = Number(nota.nota);

    if (isNaN(valorNota)) {
      // Manejar el caso en que la conversión a número falla
      console.error('El valor de la nota no es un número válido:', nota.nota);
      return '';
    }

    // Usar toFixed para convertir el número a un string con un decimal
    return parseFloat(valorNota.toFixed(1));
  }

  onValidar(){
    if (!this.checkboxState) return;

    if (this.notafull === null || this.notafull === undefined || this.notafull === '') {
      this.claseNota = 'warning';
      this.mensajeNota = '';
      return;
    }

    const notaNum = parseFloat(this.notafull);
    const escalaValida = this.escalas.some(escala => notaNum >= escala.minimo && notaNum <= escala.maximo);

    if (escalaValida) {
      this.claseNota = 'info';
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

  manejarKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if(this.mensajeNota != 'Error'){
        if(!isNaN(this.notafull)){
          this.emitirLaNota.emit({nota: this.notafull, alumno: this.alumno.id})
        }
        this.focoSiguiente.emit();
      }
    }
  }


  /**
   * Manejo de la Nota Full
   *
   * Una sola nota para todas las competencias
   */

  manejarFullKeyup(event: KeyboardEvent){
    if (event.key === 'Enter') {
      if(this.mensajeNota != 'Error'){

        if(!isNaN(this.notafull)){
          this.emitirCalificacionNotaFull.emit({nota: this.notafull, alumno: this.alumno.id})
        }

        this.focoFullSiguiente.emit();
      }
    }
  }

  enfocarFullInput(index: number): void {
    this.fullInput.nativeElement.focus();
  }

}

