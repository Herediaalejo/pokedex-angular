import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private router: Router,
    private apiService: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      age: new FormControl('', [Validators.required, Validators.min(11)]),
      tel: new FormControl('', [Validators.required, Validators.minLength(9)]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl('', Validators.required),
      repeatPassword: new FormControl('', Validators.required),
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} es requerido`;
    }
    if (controlName === 'email' && control?.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (controlName === 'age' && control?.hasError('min')) {
      return 'Debe ser mayor de 11 años';
    }
    if (controlName === 'tel' && control?.hasError('minlength')) {
      return 'El número de teléfono debe tener al menos 9 dígitos';
    }
    if (controlName === 'username' && control?.hasError('minlength')) {
      return 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    return '';
  }

  openConfirmDialog(): void {
    if (this.form.invalid) {
      let errorMessages = '';
      Object.keys(this.form.controls).forEach((key) => {
        const errorMessage = this.getErrorMessage(key);
        if (errorMessage) {
          errorMessages += `<li>${errorMessage}</li>`;
        }
      });

      // Verificar si las contraseñas coinciden
      const password = this.form.get('password')?.value;
      const repeatPassword = this.form.get('repeatPassword')?.value;

      if (password !== repeatPassword) {
        errorMessages += `<li>Las contraseñas no coinciden</li>`;
      }

      if (errorMessages) {
        Swal.fire({
          title: 'Errores en el formulario',
          html: `<ul class="custom-swal-list">${errorMessages}</ul>`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    } else {
      console.log('Formulario válido', this.form.value);
      this.onSubmit();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { username, password, repeatPassword } = this.form.value;
      if (password !== repeatPassword) {
        this.form.get('repeatPassword')?.setErrors({ mismatch: true });
        return;
      }

      this.apiService.register({ username, password }).subscribe((data) => {
        console.log(data);
        if (data.statusCode === 200) {
          // Muestra el swal de éxito
          Swal.fire({
            title: 'Registro exitoso',
            text: 'Te has registrado correctamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          }).then(() => {
            this.router.navigate(['/login']);
          });
        } else {
          // Manejo de errores de la API.
          Swal.fire({
            title: 'Error',
            html: `<p>${data.message}</p>`,
            icon: 'error',
            confirmButtonText: 'Aceptar',
          });
        }
      });
    }
  }

  toLogin(): void {
    this.router.navigate(['/login']);
  }
}
