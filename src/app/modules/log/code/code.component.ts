import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CrudService } from 'src/app/service/crud.service';


@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {
  public recoverForm!: FormGroup;
  public id!: string;
  public message: string = '';
  public loading: boolean = false;
  public success: boolean = false; // Nueva propiedad
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private crudService: CrudService<any>,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.recoverForm = this.formBuilder.group({
      code: [''],
      confirmar: ['12345678', [Validators.required, Validators.minLength(8)]],
      password: ['12345678', [Validators.required, Validators.minLength(8)]],
      email: ['glucio@unipacifico.edu.co  ', [Validators.required, Validators.email]]
    });

    const formGroupValidator = this.mustMatch('password', 'confirmar');
    this.recoverForm.setValidators(formGroupValidator);
    this.recoverForm.updateValueAndValidity();
    this.id = this.route.snapshot.params['id']
  }

  // Método para acceder a los controles del formulario de forma más conveniente
  get f() {
    return this.recoverForm.controls;
  }

  showMessage(tempMessage: string, isSuccess: boolean) {
    this.message = tempMessage;
    this.success = isSuccess;
    this.loading = false;
    setTimeout(() => this.message = '', 8000); // Oculta el mensaje después de 5 segundos
  }

  onSubmit() {
    if (this.recoverForm.invalid) {
      this.showMessage('Por favor, completa todos los campos correctamente.', false);
      return;
    }
    this.loading = true;
    this.recoverForm.patchValue({
      code: this.id // Asigna el valor deseado aquí
    });
    this.crudService.create(this.recoverForm.value, '/code').subscribe({
      next: (res: any) => {
       this.message = res.message
       this.success = true
       this.loading = false
       this.router.navigate(['/']);
      },
      error: (error) => {
        this.message = 'Error al crear el area : '+error
        this.success = false
        this.loading = false
      }
      });
    setTimeout(() => {
      this.message = '';

      // También resetea el success si es necesario
    }, 5000);
  }


  // Método personalizado para validar que dos campos coincidan
  mustMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Asegurarse de que el control es un FormGroup
      if (!(control instanceof FormGroup)) return null;

      const passwordControl = control.get(passwordField);
      const confirmPasswordControl = control.get(confirmPasswordField);

      if (!passwordControl || !confirmPasswordControl) return null;

      // Comprobar si el validador ya ha encontrado un error en confirmPasswordControl
      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['mustMatch']) {
        // Retorna nulo si otro validador ya ha marcado un error en el confirmPasswordControl
        return null;
      }

      // Establecer error en confirmPasswordControl si la validación falla
      return passwordControl.value === confirmPasswordControl.value ? null : { mustMatch: true };
    };
  }


}
