import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Docente } from 'src/app/model/docente';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-secretaria-docentes-view',
  templateUrl: './secretaria-docentes-view.component.html',
  styleUrls: ['./secretaria-docentes-view.component.css']
})
export class SecretariaDocentesViewComponent implements  OnInit {
  public config: any
  public id!: string
  public message!: string
  public success: boolean = true
  public loading: boolean = false
  public data!: Docente

  public asignacion: any[] = []


  constructor(
    public route: ActivatedRoute,
    private crudService: CrudService<User>,

  ){}

  async ngOnInit() {
    this.loading = true
    this.id =  this.route.snapshot.params['id']
    await this.crudService.read('/secretaria/docentes/'+this.id).subscribe({
      next: (res: any) => {
        this.data = res.user
        if(res?.data){
          this.data.asignaciones = res.data
          this.estructurar()
        }
        this.loading = false
       },
       error: (error) => {
         this.message = 'Error al cargar el curso : '+error
         this.success = false
         this.loading = false
       }
    })
  }

  estructurar(){
    this.data.asignaciones.forEach(asignacion => {
      let nivel = this.asignacion.find(n => n.nombre === asignacion.curso.lectivo.nivel.nombre);
      if (!nivel) {
        nivel = { nombre: asignacion.curso.lectivo.nivel.nombre, grados: [] };
        this.asignacion.push(nivel);
      }

      let grado = nivel.grados.find((g: any) => g.nombre === asignacion.curso.grado.nombre);
      if (!grado) {
        grado = { nombre: asignacion.curso.grado.nombre, cursos: [] };
        nivel.grados.push(grado);
      }

      let curso = grado.cursos.find((c: any) => c.nombre === asignacion.curso.nombre);
      if (!curso) {
        curso = { id: asignacion.curso.id, nombre: asignacion.curso.nombre, materias: [] };
        grado.cursos.push(curso);
      }

      curso.materias.push(asignacion.materia.nombre);
    });
  }
}
