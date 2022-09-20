import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopthreeComponent } from './topthree.component';

describe('TopthreeComponent', () => {
  let component: TopthreeComponent;
  let fixture: ComponentFixture<TopthreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopthreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopthreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
