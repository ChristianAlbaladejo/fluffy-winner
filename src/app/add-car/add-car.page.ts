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
  public marca;
  public motor 
  public num_bastidor
  public kilometros 
  public fecha_compra
  public list;
  public itemlist;
  public isList = false;
  public models; 
  public showModel = false;

  constructor(public modalCtrl: ModalController, private apiService: ApiService, private loadingController: LoadingController, private alertController: AlertController, private authService: AuthenticationService, private router: Router,
    public http: HttpClient) { }

  async ngOnInit() {
    const loading = await this.loadingController.create();
    this.fecha_compra = new Date().toJSON().split('T')[0];
    (await this.apiService.getListCar()).subscribe(
      async (res) => {
        this.list = res[0].list;
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

  getBrand(ev: any) {
    // set val to the value of the searchbar
    const val = ev.target.value;
    console.log(val)
    // if the value is an empty string don't filter the items
    if (val) {
      this.itemlist = this.list;
      this.isList = true;
      this.showModel = true;
      this.itemlist = this.itemlist.filter((item) => {
        return (item.brand.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.isList = false;
    }
  }

  selectBrand(item) {
    this.models = item.models;
    this.marca = item.brand
    this.isList = false;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}
