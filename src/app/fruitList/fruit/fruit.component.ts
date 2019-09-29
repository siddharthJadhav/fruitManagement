import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Fruit } from '../fruitList.model';
import { SqlLiteService } from '../sql-lite.service';
import { ConfigService } from '../../config.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-fruit',
  templateUrl: './fruit.component.html',
  styleUrls: ['./fruit.component.scss'],
})
export class FruitComponent {

  @Input() fruit: Fruit;
  @Input() isAdd: boolean;
  @Output() addedFruit: EventEmitter<Fruit> = new EventEmitter();
  @Output() removeform: EventEmitter<number> = new EventEmitter();

  fruitPreviousValue: Fruit;

  isEdit: boolean;

  constructor(
    private sqlServ: SqlLiteService,
    private config: ConfigService,
    private alert: AlertController
  ) { }

  /**
   * Added fruit info
   *
   * @param {Fruit} fruit fruit info object
   * @memberof FruitComponent
   */
  addFruit(fruit: Fruit): void {
    this.sqlServ.addFruitInfo(fruit).subscribe((fruitObj: Fruit) => {
      this.config.showToast('success', 'Fruit info added successfully.');
      this.addedFruit.emit(fruitObj);
    }, error => {
      console.log('error in geting fruit list: ', error);
      this.config.showToast('error', 'Error in creating fruit');
    });
  }

  /**
   * Cancel fruit info changes
   *
   * @memberof FruitComponent
   */
  cancel(): void {
    if (this.isEdit) {
      this.fruit = this.fruitPreviousValue;
      this.isEdit = false;
    } else {
      this.isAdd = false;
      this.removeform.emit();
    }
  }

  /**
   * Update fruit info
   *
   * @param {Fruit} fruit fruit info object
   * @memberof FruitComponent
   */
  updateFruit(fruit: Fruit): void {
    this.sqlServ.updateFruitInfo(fruit).subscribe(() => {
      this.isEdit = false;
      this.config.showToast('success', 'Fruit info updated successfully.');
    }, error => {
      console.log(error);
      this.config.showToast('error', 'Error in updating fruit info');
    });
  }

  /**
   * Delete fruit info
   *
   * @param {Fruit} fruit fruit info object
   * @memberof FruitComponent
   */
  deleteFruit(fruit: Fruit): void {
    this.sqlServ.deleteFruitInfo(fruit.id).subscribe((id: number) => {
      this.removeform.emit(id);
      this.config.showToast('success', 'Fruit info delete successfully.');
    }, error => {
      console.log(error);
      this.config.showToast('error', 'Error in delete fruit');
    });
  }

  /**
   * Edit fruit info
   *
   * @param {Fruit} fruit fruit info object
   * @memberof FruitComponent
   */
  editFruit(fruit: Fruit): void {
    this.fruitPreviousValue = JSON.parse(JSON.stringify(fruit));
    this.isEdit = true;
  }

  /**
   * Open conformation box
   *
   * @param {Fruit} fruit Fruit info
   * @returns {Promise<void>}  return promise
   * @memberof FruitComponent
   */
  async openConformationBox(fruit: Fruit): Promise<void> {
    const alert = await this.alert.create({
      message: `Are you sure you want to delete <strong>${fruit.name}</strong>?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteFruit(fruit);
          }
        }
      ]
    });

    await alert.present();
  }

}
