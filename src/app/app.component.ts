import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'clock';
  time: Date = new Date();
  fontSize: number = 160;
  screenLock: boolean = false;
  wakeLock: any = null;
  navigator: any = window.navigator;
  fullScreen: boolean = false;
  ngOnInit() {
    if (localStorage!.getItem('fontSize')) {
      this.fontSize = +localStorage!.getItem('fontSize')!;
    }
    setInterval(() => {
      this.time = new Date();
    }, 1000);

    document.addEventListener('fullscreenchange', () => {
      if (document.fullscreenElement) {
        this.fullScreen = true;
        screen.orientation.lock('portrait').catch((e) => {
          console.log(e);
        });
      } else {
        this.fullScreen = false;
        screen.orientation.unlock();
      }
    });
  }
  incFont() {
    this.fontSize += 4;
    localStorage?.setItem('fontSize', this.fontSize.toString());
  }

  decFont() {
    this.fontSize -= 4;

    localStorage?.setItem('fontSize', this.fontSize.toString());
  }

  lockScreenHandler() {
    //this.screenLock = !this.screenLock;
    this.wakeLockScreen();
  }

  async wakeLockScreen() {
    if ('wakeLock' in this.navigator) {
      document.addEventListener('visibilitychange', async () => {
        if (this.wakeLock && document.visibilityState === 'visible') {
          this.wakeLock = await this.navigator.wakeLock.request('screen');
        }
      });
      if (!this.wakeLock) {
        try {
          this.wakeLock = await this.navigator.wakeLock.request('screen');
        } catch (err) {
          alert('wake screen inabled');
        }
      } else {
        this.wakeLock.release().then(() => {
          this.wakeLock = null;
        });
      }
    } else {
      alert('wakeLock not support');
    }
  }

  enterFullScreen() {
    document.documentElement.requestFullscreen().then(() => {
      this.fullScreen = true;
      if (!this.wakeLock) this.lockScreenHandler();
    });
  }
  exitFullScreen() {
    document.exitFullscreen().then(() => {
      this.fullScreen = false;
      if (this.wakeLock) this.lockScreenHandler();
    });
  }
}
