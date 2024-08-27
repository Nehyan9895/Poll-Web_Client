import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { HeaderComponent } from "../layout/header/header.component";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { CommonModule, formatDate } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { UserServiceService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { WebSocketService } from '../../services/web-socket.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables);

interface PollOption {
  optionText: string;
  option: string;
  votes: number;
  color: string;
}

@Component({
  selector: 'app-poll-page',
  standalone: true,
  imports: [
    HeaderComponent,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatCardModule,
    CommonModule,
    BaseChartDirective,
    FormsModule,
  ],
  templateUrl: './poll-page.component.html',
  styleUrls: ['./poll-page.component.scss']
})
export class PollPageComponent implements OnInit, OnDestroy,AfterViewChecked {

  @ViewChild('chatContainer') private messagesContainer!: ElementRef;
  pollData: PollOption[] = [];
  pollChart!: Chart;
  Poll: any;
  message!:string;
  messages:any
  pollId:any 
  userId:any
  private pollSubscription!: Subscription;
  private messagesSubscription!: Subscription;
  private lastMessageSubscription!: Subscription;
  pollCreatedBy: any;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  private readonly colors = [
    'rgb(75, 192, 192)', // Teal
    'rgb(255, 99, 132)', // Red
    'rgb(255, 205, 86)', // Yellow
    'rgb(54, 162, 235)'  // Blue
  ];

  constructor(
    private route: ActivatedRoute,
    private userService: UserServiceService,
    private toastr: ToastrService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    this.loadPollData();
    this.pollSubscription = this.webSocketService.getPollUpdates().subscribe((poll: any) => {
      this.updatePollData(poll);
    });
  
    this.userId = localStorage.getItem('user_id');
  
    this.messagesSubscription = this.webSocketService.getAllMessages().subscribe(msg => {
      console.log(msg, 'mmessages');
      this.messages = msg
      // Scroll to the bottom of the chat
      setTimeout(() => {
        const chatContainer = document.querySelector('.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    });

    this.lastMessageSubscription = this.webSocketService.getLastMessage().subscribe((msg) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });
  }
  

  sendMessage(){
    if(this.pollId,this.userId,this.message){
      this.webSocketService.sendMessage(this.userId,this.pollId,this.message.trim())
      this.message = ''
      this.scrollToBottom();
    } else {
      this.toastr.error('Something went wrong. Try logging in again.');
    }
  }

  ngOnDestroy(): void {
    if (this.pollSubscription) {
      this.pollSubscription.unsubscribe();
    }
  }

  private loadPollData(): void {
    this.pollId = this.route.snapshot.paramMap.get('id');
    if (this.pollId) {
      this.webSocketService.joinRoom(this.pollId);
      this.userService.getPollById(this.pollId).subscribe({
        next: (data) => {
          console.log(data,'dadada');
          
          this.Poll = data;
          this.pollCreatedBy = data.creator_id.username
          this.pollData = data.options.map((option: any, index: number) => ({
            optionText: option.optionText,
            votes: option.votes,
            color: this.colors[index % this.colors.length] // Assign color from the array
          }));
          this.initChart();
        },
        error: (error) => {
          console.error('Failed to load poll data', error);
        }
      });
    }
  }

  private updatePollData(poll: any): void {
    this.Poll = poll;
    this.pollData = poll.options.map((option: any, index: number) => ({
      optionText: option.optionText,
      votes: option.votes,
      color: this.colors[index % this.colors.length]
    }));
    this.updateChart();
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const pollOptionInput = form.querySelector<HTMLInputElement>("input[name='pollOptions']:checked");
    if (pollOptionInput) {
      const pollOptionValue = pollOptionInput.value;
      const pollOption = this.pollData.find(option => option.optionText === pollOptionValue);
      if (pollOption) {
        pollOption.votes++;
        const pollId = this.route.snapshot.paramMap.get('id');
        
        if (pollId && this.userId) {
          this.userService.updateVote(pollId, pollOptionValue, this.userId).subscribe({
            next: (response) => {
              console.log('Vote updated successfully', response);
              this.toastr.success(response.message, 'Success');
              this.webSocketService.emitVote(pollId, pollOptionValue, this.userId); // Emit vote to WebSocket server
              this.updateChart()
            },
            error: (error) => {
              console.error('Failed to update vote', error);
              this.toastr.error(error.error.message, 'Error');
            }
          });
        }
      }
      form.reset();
    }
  }

  private initChart(): void {
    const ctx = (document.getElementById('chart') as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      this.pollChart = new Chart(ctx, {
        type: 'bar',
        data: this.getChartData(),
        options: this.getChartOptions(),
      });
    }
  }

  private updateChart(): void {
    this.pollChart.data.datasets![0].data = this.pollData.map(option => option.votes);
    this.pollChart.data.datasets![0].backgroundColor = this.pollData.map(option => this.rgbToRgba(option.color, 0.75));
    this.pollChart.update();
  }

  private getChartData(): ChartData<'bar'> {
    return {
      labels: this.pollData.map(option => option.optionText),
      datasets: [
        {
          label: '# of Votes',
          data: this.pollData.map(option => option.votes),
          backgroundColor: this.pollData.map(option => this.rgbToRgba(option.color, 0.75)),
          borderWidth: 3,
        },
      ],
    };
  }

  private getChartOptions(): ChartConfiguration<'bar'>['options'] {
    return {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Poll Results',
          color: '#333',
          font: {
            size: 20,
          },
          padding: 20,
        },
        legend: {
          display: false,
        },
      },
    };
  }

  private rgbToRgba(rgb: string, alpha: number = 1): string {
    return `rgba(${rgb.substring(rgb.indexOf('(') + 1, rgb.length - 1)}, ${alpha})`;
  }
}
