import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  public loading: boolean = false;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loading = true
    this.authService.logout().subscribe({
      next: (response) => {
        this.loading = false
        localStorage.removeItem('token'); // Asumiendo que el token se almacena aquí
        localStorage.removeItem('userId'); // Asumiendo que el token se almacena aquí
        this.router.navigate(['/']); // Redirige al usuario a la página de login
      },
      error: (error) => {
        localStorage.removeItem('token'); // Asumiendo que el token se almacena aquí
        localStorage.removeItem('userId'); // Asumiendo que el token se almacena aquí
        this.router.navigate(['/']); // Redirige al usuario a la página de login
        console.error(error);
      }
    });
  }
}
