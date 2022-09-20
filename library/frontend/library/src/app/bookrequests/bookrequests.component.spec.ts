import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookrequestsComponent } from './bookrequests.component';

describe('BookrequestsComponent', () => {
  let component: BookrequestsComponent;
  let fixture: ComponentFixture<BookrequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookrequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookrequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
