import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategoryAdminComponent } from './product-category-admin.component';

describe('ProductCategoryAdminComponent', () => {
  let component: ProductCategoryAdminComponent;
  let fixture: ComponentFixture<ProductCategoryAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCategoryAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCategoryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
