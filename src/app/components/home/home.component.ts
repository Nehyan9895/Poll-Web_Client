import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../layout/header/header.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreatePollModalComponent } from '../create-poll-modal/create-poll-modal.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { IPollData } from '../../interfaces/IPollData';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UserServiceService } from '../../services/user.service';
import { Router } from '@angular/router';
import { WebSocketService } from '../../services/web-socket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,MatDialogModule,CreatePollModalComponent,CommonModule,MatInputModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  polls: any;
  pollData:IPollData | undefined

  constructor(
    public dialog: MatDialog,
    private htttp:HttpClient,
    private toastr:ToastrService,
    private userService:UserServiceService,
    private webSocketService:WebSocketService,
    private cdr: ChangeDetectorRef,
    private router:Router
  ) {}
  
  openPollModal(): void {
    const dialogRef = this.dialog.open(CreatePollModalComponent, {
      width: '400px',  // Adjust width as needed
      height: 'auto',
      data: {} // Pass any data if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Poll Data:', result);
        this.pollData = result
        this.createPoll();
      }
    });
  }

  ngOnInit(): void {
    this.loadPolls();
  }

  loadPolls(): void {
    this.userService.getPolls().subscribe({
      next: (polls) => {
        this.polls = polls;
      },
      error: (error) => {
        this.toastr.error('Failed to load polls', 'Error');
        console.error(error);
      }
    });
  }


  createPoll(): void {
    if (this.pollData) {
      this.userService.createPoll(this.pollData).subscribe({
        next: (response) => {
          console.log(response);
          this.toastr.success(response.message, 'Success');
          
          // Add the new poll to the existing list
          this.polls.push(response.poll);
  
          // Trigger change detection
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.toastr.error(error.error, 'Error');
          console.error(error);
        }
      });
    } else {
      console.log('No poll data');
    }
  }
  
  navigateToPoll(pollId: string) {
    this.router.navigate(['/poll', pollId]);
  }



}
