import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Competencia } from '../model/competencia';
import { Periodo } from '../model/periodo';

@Injectable({
  providedIn: 'root'
})
export class CompetenciasSeleccionadasService {
  private competenciasSeleccionadasSource = new BehaviorSubject<Competencia[]>([]);
  private periodoSource = new BehaviorSubject<Periodo>(new Periodo);
  competenciasSeleccionadas = this.competenciasSeleccionadasSource.asObservable();
  periodo = this.periodoSource.asObservable();

  constructor() {}

  setCompetenciasSeleccionadas(competencias: Competencia[]) {
    this.competenciasSeleccionadasSource.next(competencias);
  }
  setPeriodo(periodo: Periodo) {
    this.periodoSource.next(periodo);
  }
}
