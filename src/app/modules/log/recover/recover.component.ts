import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CrudService } from 'src/app/service/crud.service';


@Component({
  selector: 'app-recover',
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements OnInit {
  public resetForm!: FormGroup;
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
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.id = this.route.snapshot.params['id']

  }

  // Método para acceder a los controles del formulario de forma más conveniente
  get f() {
    return this.resetForm.controls;
  }

  reset(){
    this.loading = true;
    this.crudService.create(this.resetForm.value, '/recover').subscribe({
      next: (res: any) => {
       this.message = res.message
       this.success = true
       this.loading = false
      },
      error: (error) => {
        if(error.message)
          this.message = error.message
        else
          this.message = 'Error con el proceso. ('+error+')'
        this.success = false
        this.loading = false
      }
      });
    setTimeout(() => {
      this.message = '';

      // También resetea el success si es necesario
    }, 5000);
  }
  showMessage(tempMessage: string, isSuccess: boolean) {
    this.message = tempMessage;
    this.success = isSuccess;
    this.loading = false;
    setTimeout(() => this.message = '', 8000); // Oculta el mensaje después de 5 segundos
  }





}
