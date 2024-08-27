import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Socket } from 'ngx-socket-io';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  private pollUpdateSubject = new BehaviorSubject<any>(null); // Subject for poll updates

  // private heartbeatInterval: NodeJS.Timeout | undefined;

  constructor(private socket:Socket,private toastr:ToastrService,private dialog:MatDialog) {
    this.setupSocketListeners();
   }

  private setupSocketListeners(){
    this.socket.on('online-users', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });

    this.socket.on('poll-updated', (poll: any) => {
      this.pollUpdateSubject.next(poll); // Notify components of poll updates
    });
  }

  disconnectUser() {
    this.socket.disconnect();
  }

  connectUser(userId: string) {
    this.socket.emit('user-connect', userId);
  }

  getPollUpdates():Observable<any>{
    return this.socket.fromEvent<any>('poll-updated');
  }

  emitVote(pollId: string, optionText: string, userId: string) {
    this.socket.emit('vote', { pollId, optionText, userId });
  }

  joinRoom(id:string){
    this.socket.emit('joinRoom',id)
  }


  sendMessage(senderId:string,roomId:string,message:string){
    this.socket.emit('sendMessage',{senderId,roomId,message})
  }

  getLastMessage():Observable<any>{
    return this.socket.fromEvent<any>('message')
  }

  getAllMessages(): Observable<any> {
    return this.socket.fromEvent<any>('allMessages');
  }
}
