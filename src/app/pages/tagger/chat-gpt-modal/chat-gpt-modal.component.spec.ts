import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGptModalComponent } from './chat-gpt-modal.component';

describe('ChatGptModalComponent', () => {
  let component: ChatGptModalComponent;
  let fixture: ComponentFixture<ChatGptModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatGptModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatGptModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
