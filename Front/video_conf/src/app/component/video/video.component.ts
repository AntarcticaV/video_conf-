import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from './service/data.service';
import { Message } from './type/message';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

const mediaConstraints = {
  audio: true,
  video: { width: 640, height: 350 },
};

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss',
})
export class VideoComponent implements AfterViewInit {
  @ViewChild('local_video') localVideo: ElementRef | undefined;
  @ViewChild('received_video') remoteVideo: ElementRef | undefined;
  private localStream: MediaStream | undefined;
  private peerConnection: RTCPeerConnection | undefined;

  inCall = false;
  localVideoActive = false;

  constructor(private dataService: DataService, private router: Router) {}

  async call(): Promise<void> {
    this.createPeerConnection();

    // Add the tracks from the local stream to the RTCPeerConnection
    if (this.localStream)
      this.localStream.getTracks().forEach((track) => {
        if (this.peerConnection && this.localStream)
          this.peerConnection.addTrack(track, this.localStream);
      });

    try {
      if (this.peerConnection) {
        const offer = await this.peerConnection.createOffer(offerOptions);
        // Establish the offer as the local peer's current description.

        await this.peerConnection.setLocalDescription(offer);

        this.inCall = true;

        this.dataService.sendMessage({ type: 'offer', data: offer });
      }
    } catch (err) {
      if (err instanceof Error) this.handleGetUserMediaError(err);
    }
  }

  hangUp(): void {
    this.dataService.sendMessage({ type: 'hangup', data: '' });
    this.closeVideoCall();
    this.router.navigate(['/']);
  }

  ngAfterViewInit(): void {
    this.addIncominMessageHandler();
    this.requestMediaDevices();
  }

  private addIncominMessageHandler(): void {
    this.dataService.connect();
    console.log('vyghbjnk');

    this.dataService.messages$.subscribe(
      (msg) => {
        msg = JSON.parse(msg);
        console.log('Received message: ' + typeof msg);
        switch (msg.type) {
          case 'offer':
            this.handleOfferMessage(msg.data);
            break;
          case 'answer':
            this.handleAnswerMessage(msg.data);
            break;
          case 'hangup':
            this.handleHangupMessage(msg);
            break;
          case 'ice-candidate':
            console.log(msg);

            this.handleICECandidateMessage(msg.data);
            break;
          default:
            console.log('unknown message of type ' + msg.type);
        }
      },
      (error) => console.log(error)
    );
  }

  /* ########################  MESSAGE HANDLER  ################################## */

  private handleOfferMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming offer');
    if (!this.peerConnection) {
      this.createPeerConnection();
    }

    if (!this.localStream) {
      this.startLocalVideo();
    }
    if (this.peerConnection)
      this.peerConnection
        .setRemoteDescription(new RTCSessionDescription(msg))
        .then(() => {
          // add media stream to local video
          if (this.localVideo)
            this.localVideo.nativeElement.srcObject = this.localStream;

          // add media tracks to remote connection
          if (this.localStream)
            this.localStream.getTracks().forEach((track) => {
              if (this.peerConnection && this.localStream)
                this.peerConnection.addTrack(track, this.localStream);
            });
        })
        .then(() => {
          // Build SDP for answer message
          if (this.peerConnection) return this.peerConnection.createAnswer();
          return undefined;
        })
        .then((answer) => {
          // Set local SDP

          if (this.peerConnection)
            return this.peerConnection.setLocalDescription(answer);
          return undefined;
        })
        .then(() => {
          // Send local SDP to remote party
          if (this.peerConnection)
            this.dataService.sendMessage({
              type: 'answer',

              data: this.peerConnection.localDescription,
            });

          this.inCall = true;
        })
        .catch(this.handleGetUserMediaError);
  }

  private handleAnswerMessage(msg: RTCSessionDescriptionInit): void {
    console.log('handle incoming answer');
    if (this.peerConnection) this.peerConnection.setRemoteDescription(msg);
  }

  private handleHangupMessage(msg: Message): void {
    console.log(msg);
    this.closeVideoCall();
  }

  private handleICECandidateMessage(msg: RTCIceCandidate): void {
    const candidate = new RTCIceCandidate(msg);
    if (this.peerConnection)
      this.peerConnection.addIceCandidate(candidate).catch(this.reportError);
  }

  private async requestMediaDevices(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia(
        mediaConstraints
      );
      // pause all tracks
      this.pauseLocalVideo();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) alert(`getUserMedia() error: ${e.name}`);
    }
  }

  startLocalVideo(): void {
    console.log('starting local stream');
    if (this.localStream)
      this.localStream.getTracks().forEach((track) => {
        track.enabled = true;
      });
    if (this.localVideo)
      this.localVideo.nativeElement.srcObject = this.localStream;

    this.localVideoActive = true;
  }

  pauseLocalVideo(): void {
    console.log('pause local stream');
    if (this.localStream)
      this.localStream.getTracks().forEach((track) => {
        track.enabled = false;
      });
    if (this.localVideo) this.localVideo.nativeElement.srcObject = undefined;

    this.localVideoActive = false;
  }

  private createPeerConnection(): void {
    console.log('creating PeerConnection...');
    this.peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
      ],
    });

    this.peerConnection.onicecandidate = this.handleICECandidateEvent;
    this.peerConnection.oniceconnectionstatechange =
      this.handleICEConnectionStateChangeEvent;
    this.peerConnection.onsignalingstatechange =
      this.handleSignalingStateChangeEvent;
    this.peerConnection.ontrack = this.handleTrackEvent;
  }

  private closeVideoCall(): void {
    console.log('Closing call');

    if (this.peerConnection) {
      console.log('--> Closing the peer connection');

      this.peerConnection.ontrack = null;
      this.peerConnection.onicecandidate = null;
      this.peerConnection.oniceconnectionstatechange = null;
      this.peerConnection.onsignalingstatechange = null;

      // Stop all transceivers on the connection
      this.peerConnection.getTransceivers().forEach((transceiver) => {
        transceiver.stop();
      });

      // Close the peer connection
      this.peerConnection.close();

      this.inCall = false;
    }
  }

  /* ########################  ERROR HANDLER  ################################## */
  private handleGetUserMediaError(e: Error): void {
    switch (e.name) {
      case 'NotFoundError':
        alert(
          'Unable to open your call because no camera and/or microphone were found.'
        );
        break;
      case 'SecurityError':
      case 'PermissionDeniedError':
        // Do nothing; this is the same as the user canceling the call.
        break;
      default:
        console.log(e);
        alert('Error opening your camera and/or microphone: ' + e.message);
        break;
    }

    this.closeVideoCall();
  }

  private reportError = (e: Error) => {
    console.log('got Error: ' + e.name);
    console.log(e);
  };

  /* ########################  EVENT HANDLER  ################################## */
  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log(event);
    if (event.candidate) {
      this.dataService.sendMessage({
        type: 'ice-candidate',
        data: event.candidate,
      });
    }
  };

  private handleICEConnectionStateChangeEvent = (event: Event) => {
    console.log(event);
    if (this.peerConnection)
      switch (this.peerConnection.iceConnectionState) {
        case 'closed':
        case 'failed':
        case 'disconnected':
          this.closeVideoCall();
          break;
      }
  };

  private handleSignalingStateChangeEvent = (event: Event) => {
    console.log(event);
    if (this.peerConnection)
      switch (this.peerConnection.signalingState) {
        case 'closed':
          this.closeVideoCall();
          break;
      }
  };

  private handleTrackEvent = (event: RTCTrackEvent) => {
    console.log(event);
    if (this.remoteVideo)
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
  };
}
