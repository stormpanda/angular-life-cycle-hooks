import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';
import { LifecycleChildComponent } from './lifecycle-child/lifecycle-child.component';

@Component({
  selector: 'app-all-hooks-demo',
  standalone: true,
  imports: [CommonModule, FormsModule, LifecycleChildComponent],
  templateUrl: './all-hooks-demo.component.html',
  styleUrl: './all-hooks-demo.component.scss',
  providers: [LoggerService],
})
export class AllHooksDemoComponent
  implements
    OnChanges,
    OnInit,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy
{
  @ViewChild('viewChildElement') viewChildElement!: ElementRef;
  @ContentChild('projectedContent') projectedContent!: TemplateRef<any>;

  // Component state
  inputValue = 'Initial Value';
  counter = 0;
  showChild = true;
  childData = { message: 'Hello Child', count: 0 };

  // DoCheck tracking
  private lastInputValue = '';
  private lastChildData = '';

  // Timer
  private timer?: ReturnType<typeof setInterval>;

  constructor(public logger: LoggerService) {
    this.logger.log('AllHooksDemoComponent', 'Constructor called');
  }

  // Lifecycle Hooks Implementation
  ngOnChanges(changes: SimpleChanges): void {
    this.logger.log('AllHooksDemoComponent', 'ngOnChanges called', changes);
  }

  ngOnInit(): void {
    this.logger.log('AllHooksDemoComponent', 'ngOnInit called');
    this.startTimer();
    this.lastInputValue = this.inputValue;
    this.lastChildData = JSON.stringify(this.childData);
  }

  ngDoCheck(): void {
    // Only log if there's an actual change to avoid too much noise
    const currentInputValue = this.inputValue;
    const currentChildData = JSON.stringify(this.childData);

    if (
      currentInputValue !== this.lastInputValue ||
      currentChildData !== this.lastChildData
    ) {
      this.logger.log(
        'AllHooksDemoComponent',
        `ngDoCheck detected changes - Input: "${currentInputValue}", Child Data: ${currentChildData}`
      );
      this.lastInputValue = currentInputValue;
      this.lastChildData = currentChildData;
    }
  }

  ngAfterContentInit(): void {
    this.logger.log('AllHooksDemoComponent', 'ngAfterContentInit called');
    if (this.projectedContent) {
      this.logger.log(
        'AllHooksDemoComponent',
        'Projected content is available'
      );
    }
  }

  ngAfterContentChecked(): void {
    // Only log occasionally to avoid spam
    if (this.counter % 10 === 0) {
      this.logger.log(
        'AllHooksDemoComponent',
        'ngAfterContentChecked called (logged every 10 cycles)'
      );
    }
  }

  ngAfterViewInit(): void {
    this.logger.log('AllHooksDemoComponent', 'ngAfterViewInit called');
    if (this.viewChildElement) {
      this.logger.log(
        'AllHooksDemoComponent',
        'ViewChild element is available',
        {
          elementType: this.viewChildElement.nativeElement.tagName,
          textContent: this.viewChildElement.nativeElement.textContent,
        }
      );
    }
  }

  ngAfterViewChecked(): void {
    // Only log occasionally to avoid spam
    if (this.counter % 15 === 0) {
      this.logger.log(
        'AllHooksDemoComponent',
        'ngAfterViewChecked called (logged every 15 cycles)'
      );
    }
  }

  ngOnDestroy(): void {
    this.logger.log('AllHooksDemoComponent', 'ngOnDestroy called');
    this.stopTimer();
  }

  // Helper methods
  private startTimer(): void {
    this.timer = setInterval(() => {
      this.counter++;
    }, 1000);
    this.logger.log('AllHooksDemoComponent', 'Timer started');
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      this.logger.log('AllHooksDemoComponent', 'Timer stopped');
    }
  }

  // User interactions
  updateInput(value: string): void {
    this.inputValue = value;
    this.logger.log('AllHooksDemoComponent', `Input updated to: "${value}"`);
  }

  updateChildMessage(message: string): void {
    this.childData = { ...this.childData, message };
    this.logger.log(
      'AllHooksDemoComponent',
      `Child message updated to: "${message}"`
    );
  }

  incrementChildCount(): void {
    this.childData = { ...this.childData, count: this.childData.count + 1 };
    this.logger.log(
      'AllHooksDemoComponent',
      `Child count incremented to: ${this.childData.count}`
    );
  }

  toggleChild(): void {
    this.showChild = !this.showChild;
    this.logger.log(
      'AllHooksDemoComponent',
      `Child visibility toggled: ${this.showChild}`
    );
  }

  triggerChangeDetection(): void {
    // This will trigger ngDoCheck and other checking hooks
    this.logger.log(
      'AllHooksDemoComponent',
      'Manually triggering change detection'
    );
  }

  resetDemo(): void {
    this.inputValue = 'Initial Value';
    this.counter = 0;
    this.childData = { message: 'Hello Child', count: 0 };
    this.showChild = true;
    this.logger.clear();
    this.logger.log('AllHooksDemoComponent', 'Demo reset');
  }

  trackByTimestamp(index: number, item: any): any {
    return item.timestamp;
  }
}
