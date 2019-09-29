import { Component, OnInit } from '@angular/core';
import { Fruit } from './fruitList.model';
import { SqlLiteService } from './sql-lite.service';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-fruitList',
  templateUrl: 'fruitList.page.html',
  styleUrls: ['fruitList.page.scss'],
})
export class FruitListPage implements OnInit {

  fruitList: Fruit[];
  showAddForm: boolean;
  fruitObj: Fruit;

  constructor(
    private sqlServ: SqlLiteService,
    private config: ConfigService
  ) { }

  ngOnInit(): void {
    this.sqlServ.dbConnectionInit.subscribe((connection: boolean) => {
      if (connection === true) {
        this.getFruitList();
      }
    });
    this.initFruitObj();
  }

  /**
   * Initialize the fruit object
   *
   * @memberof FruitListPage
   */
  initFruitObj(): void {
    this.fruitObj = {
      id: null,
      name: null,
      price: null
    };
  }


  /**
   * Get fruit list
   *
   * @memberof FruitListPage
   */
  getFruitList(): void {
    this.sqlServ.getFruitList().subscribe((fruitList: Fruit[]) => {
      this.fruitList = fruitList;
      console.log('this.fruitList : ', this.fruitList);
    }, error => {
      console.log('error in geting fruit list: ', error);
      this.config.showToast('error', 'Error in getting table list');
    });
  }

  /**
   * Add fruit info into fruit list
   *
   * @param {Fruit} fruit Fruit info
   * @memberof FruitListPage
   */
  addedFruit(fruit: Fruit): void {
    console.log('fruit : ', fruit);
    this.fruitList.unshift(fruit);
    console.log('this.fruitList : ', this.fruitList);
    this.showAddForm = false;
    this.initFruitObj();
  }

  /**
   * Delete fruit in list
   *
   * @param {number} id Fruit id which we want to delete
   * @memberof FruitListPage
   */
  deleteFruit(id: number): void {
    this.fruitList = this.fruitList.filter((fruitObj: Fruit) => {
      return fruitObj.id !== id;
    });
  }

  /**
   * Remove fruit form
   *
   * @param {number} id Fruit id
   * @memberof FruitListPage
   */
  removeform(id: number): void {
    if (id) {
      this.deleteFruit(id);
    } else {
      this.showAddForm = false;
    }
  }

}
