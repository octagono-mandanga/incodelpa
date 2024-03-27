import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Materia } from 'src/app/model/materia';
import { CrudService } from 'src/app/service/crud.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-docente-competencia-asignatura',
  templateUrl: './docente-competencia-asignatura.component.html',
  styleUrls: ['./docente-competencia-asignatura.component.css']
})
export class DocenteCompetenciaAsignaturaComponent implements OnInit {
  public loading: boolean = false
  public loading2: boolean = false
  public success: boolean = false
  public msg: string = ''
  public message: string = ''
  public id: string = ''
  public data!: Materia
  constructor(
    private crudMateriaService: CrudService<Materia>,
    private activedRoute: ActivatedRoute
  ){}
  ngOnInit() {
    this.id = this.activedRoute.snapshot.params['id']
    this.loading = true
    this.msg = 'Materia'
    this.crudMateriaService.read('/docente/materias/' + this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.data.competencias.sort((a: any, b: any) => a.orden - b.orden);
        this.loading = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar las asignaturas: '+error
         this.success = false
         this.loading = false
       }
    })
  }
  drop(event: CdkDragDrop<string[]>) {
    // Asume que cada elemento tiene un campo 'orden' además de 'nombre'
    const prevIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    // Si no hay cambio, no hagas nada
    if (prevIndex === currentIndex) {
      return;
    }

    // Calcula el nuevo orden y prepara los datos para el backend
    let updates = [];
    if (prevIndex < currentIndex) {
      // Mover hacia abajo en la lista
      for (let i = prevIndex; i <= currentIndex; i++) {
        if (i === prevIndex) {
          updates.push({ id: this.data.competencias[i].id, nuevoOrden: currentIndex + 1 });
        } else {
          updates.push({ id: this.data.competencias[i].id, nuevoOrden: i });
        }
      }
    } else {
      // Mover hacia arriba en la lista
      for (let i = currentIndex; i <= prevIndex; i++) {
        if (i === prevIndex) {
          updates.push({ id: this.data.competencias[i].id, nuevoOrden: currentIndex + 1 });
        } else {
          updates.push({ id: this.data.competencias[i].id, nuevoOrden: i + 2 });
        }
      }
    }
    moveItemInArray(this.data.competencias, event.previousIndex, event.currentIndex);
    // Envía los datos al backend
    this.enviarCambiosAlBackend(updates);
  }

  enviarCambiosAlBackend(updates: any){
    this.loading2 = true
    const data = new Materia
    data.competencias =  updates
    this.crudMateriaService.update(data, '/docente/materias/' + this.id).subscribe({
      next: (res: any) => {
        this.data = res.data
        this.data.competencias.sort((a: any, b: any) => a.orden - b.orden);
        this.loading2 = false
        this.msg = ''
       },
       error: (error) => {
         this.message = 'Error al cargar las asignaturas: '+error
         this.success = false
         this.loading2 = false
       }
    })
  }
}
