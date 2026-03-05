import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Curso } from 'src/app/model/curso';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-coordinacion-cursos-anteriores',
  templateUrl: './coordinacion-cursos-anteriores.component.html',
  styleUrls: ['./coordinacion-cursos-anteriores.component.css']
})
export class CoordinacionCursosAnterioresComponent implements OnInit {
  public data: Curso[] = [];
  public message!: string;
  public success: boolean = true;
  public loading: boolean = false;

  /** Cursos seleccionados para importar */
  public selectedCursos: Curso[] = [];
  public selectAll: boolean = false;

  /** Variables para el proceso de importación */
  public processing: boolean = false;
  public processMsg: string | undefined;
  public processProgress: number = 0;
  public processTotal: number = 0;
  public importedCursos: any[] = [];
  public failedCursos: any[] = [];

  constructor(
    private crudService: CrudService<any>,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loading = true;

    this.crudService.read('/coordinacion/cursos-anteriores').subscribe({
      next: (res: any) => {
        this.data = res.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener los cursos anteriores:', error);
        this.message = 'Error al cargar los cursos anteriores';
        this.success = false;
        this.loading = false;
      }
    });
  }

  /**
   * Maneja la selección/deselección de un curso individual
   */
  toggleCurso(curso: Curso, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCursos.push(curso);
    } else {
      this.selectedCursos = this.selectedCursos.filter(c => c.id !== curso.id);
    }
    // Actualizar estado de selectAll
    this.selectAll = this.selectedCursos.length === this.data.length;
  }

  /**
   * Maneja la selección/deselección de todos los cursos
   */
  toggleSelectAll(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    this.selectAll = checkbox.checked;

    if (this.selectAll) {
      this.selectedCursos = [...this.data];
    } else {
      this.selectedCursos = [];
    }
  }

  /**
   * Verifica si un curso está seleccionado
   */
  isSelected(curso: Curso): boolean {
    return this.selectedCursos.some(c => c.id === curso.id);
  }

  /**
   * Obtiene el número de cursos seleccionados
   */
  getSelectedCount(): number {
    return this.selectedCursos.length;
  }

  /**
   * Agrupa los cursos por año lectivo para mejor visualización
   */
  getCursosPorLectivo(): Map<string, Curso[]> {
    const grupos = new Map<string, Curso[]>();

    this.data.forEach(curso => {
      const key = `${curso.lectivo.anio} - ${curso.lectivo.nivel.nombre}`;
      if (!grupos.has(key)) {
        grupos.set(key, []);
      }
      grupos.get(key)!.push(curso);
    });

    return grupos;
  }

  /**
   * Delay helper para espaciar las peticiones
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Procesa la importación de los cursos seleccionados
   */
  async onProcesar(): Promise<void> {
    if (this.selectedCursos.length === 0) {
      this.message = 'Debe seleccionar al menos un curso para importar';
      this.success = false;
      return;
    }

    this.processing = true;
    this.processProgress = 0;
    this.processTotal = this.selectedCursos.length;
    this.importedCursos = [];
    this.failedCursos = [];
    this.message = '';

    for (let i = 0; i < this.selectedCursos.length; i++) {
      const curso = this.selectedCursos[i];
      this.processProgress = i + 1;
      this.processMsg = `Importando ${curso.nombre} (${curso.grado?.nombre})... (${this.processProgress}/${this.processTotal})`;

      try {
        const res: any = await firstValueFrom(
          this.crudService.create({}, `/coordinacion/cursos-importar/${curso.id}`)
        );

        if (res.success) {
          this.importedCursos.push({
            nombre: curso.nombre,
            grado: curso.grado?.nombre,
            asignaciones: res.asignaciones_copiadas
          });
        } else {
          this.failedCursos.push({
            nombre: curso.nombre,
            grado: curso.grado?.nombre,
            error: res.message
          });
        }
      } catch (error: any) {
        const errorMsg = error?.error?.message || error?.message || 'Error desconocido';
        this.failedCursos.push({
          nombre: curso.nombre,
          grado: curso.grado?.nombre,
          error: errorMsg
        });
      }

      // Delay entre cada importación para no sobrecargar el servidor
      if (i < this.selectedCursos.length - 1) {
        await this.delay(500);
      }
    }

    this.processing = false;
    this.processMsg = undefined;

    // Mostrar resumen
    if (this.importedCursos.length > 0 && this.failedCursos.length === 0) {
      this.message = `Se importaron ${this.importedCursos.length} curso(s) exitosamente`;
      this.success = true;
    } else if (this.importedCursos.length > 0 && this.failedCursos.length > 0) {
      this.message = `Se importaron ${this.importedCursos.length} curso(s). ${this.failedCursos.length} curso(s) fallaron.`;
      this.success = false;
    } else {
      this.message = `No se pudieron importar los cursos seleccionados`;
      this.success = false;
    }

    // Limpiar selección de cursos importados exitosamente
    const importedIds = this.importedCursos.map(c => c.nombre);
    this.selectedCursos = this.selectedCursos.filter(c => !importedIds.includes(c.nombre));
    this.selectAll = false;

    // Recargar datos después de 3 segundos si hubo importaciones exitosas
    if (this.importedCursos.length > 0) {
      setTimeout(() => {
        this.router.navigate(['/coordinacion/cursos']);
      }, 3000);
    }
  }
}
