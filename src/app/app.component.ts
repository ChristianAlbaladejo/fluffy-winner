import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { FcmService } from './services/fcm.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
} from '@capacitor/core';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
const USER = '';

const { PushNotifications } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public user;
  public appPages = [
    { title: 'Tus coches', url: '/folder/Inbox', icon: 'car-sport' },
  ];
  /* public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders']; */
  constructor(
    private platform: Platform,
    private authService: AuthenticationService,
    private router: Router,
    private fcmService: FcmService

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.fcmService.initPush();
    });
  }

  async ngOnInit() {

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener(
      'registration',
      (token: PushNotificationToken) => {
        /* alert('Push registration success, token: ' + token.value); */
      },
    );

    PushNotifications.addListener('registrationError', (error: any) => {
      /*     alert('Error on registration: ' + JSON.stringify(error)); */
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotification) => {
        /* alert('Push received: ' + JSON.stringify(notification));*/
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        /* alert('Push action performed: ' + JSON.stringify(notification)); */
      },
    );
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }

    let token = await Storage.get({ key: TOKEN_KEY });
    this.user = JSON.parse(token.value)
    console.log(this.user.user);
  }

  resetBadgeCount() {
    PushNotifications.removeAllDeliveredNotifications();
  }
  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
