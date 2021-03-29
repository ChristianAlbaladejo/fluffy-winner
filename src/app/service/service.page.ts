import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service'
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
  providers: [ApiService]
})
export class ServicePage implements OnInit {
  @Input() service: object;
  @Input() mechanic: any;
  data;
  logo;
  constructor(public modalCtrl: ModalController, private apiService: ApiService, private loadingController: LoadingController, private alertController: AlertController, private authService: AuthenticationService, private router: Router) { }

  async ngOnInit() {
    console.log(this.service)
    console.log(this.mechanic)
    const loading = await this.loadingController.create();
    await loading.present();
    (await this.apiService.getUser(this.mechanic.user)).subscribe(
      async (res) => {
        await loading.dismiss();
        console.log(res)
        this.logo = res.logo
      },
      async (error) => {
        if (error.status == 401) {
          this.logout()
        }
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Parece que tenemos problemas',
          buttons: ['OK'],
        });
        await loading.dismiss();
        await alert.present();
      }
    );
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
