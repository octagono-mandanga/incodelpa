import { Component, OnInit } from '@angular/core';
import { Curso } from 'src/app/model/curso';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-secretaria-cursos',
  templateUrl: './secretaria-cursos.component.html',
  styleUrls: ['./secretaria-cursos.component.css']
})
export class SecretariaCursosComponent implements OnInit {
  public config: any
  public data: Curso[] = []
  public message!: string
  public success: boolean = true
  public loading: boolean = false

  constructor(
    private crudService: CrudService<Curso>
  ) {
    this.config = {
      columns: [
        { key: 'nombre', displayName: 'Curso' },
        { key: 'lectivo.nivel.nombre', displayName: 'Nivel' },
        { key: 'grado.nombre', displayName: 'Grado' },
        { key: 'director.primer_nombre', displayName: 'Director' },
        { key: 'director.primer_apellido', displayName: '' },
        { key: 'sede.nombre', displayName: 'Sede' },
        { key: 'estado', displayName: 'Estado' },
      ],
      actions: {
        'view': '/secretaria/cursos/view/'
      }
    };
  }
  ngOnInit(): void {
    this.loading = true
    this.crudService.read('/secretaria/cursos').subscribe({
      next: (data: Curso[]) => {
        this.data = data
        this.loading = false
      },
      error: (error) => {
        console.error('Error al obtener los areas:', error);
      }
    });
  }

  onBorrar(id: any){
    this.loading = true
    this.crudService.delete('/secretaria/cursos/'+ id).subscribe({
      next: (res: any) => {
        this.data = this.data.filter(r => r.id !== id);
        this.message = res.message
        this.success = false
        this.loading = false
      },
      error: (error) => {


        this.message = 'Error al actualizar '+ error;
        this.success = false
        this.loading = false

      }
    });
    setTimeout(() => {
      this.message = '';
      // También resetea el success si es necesario
    }, 5000);
  }
}


