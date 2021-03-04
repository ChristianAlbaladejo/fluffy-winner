import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../services/api.service'
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Plugins } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { AddCarPage } from '../add-car/add-car.page';
import { CarPage } from '../car/car.page';

const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
const USER = '';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  providers: [ApiService]
})
export class FolderPage implements OnInit {
  public folder: string;
  public data;
  constructor(private activatedRoute: ActivatedRoute, private loadingController: LoadingController, private alertController: AlertController, private apiService: ApiService, private router: Router, private authService: AuthenticationService,
    public modalController: ModalController) { }

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    const loading = await this.loadingController.create();
    let token = await Storage.get({ key: TOKEN_KEY });
    let tokenvalue = JSON.parse(token.value)
    console.log(JSON.stringify(tokenvalue.user))
    await loading.present();
    (await this.apiService.getUserData(tokenvalue.user.id)).subscribe(
        async (res) => {
          this.data = res
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

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddCarPage,
    });
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }

  async presentModalCar(id) {
    const modal = await this.modalController.create({
      component: CarPage,
      componentProps: {
      'id': id,
    }
    });
    modal.onDidDismiss().then((data) => {
      this.ngOnInit();
    });
    return await modal.present();
  }


  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
