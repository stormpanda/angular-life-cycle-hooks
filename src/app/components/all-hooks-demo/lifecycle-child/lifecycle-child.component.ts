import { CommonModule } from '@angular/common';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-lifecycle-child',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="child-component">
      <div class="child-header">
        <h4>Child Component</h4>
        <span class="lifecycle-indicator">All Hooks Active</span>
      </div>

      <div class="child-content">
        <div class="data-display">
          <p>
            <strong>Received Message:</strong>
            {{ data?.message || 'No message' }}
          </p>
          <p><strong>Received Count:</strong> {{ data?.count || 0 }}</p>
          <p><strong>Internal Counter:</strong> {{ internalCounter }}</p>
        </div>

        <div class="view-child-demo">
          <div #childViewElement class="view-element">
            ViewChild Element - Content: {{ viewElementContent }}
          </div>
        </div>

        <div class="projected-content">
          <h5>Content Projection Area:</h5>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .child-component {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 1rem 0;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }

      .child-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h4 {
          margin: 0;
          font-size: 1.2rem;
        }

        .lifecycle-indicator {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
      }

      .child-content {
        display: grid;
        gap: 1rem;
      }

      .data-display {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;

        p {
          margin: 0.5rem 0;

          strong {
            color: rgba(255, 255, 255, 0.9);
          }
        }
      }

      .view-child-demo {
        .view-element {
          background: rgba(255, 255, 255, 0.15);
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          font-style: italic;
        }
      }

      .projected-content {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 1rem;

        h5 {
          margin: 0 0 0.5rem 0;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    `,
  ],
})
export class LifecycleChildComponent
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
  @Input() data: { message: string; count: number } | null = null;
  @ViewChild('childViewElement') childViewElement!: ElementRef;

  internalCounter = 0;
  viewElementContent = 'Waiting for ViewInit...';

  private timer?: ReturnType<typeof setInterval>;
  private lastDataState = '';

  constructor(private logger: LoggerService) {
    this.logger.log('LifecycleChildComponent', 'Constructor called');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.logger.log('LifecycleChildComponent', 'ngOnChanges called', changes);

    if (changes['data']) {
      const change = changes['data'];
      this.logger.log(
        'LifecycleChildComponent',
        `Data input changed from ${JSON.stringify(
          change.previousValue
        )} to ${JSON.stringify(change.currentValue)}`
      );
    }
  }

  ngOnInit(): void {
    this.logger.log('LifecycleChildComponent', 'ngOnInit called');
    this.startInternalTimer();
    this.lastDataState = JSON.stringify(this.data);
  }

  ngDoCheck(): void {
    const currentDataState = JSON.stringify(this.data);
    if (currentDataState !== this.lastDataState) {
      this.logger.log(
        'LifecycleChildComponent',
        `ngDoCheck detected data change: ${currentDataState}`
      );
      this.lastDataState = currentDataState;
    }
  }

  ngAfterContentInit(): void {
    this.logger.log(
      'LifecycleChildComponent',
      'ngAfterContentInit called - projected content initialized'
    );
  }

  ngAfterContentChecked(): void {
    // Log occasionally to avoid spam
    if (this.internalCounter % 20 === 0) {
      this.logger.log(
        'LifecycleChildComponent',
        'ngAfterContentChecked called (logged every 20 cycles)'
      );
    }
  }

  ngAfterViewInit(): void {
    this.logger.log('LifecycleChildComponent', 'ngAfterViewInit called');

    if (this.childViewElement) {
      this.viewElementContent = `Initialized at ${new Date().toLocaleTimeString()}`;
      this.logger.log(
        'LifecycleChildComponent',
        'ViewChild element accessed and updated'
      );
    }
  }

  ngAfterViewChecked(): void {
    // Log occasionally to avoid spam
    if (this.internalCounter % 25 === 0) {
      this.logger.log(
        'LifecycleChildComponent',
        'ngAfterViewChecked called (logged every 25 cycles)'
      );
    }
  }

  ngOnDestroy(): void {
    this.logger.log('LifecycleChildComponent', 'ngOnDestroy called');
    this.stopInternalTimer();
  }

  private startInternalTimer(): void {
    this.timer = setInterval(() => {
      this.internalCounter++;
    }, 1500);
    this.logger.log('LifecycleChildComponent', 'Internal timer started');
  }

  private stopInternalTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
      this.logger.log('LifecycleChildComponent', 'Internal timer stopped');
    }
  }
}
