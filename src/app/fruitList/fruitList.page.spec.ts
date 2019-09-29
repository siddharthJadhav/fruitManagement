import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FruitListPage } from './fruitList.page';

describe('FruitListPage', () => {
  let component: FruitListPage;
  let fixture: ComponentFixture<FruitListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FruitListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FruitListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
