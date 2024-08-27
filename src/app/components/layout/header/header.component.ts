import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { WebSocketService } from '../../../services/web-socket.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(private userService: UserServiceService,private toastr:ToastrService,private router:Router,private websocketService:WebSocketService) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  logout(): void {
    this.userService.logout();
    this.websocketService.disconnectUser();
    this.toastr.success('User logout successfull','Success')
  }
}
