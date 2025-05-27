import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  NgModel,
  FormsModule,
  FormControl,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // Opcional
import { ApiService } from '../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule, // Opcional
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  name: String = '';
  form!: FormGroup;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      user: new FormControl('', Validators.required),
      pass: new FormControl('', Validators.required),
    });
  }

  obtenerDatos() {
    this.apiService.getData().subscribe((data) => {
      console.log('Data received:', data);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { user, pass } = this.form.value;
      this.apiService
        .login({ username: user, password: pass })
        .subscribe((data) => {
          if (data.statusCode === 200) {
            Swal.fire({
              title: 'Inicio de sesión exitoso',
              text: '¡Bienvenido a la Pokedex!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              this.router.navigate(['/pokedex']);
            });
          } else {
            Swal.fire({
              title: 'Error de inicio de sesión',
              text: 'Usuario o contraseña incorrectos',
              icon: 'error',
              confirmButtonText: 'Intentar de nuevo',
            });
          }
        });
    } else {
      Swal.fire({
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
      });
    }
  }

  toRegister() {
    this.router.navigate(['/register']);
  }
}
