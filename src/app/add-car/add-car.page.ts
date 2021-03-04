import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service'
import { Plugins } from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
const USER = '';
@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.page.html',
  styleUrls: ['./add-car.page.scss'],
  providers: [ApiService]
})
export class AddCarPage implements OnInit {

  public matricula
  public modelo 
  public motor 
  public num_bastidor
  public kilometros 
  public fecha_compra

  constructor(public modalCtrl: ModalController, private apiService: ApiService, private loadingController: LoadingController, private alertController: AlertController, private authService: AuthenticationService, private router: Router,
    public http: HttpClient) { }

  ngOnInit() {
    this.fecha_compra = new Date().toJSON().split('T')[0];
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async addCar() {
    const loading = await this.loadingController.create();
    let token = await Storage.get({ key: TOKEN_KEY });
    let tokenvalue = JSON.parse(token.value)
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    let car = {
      "matricula": this.matricula,
      "modelo": this.modelo,
      "Motor": this.motor,
      "num_bastidor": this.num_bastidor,
      "fecha_compra": this.fecha_compra.toString().slice(0, 10),
      "fecha_alta": yyyy + '-' + mm + '-' + dd,
      "kilometros": this.kilometros.toString(),
      "activo": true,
      "users_permissions_user": tokenvalue.user.id.toString(),
      "service": [],
      "operations": [],
      "published_at": today.toISOString().toString(),
      "created_by": tokenvalue.user.id.toString(),
      "updated_by": tokenvalue.user.id.toString()
    } 

    console.log(car)
    await loading.present();
    (await this.apiService.addCar(car)).subscribe(
      async (res) => {
        this.dismiss();
        await loading.dismiss();
      },
      async (error) => {
        if (error.status == 401) {
          this.logout()
        }
        console.log(error)
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

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
