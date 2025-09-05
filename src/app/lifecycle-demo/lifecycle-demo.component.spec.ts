import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LifecycleDemoComponent } from './lifecycle-demo.component';

describe('LifecycleDemoComponent', () => {
  let consoleSpy: jasmine.Spy;

  beforeEach(async () => {
    consoleSpy = spyOn(console, 'log');
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

  it('should log ngOnInit on initialization', () => {
    const fixture = TestBed.createComponent(LifecycleDemoComponent);
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledWith('LifecycleDemoComponent ngOnInit');
  });

  it('should log ngOnChanges when inputValue changes', () => {
    const fixture = TestBed.createComponent(LifecycleDemoComponent);
    fixture.detectChanges();
    consoleSpy.calls.reset();
    const component = fixture.componentInstance;
    component.inputValue = 'test';
    fixture.detectChanges();
    expect(consoleSpy).toHaveBeenCalledWith('LifecycleDemoComponent ngOnChanges', jasmine.any(Object));
  });

  it('should log ngOnDestroy when destroyed', () => {
    const fixture = TestBed.createComponent(LifecycleDemoComponent);
    fixture.detectChanges();
    consoleSpy.calls.reset();
    fixture.destroy();
    expect(consoleSpy).toHaveBeenCalledWith('LifecycleDemoComponent ngOnDestroy');
  });
});
