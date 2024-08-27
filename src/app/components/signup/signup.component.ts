import { Component } from '@angular/core';
import { HeaderComponent } from "../layout/header/header.component";
import { Router, RouterLink, RouterModule } from '@angular/router';
import { UserServiceService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']  // Updated from styleUrl to styleUrls
})

export class SignupComponent {
  userForm: FormGroup;

  constructor(
    private userService: UserServiceService,
    private toastr: ToastrService,  // Corrected typo from 'toster' to 'toastr'
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userForm = fb.group({
      username: [null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z]+$/)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
    });
  }

  signupUser() {
    console.log('clicked', this.userForm.value);
    this.userService.signup(this.userForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.toastr.success('Signup successful!', 'Success');  // Assuming response is not a string
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.toastr.error('Signup failed. Please try again.', 'Error');  // Simplified error message
        console.error('Error:', error);  // Log the full error for debugging
      }
    });
  }
}
