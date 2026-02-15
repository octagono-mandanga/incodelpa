import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Escala } from 'src/app/model/escala';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-habilitacion-item',
  templateUrl: './coordinacion-habilitacion-item.component.html',
  styleUrls: ['./coordinacion-habilitacion-item.component.css']
})
export class CoordinacionHabilitacionItemComponent implements OnInit {
  public saved: boolean = false;
  public claseNota: string = 'warning';
  public mensajeNota: string = '';
  public claseColor: string = '';
  @ViewChild('fullnota', { static: false }) fullnota!: ElementRef;
  @Input() escalas: Escala[]  = [];
  @Input() notafull: number = 0;
  @Input() data: any = {};
  @Output() emitirLaNota = new EventEmitter<any>();
  public loading: boolean = false;
  constructor(
    private crudHabilitacionService: CrudService<any>,
  ) { }

  ngOnInit(): void {
    if(this.notafull) {
      this.onValidar();
    }
  }

  onValidar(){
    this.saved = false;
    if (this.notafull === null || this.notafull  === undefined) {
      this.claseNota = 'warning';
      this.mensajeNota = '';
      return;
    }

    const notaNum = this.notafull;
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

  manejarBlur(): void {
    if(this.notafull && this.notafull !== 0 && this.mensajeNota !== 'Error') {
      this.onValidar();
      this.guardarHabilitacion();
    }
  }


  private guardarHabilitacion() {
    this.loading = true;
    this.crudHabilitacionService.create(
      {matricula: this.data.matricula, asignacion: this.data.asignacion, nota: this.notafull},
      `/coordinacion/habilitaciones`
    ).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.saved = true;
        this.emitirLaNota.emit({data: res});
        setTimeout(() => this.saved = false, 5000);
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      }
    });
  }

  manejarFullKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.mensajeNota !== 'Error') {
      this.guardarHabilitacion();
    }
  }



  // Método para enfocar el input interno
  enfocarInput() {
    if (this.fullnota) {
      this.fullnota.nativeElement.focus();
    }
  }



}
