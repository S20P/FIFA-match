import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchesApiService {

  private url = 'http://206.189.161.54:8080/';
  //private url1 = 'http://206.189.161.54:8080/SendSocketData';

  
  private socket;


  constructor() {     
    var connection = {
      "force new connection":true,
      "reconnectionAttempts":"Infinity",
      "timeout": 10000,
      "transports":["websocket"]
    };


    this.socket = io.connect(this.url,connection);
    
    // this.socket.on("response", (data) => {
    //   console.log('TodoAdded: '+JSON.stringify(data));
    // });
   }
   
   public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('response', (data) => {
            observer.next(data);
        });
    });
  }

   public sendMessage(message) {
      return  this.socket.emit('SendSocketData', message);
   }

}
