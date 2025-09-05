import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LifecycleDemoComponent } from './lifecycle-demo.component';

describe('LifecycleDemoComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifecycleDemoComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LifecycleDemoComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
