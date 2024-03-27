import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { CrudService } from 'src/app/service/crud.service';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit{

  public sidebarOpen: boolean = true;
  public usuario: User = new User
  public iniciales: string = ''
  public opts = [
    { label: 'Cursos', link: 'cursos' },
    { label: 'Periodos', link: 'periodos' },
    { label: 'Competencias', link: 'competencias' },
    { label: 'Notas Extra', link: 'notas-extras' },
  ]

  constructor(
    public crudService: CrudService<User>,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.crudService.read('/docente/auth').subscribe({
      next: (res: any) => {
        this.usuario = res.data
        this.iniciales = this.usuario.primer_nombre.charAt(0).toUpperCase() + this.usuario.primer_apellido.charAt(0).toUpperCase()

       },
       error: (error) => {


      }
    })
  }

  toggleMenu() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
