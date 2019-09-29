import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FruitListPage } from './fruitList.page';
import { FruitComponent } from './fruit/fruit.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: FruitListPage
      }
    ])
  ],
  declarations: [
    FruitListPage,
    FruitComponent
  ]
})
export class FruitListPageModule {}
