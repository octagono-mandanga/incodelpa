import { Component, OnInit } from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import * as moment from 'moment';
moment.locale('es');
interface Nivel {
  id: string;
  nombre: string;
  estado: string;
  orden: number;
  created_at: string;
  updated_at: string | null;
  periodos?: Periodo[];
}

interface Lectivo {
  id: string;
  estado: string;
  inicio: string;
  fin: string;
  created_at: string;
  updated_at: string;
  nivel: Nivel;
}

interface Periodo {
  id: string;
  nombre: string;
  estado: string;
  inicio: string;
  fin: string;
  status: string;
  orden: number;
  porcentaje: number;
  created_at: string;
  updated_at: string;
  lectivo: Lectivo;
}

@Component({
  selector: 'app-docente-periodos',
  templateUrl: './docente-periodos.component.html',
  styleUrls: ['./docente-periodos.component.css']
})
export class DocentePeriodosComponent implements OnInit {
  public loading: boolean = false
  public message!: string
  public success: boolean = true

  public display: any;
  public data: Periodo[] = []

  constructor(
    private crudService: CrudService<Periodo>
  ){}
  async ngOnInit() {
    const organizarPeriodosPorNivel = (periodos: Periodo[]): Nivel[] => {
      const nivelesMap: { [key: string]: Nivel } = {};

      periodos.forEach((periodo) => {
          const nivelId = periodo.lectivo.nivel.id;
          if (!nivelesMap[nivelId]) {
              nivelesMap[nivelId] = { ...periodo.lectivo.nivel, periodos: [] };
          }
          nivelesMap[nivelId].periodos!.push(periodo);
      });

      const niveles = Object.values(nivelesMap);

      // Ordenar niveles por su campo 'orden'
      niveles.sort((a, b) => a.orden - b.orden);

      // Opcionalmente, podrías querer ordenar los periodos dentro de cada nivel
      niveles.forEach(nivel => {
          nivel.periodos!.sort((a, b) => a.orden - b.orden);
      });

      return niveles;
    }

    const formatearFechasDePeriodos = (periodos: Periodo[]) => {
      return periodos.map(periodo => {
        // Convertir las fechas de inicio y fin a objetos moment
        const inicio = moment(periodo.inicio);
        const fin = moment(periodo.fin);
        const hoy = moment(); // Fecha actual

        // Determinar el status del periodo
        let status: 'danger' | 'success' | 'warning';
        if (hoy.isBefore(inicio)) {
          status = 'warning';
        } else if (hoy.isAfter(fin)) {
          status = 'danger';
        } else {
          status = 'success';
        }

        return {
          ...periodo,
          inicio: inicio.format('dddd DD [de] MMMM, YYYY'),
          fin: fin.format('dddd DD [de] MMMM, YYYY'),
          status // Agregar el status calculado al objeto del periodo
        };
      });
    };

    this.loading = true
    this.crudService.read('/docente/periodos').subscribe({
      next: (res: any) => {
        this.data = res.data
        this.data = formatearFechasDePeriodos(this.data)
        this.display = organizarPeriodosPorNivel(this.data);
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }


}
