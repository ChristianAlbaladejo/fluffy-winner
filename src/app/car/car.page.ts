import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service'
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ServicePage } from '../service/service.page';

@Component({
  selector: 'app-car',
  templateUrl: './car.page.html',
  styleUrls: ['./car.page.scss'],
  providers: [ApiService]
})
export class CarPage implements OnInit {
  @Input() id: string;
  data;
  km;
  constructor(public modalCtrl: ModalController, private apiService: ApiService, private loadingController: LoadingController, private alertController: AlertController, private authService: AuthenticationService, private router: Router) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    await loading.present();
     (await this.apiService.getCar(this.id)).subscribe(
        async (res) => {
          this.data = res
        this.km = this.data.kilometros
         this.data.operations.reverse()
         this.data.service.reverse()
          console.log(this.data)
        await loading.dismiss();
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

  async refreshKm(){
    if (this.km >= this.data.kilometros) {
      this.data.kilometros = this.km;
    const loading = await this.loadingController.create();
    await loading.present();
    (await this.apiService.updateCar(this.data)).subscribe(
      async (res) => {
        console.log(this.data)
        await loading.dismiss();
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
    }else{
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Los kilómetros no son válidos',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Eliminar coche',
      message: '¿Seguro que desea eliminar este coche?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.deleteCar()
            this.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteCar() {
    const loading = await this.loadingController.create();
    await loading.present();
    (await this.apiService.deleteCar(this.data.id)).subscribe(
      async (res) => {
        await loading.dismiss();
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

  async presentModal(id) {
    const modal = await this.modalCtrl.create({
      component: ServicePage,
      componentProps: {
        'service': id,
      }
    });
    return await modal.present();
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
