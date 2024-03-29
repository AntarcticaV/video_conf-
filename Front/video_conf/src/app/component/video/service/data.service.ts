import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Message } from '../type/message';

export const WS_ENDPOINT = 'ws://localhost:8081/'; // wsEndpoint: 'ws://localhost:8081'

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private socket$: WebSocketSubject<Message> | undefined;

  private messagesSubject = new Subject<any>();
  public messages$ = this.messagesSubject.asObservable();

  /**
   * Creates a new WebSocket subject and send it to the messages subject
   * @param cfg if true the observable will be retried.
   */
  public connect(): void {
    console.log(!this.socket$);
    if (this.socket$) console.log(this.socket$.closed);

    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();

      this.socket$.subscribe(
        // Called whenever there is a message from the server
        (msg) => {
          console.log('Received message of type: ' + msg.type);
          this.messagesSubject.next(msg);
        }
      );
    }
  }

  sendMessage(msg: Message): void {
    console.log('sending message: ' + msg.type);
    if (this.socket$) this.socket$.next(msg);
  }

  /**
   * Return a custom WebSocket subject which reconnects after failure
   */
  private getNewWebSocket(): WebSocketSubject<Message> {
    console.log('log');

    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('[DataService]: connection ok');
        },
      },
      closeObserver: {
        next: () => {
          console.log('[DataService]: connection closed');
          this.socket$?.closed;
          this.connect();
        },
      },
    });
  }
}
