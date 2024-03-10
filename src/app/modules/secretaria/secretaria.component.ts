import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-secretaria',
  templateUrl: './secretaria.component.html',
  styleUrls: ['./secretaria.component.css']
})
export class SecretariaComponent implements OnInit{

  public sidebarOpen: boolean = true;
  public usuario: User = new User
  public iniciales: string = ''
  public opts = [
    { label: 'Cursos', link: 'cursos' },
    { label: 'Alumnos', link: 'alumnos' },
    { label: 'Docentes', link: 'docentes' },
    { label: 'Reportes', link: 'reportes' },
  ]

  constructor(
    public crudService: CrudService<User>
  ) { }

  ngOnInit(): void {
    this.crudService.read('/secretaria/auth').subscribe({
      next: (res: any) => {
        this.usuario = res.data
        this.iniciales = this.usuario.primer_nombre.charAt(0).toUpperCase() + this.usuario.primer_apellido.charAt(0).toUpperCase()

       },
    })
  }

  toggleMenu() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
