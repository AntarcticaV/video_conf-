import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [CommonModule, WebcamModule],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss',
})
export class WebcamComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer: ElementRef = new ElementRef(null);

  public microphone = true;
  ws: WebSocket | undefined;

  buttonMicrophone(): void {
    this.microphone = !this.microphone;
  }

  private mediaRecorder: MediaRecorder | undefined;
  private recordedChunks: Blob[] = [];
  videoSource: string = '';

  ngOnInit(): void {
    this.setupWebcam();
    this.ws = new WebSocket('ws://localhost:8000/ws');

    this.ws.onmessage = function (event) {
      console.log(event.data);
    };
  }

  setupWebcam(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data);
            const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
            this.videoSource = URL.createObjectURL(blob);

            // this.videoPlayer.nativeElement.srcObject = event.data;
          }
        };

        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          // this.videoSource = URL.createObjectURL(blob);
        };
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
      });
  }
  sendMessage() {
    if (this.ws) {
      this.ws.send('hi');
    }
  }

  startRecording(): void {
    this.recordedChunks = [];
    if (this.mediaRecorder) {
      this.mediaRecorder.start();
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  videoOption: MediaTrackConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };
}
