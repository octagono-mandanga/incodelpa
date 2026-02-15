import { Component, Input, OnInit } from '@angular/core';
import { Escala } from 'src/app/model/escala';

@Component({
  selector: 'app-notasxalumno',
  templateUrl: './notasxalumno.component.html',
  styleUrls: ['./notasxalumno.component.css']
})
export class NotasxalumnoComponent implements OnInit {
  @Input() public matricula: any = []
  @Input() public notas: any = []
  ngOnInit(): void {

  }
  getColor(escalas: any, nota: any): string {
    if (!escalas) {
      console.warn('escalas no está definido');
      return 'black';
    }

    const escalaEncontrada = escalas.find((item: Escala) => nota >= item.minimo && nota <= item.maximo);
    return escalaEncontrada ? escalaEncontrada.color : 'black';
  }
}
