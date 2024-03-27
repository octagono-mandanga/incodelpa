import { TestBed } from '@angular/core/testing';

import { CompetenciasSeleccionadasService } from './competencias-seleccionadas.service';

describe('CompetenciasSeleccionadasService', () => {
  let service: CompetenciasSeleccionadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompetenciasSeleccionadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
