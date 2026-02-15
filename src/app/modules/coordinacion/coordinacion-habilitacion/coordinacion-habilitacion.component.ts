import { Component, OnInit, QueryList, ViewChildren, ElementRef  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { Escala } from 'src/app/model/escala';
import { Materia } from 'src/app/model/materia';
import { MatrizNotas } from 'src/app/model/matriz_notas';
import { Periodo } from 'src/app/model/periodo';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

import { Documento } from 'src/app/model/generardocumento';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Boletin } from 'src/app/model/boletin';
import { Consolidado } from 'src/app/model/consolidado';
import { Puesto } from 'src/app/model/puesto';
import { firstValueFrom } from 'rxjs';
import { CoordinacionHabilitacionItemComponent } from './coordinacion-habilitacion-item/coordinacion-habilitacion-item.component';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


interface AsignacionConNotas {
  idasignacion: string;
  data: MatrizNotas;
}


@Component({
  selector: 'app-coordinacion-habilitacion',
  templateUrl: './coordinacion-habilitacion.component.html',
  styleUrls: ['./coordinacion-habilitacion.component.css']
})
export class CoordinacionHabilitacionComponent  implements OnInit {
  public config: any
  public id!: string
  public message!: string
  public msg!: string
  public success: boolean = true
  public loading: boolean = false
  public progress: boolean = false
  public data: Curso =  new Curso()
  public alumnosCurso: any = []
  public habilitantes: any = []
  public tableData: any = []
  public claseNota: string = 'warning';
  public mensajeNota: string = '';
  public claseColor: string = '';

  public periodos: Periodo[] = []
  public escalas: Escala[] = []
  public asignaciones: Asignacion[] = []
  public disponibles: Materia[] = []
  public matriculados: User[] = []
  public notas: AsignacionConNotas[] = []

  public boletines: Boletin[] = [];


  public generatepdf: boolean = false
  public docDefinition: any = Documento

  @ViewChildren('habilitacionComponent') habilitacionComponents!: QueryList<CoordinacionHabilitacionItemComponent>;



  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<Curso>,
    private crudAsignacionService: CrudService<Asignacion>
  ){}
  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    this.msg = 'Notas Curso'
    var res: any = await firstValueFrom(this.crudAsignacionService.read(`/coordinacion/cursos/${this.id}`));
    this.data = res.data;
    await this.crudService.read('/coordinacion/matriculas/notascurso/'+this.id).subscribe({
      next: async(res: any) => {
        this.alumnosCurso = res.data
        this.msg = 'Notas'
        await this.onHabilitantes()
        this.loadHabilitaciones()
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el area : '+error
         this.success = false
         this.loading = false
       }
    })
  }


  async onHabilitantes() {

    // Iterar sobre cada alumno
    this.alumnosCurso.forEach((alumno: any) => {
      const areasNotas: any = {};

      // Iterar sobre las asignaciones de cada alumno
      alumno.curso_r.asignaciones.forEach((asignacion: any) => {
        // Inicializar las escalas si aún no se han asignado
        if (this.escalas.length === 0) {
          this.escalas = asignacion.escalas;
        }

        // Obtener la escala "básico" y su nota mínima
        const escalaMinima = asignacion.escalas.find((escala: any) => escala.nombre === "básico");
        const notaMinima = escalaMinima ? parseFloat(escalaMinima.minimo) : 0;

        const materia = asignacion.materia; // Objeto materia
        const notas = asignacion.notas; // Array de notas

        // Usar el id del área para agrupar, pero se conserva el nombre para mostrarlo
        const areaId = materia.area.id;         // Identificador único del área
        const areaNombre = materia.area.nombre;   // Nombre del área (para visualización)
        const porcentajeMateria = materia.porcentaje / 100; // Porcentaje de la materia en el área

        let notaMateria = 0;
        // Calcular la nota ponderada de la materia
        notas.forEach((nota: any) => {
          const porcentajeNota = nota.porcentaje / 100; // Porcentaje de la nota final de la materia
          const valorNota = parseFloat(nota.lanota) * porcentajeNota;
          notaMateria += valorNota;
        });

        // Redondear la nota de la materia a 2 decimales
        const notaRedondeadaMateria = notaMateria.toFixed(2);
        // Ponderar la nota de la materia sobre el área
        const notaPonderadaMateria = notaMateria * porcentajeMateria;

        // Si el área no existe en areasNotas, inicializarla usando el id del área
        if (!areasNotas[areaId]) {
          areasNotas[areaId] = {
            id: areaId,
            nombre: areaNombre,
            nota: 0,
            asignaturas: [],
            notaMinima: notaMinima, // Guardar la nota mínima por área
          };
        }

        // Agregar la asignatura al área
        areasNotas[areaId].asignaturas.push({
          asignacion: asignacion.id,
          nombre: materia.nombre,
          nota: notaRedondeadaMateria,
          porcentaje: materia.porcentaje, // Porcentaje de la materia
        });

        // Sumar la nota ponderada de la materia al total del área
        areasNotas[areaId].nota += notaPonderadaMateria;
      });

      // Filtrar áreas cuya nota total sea menor a la nota mínima
      const areasPorDebajoMinima = Object.values(areasNotas).filter((area: any) => parseFloat(area.nota) < area.notaMinima);

      // Si hay áreas por debajo de la escala mínima, agregar al resultado final
      if (areasPorDebajoMinima.length > 0) {
        this.habilitantes.push({
          matricula: alumno.id,
          alumno: alumno.alumno, // Datos del alumno
          areas: areasPorDebajoMinima.map((area: any) => ({
            nombre: area.nombre,
            nota: parseFloat(area.nota).toFixed(2), // Redondear la nota total del área a 2 decimales
            asignaturas: area.asignaturas,
          })),
        });
      }
    });

    this.habilitantes = this.organizarHabilitantes(this.habilitantes);
    this.prepareTableData();
    // Forzar actualización de la vista
    await new Promise(resolve => setTimeout(resolve, 0));
  }


  async loadHabilitaciones() {
    try {
      const habilitaciones: any = await firstValueFrom(
        this.crudService.read(`/coordinacion/habilitaciones/${this.id}`)
      );

      // Mapear solo si hay datos
      if (habilitaciones.data && this.tableData.length > 0) {
        this.tableData = this.tableData.map((row: any) => {
          const habilitacion = habilitaciones.data.find(
            (h: any) =>
              h.matricula.id === row.matricula &&
              h.asignacion.id === row.asignacion
          );

          return {
            ...row,
            habilitacion: habilitacion ? habilitacion.nota : '',
            promover: habilitacion ? habilitacion.promover : false
          };
        });
      }

    } catch (error) {
      console.error('Error al cargar las habilitaciones:', error);
    }
  }



  organizarHabilitantes(habilitantes: any[]) {
    return habilitantes.sort((a: any, b: any) => {
      // Comparar por `primer_apellido`
      if (a.alumno.primer_apellido > b.alumno.primer_apellido) return -1;
      if (a.alumno.primer_apellido < b.alumno.primer_apellido) return 1;

      // Comparar por `segundo_apellido` si `primer_apellido` es igual
      if (a.alumno.segundo_apellido > b.alumno.segundo_apellido) return -1;
      if (a.alumno.segundo_apellido < b.alumno.segundo_apellido) return 1;

      // Comparar por `primer_nombre` si ambos apellidos son iguales
      if (a.alumno.primer_nombre > b.alumno.primer_nombre) return -1;
      if (a.alumno.primer_nombre < b.alumno.primer_nombre) return 1;

      // Si todos son iguales, no cambiar el orden
      return 0;
    });
  }


  prepareTableData() {
    const tableData: any = [];

    // Iterar sobre cada alumno (habilitante)
    this.habilitantes.forEach((item: any) => {
      // Fusionar áreas que tengan el mismo nombre (o, idealmente, el mismo id)
      const mergedAreas: { [key: string]: any } = {};

      item.areas.forEach((area: any) => {
        // Usamos el nombre como clave; si tienes id de área, es mejor usarlo (por ejemplo, area.id)
        const key = area.nombre.trim().toLowerCase();
        if (!mergedAreas[key]) {
          // Clonar el objeto y copiar el arreglo de asignaturas
          mergedAreas[key] = { ...area, asignaturas: [...area.asignaturas] };
        } else {
          // Si ya existe, concatenar las asignaturas
          mergedAreas[key].asignaturas = mergedAreas[key].asignaturas.concat(area.asignaturas);
          // Opcional: se puede actualizar la nota total (si corresponde, por ejemplo, sumando o recalculando)
          // mergedAreas[key].nota = parseFloat(mergedAreas[key].nota) + parseFloat(area.nota);
        }
      });

      // Convertir el objeto fusionado en un arreglo
      const areas = Object.values(mergedAreas);

      // Calcular el total de asignaturas de todas las áreas para definir el rowspan de la celda del alumno
      const totalAsignaturas = areas.reduce((sum: number, area: any) => sum + area.asignaturas.length, 0);

      // Recorrer las áreas fusionadas para crear las filas de la tabla
      areas.forEach((area: any, areaIndex: number) => {
        const areaRowspan = area.asignaturas.length;
        area.asignaturas.forEach((asignatura: any, asignaturaIndex: number) => {
          tableData.push({
            matricula: item.matricula,
            asignacion: asignatura.asignacion,
            // Mostrar datos del alumno solo en la primera fila
            alumno: areaIndex === 0 && asignaturaIndex === 0 ? item.alumno : null,
            alumnoRowspan: areaIndex === 0 && asignaturaIndex === 0 ? totalAsignaturas : 0,
            // Mostrar el nombre del área solo en la primera fila de cada área
            area: asignaturaIndex === 0 ? area.nombre : null,
            areaRowspan: asignaturaIndex === 0 ? areaRowspan : 0,
            // Mostrar la nota total del área solo en la primera fila
            notaArea: asignaturaIndex === 0 ? area.nota : null,
            asignatura: asignatura.nombre,
            asignaturaPorcentaje: asignatura.porcentaje,
            nota: asignatura.nota,
            habilitacion: asignatura.habilitacion || '',
          });
        });
      });
    });

    this.tableData = tableData;
    console.log('Tabla...', this.tableData);
  }



  getColor(nota: number): string {
    if (!this.escalas) {
      console.warn('escalas no está definido');
      return 'black';
    }

    const escalaEncontrada = this.escalas.find((item: Escala) => nota >= item.minimo && nota <= item.maximo);
    return escalaEncontrada ? escalaEncontrada.color : 'black';
  }

  getBajo(nota: number): boolean{
    if (!this.escalas) {
      console.warn('escalas no está definido');
      return false;
    }

    const escalaEncontrada = this.escalas.find((item: Escala) => nota >= item.minimo && nota <= item.maximo);
    if(escalaEncontrada?.nombre=='bajo'){
      return true;
    }
    return false;

  }

  procesarLaNota(event: any) {
    console.log(this.habilitacionComponents.length)
    // Buscar el componente que lanzó el evento
    const currentIndex = this.habilitacionComponents.toArray().findIndex(
      (component) =>
        component.data.matricula.trim() === event.data.data.matricula.trim() &&
        component.data.asignacion.trim() === event.data.data.asignacion.trim()
      );
      console.log('Nota procesada:', currentIndex);

    // Enfocar el siguiente componente disponible
    if (currentIndex !== -1 && currentIndex + 1 < this.habilitacionComponents.length) {
      const nextComponent = this.habilitacionComponents.toArray()[currentIndex + 1];
      nextComponent.enfocarInput(); // Llamar a un método del componente hijo para enfocar el input
    }
  }
}
