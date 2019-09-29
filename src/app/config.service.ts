import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private toast: ToastController) { }

  /**
   * Showing toast message
   *
   * @param {string} type toast type i.e error or success
   * @param {string} message toast message
   * @memberof ConfigService
   */
  async showToast(type: string, msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 1000,
      color: type === 'error' ? 'danger' : 'success',
      position: 'top'
    });
    toast.present();
  }

}
