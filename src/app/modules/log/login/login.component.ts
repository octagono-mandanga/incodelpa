import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public message: string = '';
  public loading: boolean = false;
  public success: boolean = false; // Nueva propiedad
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['gonzaloandreslucio@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
      active: [false]
    });
  }

  // Método para acceder a los controles del formulario de forma más conveniente
  get f() {
    return this.loginForm.controls;
  }

  showMessage(tempMessage: string, isSuccess: boolean) {
    this.message = tempMessage;
    this.success = isSuccess;
    this.loading = false;
    setTimeout(() => this.message = '', 8000); // Oculta el mensaje después de 5 segundos
  }

  login() {
    if (this.loginForm.invalid) {
      this.showMessage('Por favor, completa todos los campos correctamente.', false);
      return;
    }
    this.loading = true;
    this.authService.login(this.f['email'].value, this.f['password'].value, this.f['active'].value).pipe(
      catchError(error => {
        const message = error.error.message || 'No se pudo conectar con el servidor. Por favor, inténtalo más tarde.';
        this.showMessage(message, false);
        return of(null); // Manejo del error para que no se propague
      })
      ).subscribe(response => {
        if (response) {
          localStorage.setItem('token', response.token); // Almacenar el token
          localStorage.setItem('userId', response.user.id); // Almacenar el ID del usuario


          this.showMessage('Inicio de sesión exitoso', true);
          this.authService.getUserRoles().subscribe({
            next: (rolesResponse) => {
              const roles = rolesResponse.roles;
              // Aquí puedes hacer algo con los roles, como almacenarlos en el estado de la aplicación
              if(roles[0])
                this.router.navigate(['/'+roles[0]]);
              else
                console.log("123")
            },
            error: (error) => {
              console.error('Error al obtener los roles del usuario', error);
            }
          });




        }
        this.loading = false;
      });
  }

  recoverPassword() {
    if (!this.f['email'].value) {
      this.showMessage('Por favor, introduce tu email para recuperar tu contraseña.', false);
      return;
    }
    this.loading = true;
    this.authService.recover(this.f['email'].value).subscribe({
      next: () => {
        this.showMessage('Se han enviado las instrucciones de recuperación a tu correo.', true);
      },
      error: () => {
        this.showMessage('Hubo un problema al enviar las instrucciones de recuperación. Por favor, intenta de nuevo más tarde.', false);
      }
    });
  }


}
