import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserServiceService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../layout/header/header.component";

@Component({
  selector: 'app-my-polls',
  standalone: true,
  imports: [RouterLink, CommonModule, HeaderComponent],
  templateUrl: './my-polls.component.html',
  styleUrl: './my-polls.component.scss'
})
export class MyPollsComponent implements OnInit{
  polls: any;
  constructor(private userService:UserServiceService,private toastr:ToastrService,private router:Router){}

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    const id = localStorage.getItem('user_id')
    if(id){
    this.userService.getMyPolls(id).subscribe({
      next: (polls) => {
        this.polls = polls;
      },
      error: (error) => {
        this.toastr.error('Failed to load polls', 'Error');
        console.error(error);
      }
    });
  }
  }

  navigateToPoll(pollId: string) {
    this.router.navigate(['/poll', pollId]);
  }
}
