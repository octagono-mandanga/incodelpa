import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CrudService } from 'src/app/service/crud.service';
import { Asignacion } from 'src/app/model/asignacion';
import { Curso } from 'src/app/model/curso';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-coordinacion-cursos-asignacion-edit',
  templateUrl: './coordinacion-cursos-asignacion-edit.component.html',
  styleUrls: ['./coordinacion-cursos-asignacion-edit.component.css']
})
export class CoordinacionCursosAsignacionEditComponent implements OnInit {
  public id!: string;
  public curso!: Curso;
  public asignaciones: Asignacion[] = [];
  public docentes: User[] = [];
  public loading = false;
  public loading2 = false;
  public message!: string;
  public success = true;

  public form!: FormGroup;
  public selectedIds: string[] = [];
  public rowStates: Record<string, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private crudAsignacion: CrudService<Asignacion>,
    private crudCurso: CrudService<Curso>,
    private crudDocente: CrudService<User>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.loading = true;
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      docente: [null, Validators.required]
    });

    this.crudCurso.read(`/coordinacion/cursos/${this.id}`)
      .subscribe({
        next: (res: any) => {
          this.curso = res.data;
          this.loadAsignaciones();
          this.loadDocentes();
        },
        error: err => {
          this.message = `Error al cargar curso: ${err}`;
          this.success = false;
          this.loading = false;
        }
      });
  }

  loadAsignaciones() {
    this.loading2 = true;
    this.crudAsignacion
      .read(`/coordinacion/asignaciones/curso/${this.id}`)
      .subscribe({
        next: (res: any) => {
          this.asignaciones = res.asignaciones;
          // Inicializa el switch con el estado actual
          this.asignaciones.forEach(a => {
            this.rowStates[a.id] = (a.estado === 'Activo');
          });
          this.loading = this.loading2 = false;
        },
        error: err => {
          this.message = `Error al cargar asignaciones: ${err}`;
          this.success = false;
          this.loading2 = false;
        }
      });
  }

  loadDocentes() {
    this.crudDocente.read('/coordinacion/docentes/')
      .subscribe({
        next: (res: any) => this.docentes = res,
        error: err => {
          this.message = `Error al cargar docentes: ${err}`;
          this.success = false;
        }
      });
  }

  onSelect(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedIds.push(id);
    } else {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    }
  }

  isSelected(id: string): boolean {
    return this.selectedIds.includes(id);
  }

  toggleAll(e: Event) {
    const allChecked = (e.target as HTMLInputElement).checked;
    this.selectedIds = allChecked
      ? this.asignaciones.map(a => a.id)
      : [];
  }

  hasSelection(): boolean {
    return this.selectedIds.length > 0;
  }

  onToggleState(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.rowStates[id] = checked;
  }

  onReassign() {
    if (this.form.invalid || !this.hasSelection()) return;

    this.loading2 = true;
    const nuevoDocenteId = this.form.value.docente;

    const calls = this.selectedIds.map(id => {
      const estado = this.rowStates[id] ? 'Activo' : 'Inactivo';
      const payload = { docente: nuevoDocenteId, estado };
      return this.crudAsignacion.update(
        payload as any,
        `/coordinacion/asignaciones/${id}`
      );
    });

    forkJoin(calls).subscribe({
      next: () => {
        this.message = 'Reasignaciones realizadas con éxito.';
        this.success = true;
        this.selectedIds = [];
        this.form.reset();
        this.loadAsignaciones();
      },
      error: err => {
        this.message = `Error al reasignar: ${err}`;
        this.success = false;
        this.loading2 = false;
      }
    });
  }
}
