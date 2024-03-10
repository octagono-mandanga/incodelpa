import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})
export class RootComponent implements OnInit {

  public sidebarOpen: boolean = true;

  public opts = [
    { label: 'Backup', link: 'backup' },
    { label: 'Periodos', link: 'periodos' },
    { label: 'Lectivos', link: 'lectivos' },
    { label: 'Usuarios', link: 'usuarios' },
    { label: 'Materias', link: 'materias' },
    { label: 'Areas', link: 'areas' },
    { label: 'Grados', link: 'grados' },
    { label: 'Niveles', link: 'niveles' },
    { label: 'Roles', link: 'roles' },
    { label: 'Institucion', link: 'institucion' },
    { label: 'Sedes', link: 'sedes' },
  ]

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
