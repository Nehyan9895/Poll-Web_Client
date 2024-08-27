import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePollModalComponent } from './create-poll-modal.component';

describe('CreatePollModalComponent', () => {
  let component: CreatePollModalComponent;
  let fixture: ComponentFixture<CreatePollModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePollModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatePollModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
