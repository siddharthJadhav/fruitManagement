import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Fruit } from './fruitList.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class SqlLiteService {

  private fruitList: Fruit[] = [];
  private databaseConfig = {
    name: 'fruit.db',
    location: 'default'
  };
  private dbConnection: SQLiteObject;

  private dbConnectionSource = new BehaviorSubject<boolean>(false);
  dbConnectionInit = this.dbConnectionSource.asObservable();

  constructor(
    private sqlite: SQLite,
    private config: ConfigService
  ) {
    // this.createDataBaseConnection();
  }

  /**
   * Established database connection
   *
   * @memberof SqlLiteService
   */
  createDataBaseConnection(): void {
    this.sqlite.create(this.databaseConfig).then((db: SQLiteObject) => {
      console.log('database connection successfull');
      this.dbConnection = db;
      this.createFruitTable();
    }).catch(erorr => {
      console.log('Error in connecting database', erorr);
      this.config.showToast('error', 'Error in connecting database');
    });
  }

  /**
   * Create Fruit table in database
   *
   * @memberof SqlLiteService
   */
  createFruitTable(): void {
    const query = 'CREATE TABLE IF NOT EXISTS fruit(id INTEGER PRIMARY KEY, name TEXT, price INT)';
    this.dbConnection.executeSql(query, [])
      .then(res => {
        console.log('Executed SQL');
        this.dbConnectionSource.next(true);
      })
      .catch(e => {
        console.log(e);
        this.config.showToast('error', 'Error in creating table');
      });
  }

  /**
   * Get Fruit List
   *
   * @returns {BehaviorSubject<Fruit[]>} Its return observable which return fruit list
   * @memberof SqlLiteService
   */
  getFruitList(): BehaviorSubject<Fruit[]> {
    const observable = Observable.create(observer => {
      const query = 'SELECT * FROM fruit ORDER BY rowid DESC';
      this.dbConnection.executeSql(query, [])
        .then(res => {
          this.fruitList = [];
          for (let i = 0; i < res.rows.length; i++) {
            this.fruitList.push({ id: res.rows.item(i).id, name: res.rows.item(i).name, price: res.rows.item(i).price });
          }
          observer.next(this.fruitList);
        })
        .catch(e => {
          observer.error(e);
        });
    });
    return observable;
  }

  /**
   * Add fruit info
   *
   * @param {Fruit} fruit Fruit object which we want to add
   * @returns {BehaviorSubject<Fruit[]>} Its return observable which return fruit list
   * @memberof SqlLiteService
   */
  addFruitInfo(fruit: Fruit): BehaviorSubject<Fruit> {
    const observable = Observable.create(observer => {
      const query = 'INSERT INTO fruit VALUES(null,?,?)';
      this.dbConnection.executeSql(query, [fruit.name, fruit.price])
        .then((res: { insertId: number }) => {
          console.log(res);
          fruit.id = res.insertId;
          observer.next(fruit);
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
    return observable;
  }

  /**
   *  Update fruit information
   *
   * @param {Fruit} fruit Fruit information
   * @returns {BehaviorSubject<Fruit>} Its return observable which return fruit
   * @memberof SqlLiteService
   */
  updateFruitInfo(fruit: Fruit): BehaviorSubject<Fruit> {
    const observable = Observable.create(observer => {
      this.dbConnection.executeSql('UPDATE fruit SET name=?,price=? WHERE id=?', [fruit.name, fruit.price, fruit.id])
        .then(res => {
          console.log('fruit info update successfully', res);
          observer.next(fruit);
        })
        .catch(e => {
          observer.error(null);
          console.log(e);
        });
    });
    return observable;
  }

  /**
   * Delete fruit info
   *
   * @param {number} id Fruit id which we want to delete
   * @returns {BehaviorSubject<number>} Its return observable which return fruits id
   * @memberof SqlLiteService
   */
  deleteFruitInfo(id: number): BehaviorSubject<number> {
    const observable = Observable.create(observer => {
      this.dbConnection.executeSql('DELETE FROM fruit WHERE id=?', [id])
        .then(res => {
          console.log(res);
          observer.next(id);
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
    return observable;
  }

}
