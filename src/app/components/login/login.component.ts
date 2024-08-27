import { Component } from '@angular/core';
import { HeaderComponent } from "../layout/header/header.component";
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserServiceService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm:FormGroup;

  constructor(
    private userService:UserServiceService,
    private toastr:ToastrService,
    private fb:FormBuilder,
    private router:Router,
    private webSocketService:WebSocketService
  ){
    this.loginForm = fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern(/^[a-zA-Z0-9@!#$%^&*_-]{8,}$/)]],
    })
  }

  userLogin(){
    localStorage.setItem('email',this.loginForm.value.email)
    if(this.loginForm.valid){
      console.log(this.loginForm.value);

      this.userService.login(this.loginForm.value).subscribe({
        next:(response)=>{
          console.log(response);
          localStorage.setItem('userToken',response.token)
          const user = response.user
          localStorage.setItem('user_id',user.id)
          this.toastr.success(response.message,'Success')
          this.webSocketService.connectUser(user.id);
          this.router.navigate(['/home'])
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error');
          console.error(error);
        }
      })
    } else {
      this.toastr.error('Please enter valid email and password', 'Error');
    }
  }
}
