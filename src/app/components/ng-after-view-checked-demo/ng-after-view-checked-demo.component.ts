import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-ng-after-view-checked-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <div class="demo-header">
        <h1>ngAfterViewChecked Demo</h1>
        <p>Demonstrates view change detection and DOM monitoring</p>
      </div>

      <div class="demo-content">
        <div class="chat-simulation-section">
          <h3>Auto-Scrolling Chat Example</h3>
          <div class="chat-container" #chatContainer>
            <div class="messages" #messagesList>
              <div
                *ngFor="let message of messages; let i = index"
                class="message"
                [class.own]="message.isOwnMessage"
              >
                <div class="message-header">
                  <span class="sender">{{ message.sender }}</span>
                  <span class="timestamp">{{
                    message.timestamp | date : 'HH:mm:ss'
                  }}</span>
                </div>
                <div class="message-content">{{ message.content }}</div>
              </div>
            </div>

            <div class="input-area">
              <input
                #messageInput
                [(ngModel)]="newMessage"
                (keyup.enter)="sendMessage()"
                placeholder="Type a message..."
                maxlength="200"
              />
              <button (click)="sendMessage()" [disabled]="!newMessage.trim()">
                Send
              </button>
              <button (click)="simulateIncomingMessage()">
                Simulate Incoming
              </button>
            </div>
          </div>

          <div class="chat-controls">
            <button
              (click)="startAutoMessages()"
              [disabled]="autoMessagesInterval"
            >
              Start Auto Messages
            </button>
            <button
              (click)="stopAutoMessages()"
              [disabled]="!autoMessagesInterval"
            >
              Stop Auto Messages
            </button>
            <button (click)="clearMessages()">Clear Chat</button>
          </div>
        </div>

        <div class="scroll-monitoring-section">
          <h3>Scroll Position Monitoring</h3>
          <div class="scroll-stats">
            <div class="stat-item">
              <span class="stat-label">Scroll Height:</span>
              <span class="stat-value">{{ scrollHeight }}px</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Client Height:</span>
              <span class="stat-value">{{ clientHeight }}px</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Scroll Top:</span>
              <span class="stat-value">{{ scrollTop }}px</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">At Bottom:</span>
              <span class="stat-value">{{
                isAtBottom ? '✅ Yes' : '❌ No'
              }}</span>
            </div>
          </div>
        </div>

        <div class="view-change-detection-section">
          <h3>View Change Detection</h3>
          <div class="change-triggers">
            <button (click)="addDynamicElement()">Add Dynamic Element</button>
            <button
              (click)="removeDynamicElement()"
              [disabled]="dynamicElements.length === 0"
            >
              Remove Element
            </button>
            <button (click)="resizeContainer()">Resize Container</button>
            <button (click)="toggleElementStyle()">Toggle Styles</button>
          </div>

          <div
            class="dynamic-container"
            #dynamicContainer
            [style.height.px]="containerHeight"
          >
            <div
              *ngFor="let element of dynamicElements; let i = index"
              class="dynamic-element"
              [class.styled]="element.styled"
              [style.backgroundColor]="element.color"
            >
              <span>Element {{ element.id }}</span>
              <small>{{ element.timestamp | date : 'HH:mm:ss.SSS' }}</small>
            </div>
          </div>
        </div>

        <div class="hook-frequency-section">
          <h3>Hook Execution Monitoring</h3>
          <div class="frequency-stats">
            <div class="frequency-item">
              <span class="frequency-label">ViewChecked calls:</span>
              <span class="frequency-value">{{ viewCheckedCount }}</span>
            </div>
            <div class="frequency-item">
              <span class="frequency-label">Last check time:</span>
              <span class="frequency-value">{{
                lastViewCheckTime | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="frequency-item">
              <span class="frequency-label">Scroll changes:</span>
              <span class="frequency-value">{{ scrollChangesCount }}</span>
            </div>
            <div class="frequency-item">
              <span class="frequency-label">Auto-scroll triggered:</span>
              <span class="frequency-value">{{ autoScrollCount }}</span>
            </div>
          </div>

          <div class="performance-note">
            ⚠️ <strong>Performance Impact:</strong> This hook runs very
            frequently. Keep operations lightweight and avoid DOM manipulations
            here.
          </div>
        </div>
      </div>

      <div class="logs-section">
        <h3>Lifecycle Logs (Latest 15)</h3>
        <div class="log-controls">
          <button (click)="logger.clear()">Clear Logs</button>
          <button (click)="toggleDetailedLogging()">
            {{ detailedLogging ? 'Disable' : 'Enable' }} Detailed Logging
          </button>
        </div>
        <div class="logs-container">
          <div class="log-entry" *ngFor="let log of getRecentLogs()">
            <div class="log-header">
              <span class="component-name">{{ log.component }}</span>
              <span class="timestamp">{{
                log.timestamp | date : 'HH:mm:ss.SSS'
              }}</span>
            </div>
            <div class="log-message">{{ log.message }}</div>
          </div>
        </div>
      </div>

      <div class="explanation">
        <h3>ngAfterViewChecked Key Points</h3>
        <div class="key-points">
          <div class="point-item danger">
            <h4>⚠️ Extreme Frequency</h4>
            <p>
              Called after every view and child view check - highest frequency
              hook
            </p>
          </div>
          <div class="point-item warning">
            <h4>🔍 View Monitoring</h4>
            <p>
              Useful for tracking view changes like scroll position, element
              sizes
            </p>
          </div>
          <div class="point-item success">
            <h4>💡 Use Very Sparingly</h4>
            <p>
              Only for critical view synchronization - consider alternatives
              first
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ng-after-view-checked-demo.component.scss',
  providers: [LoggerService],
})
export class NgAfterViewCheckedDemoComponent
  implements AfterViewInit, AfterViewChecked, OnDestroy
{
  @ViewChild('chatContainer') chatContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messagesList') messagesList!: ElementRef<HTMLDivElement>;
  @ViewChild('dynamicContainer') dynamicContainer!: ElementRef<HTMLDivElement>;
  @ViewChildren('.dynamic-element') dynamicElementRefs!: QueryList<ElementRef>;

  messages: Array<{
    id: number;
    sender: string;
    content: string;
    timestamp: Date;
    isOwnMessage: boolean;
  }> = [];

  dynamicElements: Array<{
    id: number;
    timestamp: Date;
    styled: boolean;
    color: string;
  }> = [];

  newMessage = '';
  viewCheckedCount = 0;
  scrollChangesCount = 0;
  autoScrollCount = 0;
  lastViewCheckTime = new Date();
  detailedLogging = false;

  // Scroll monitoring
  scrollHeight = 0;
  clientHeight = 0;
  scrollTop = 0;
  isAtBottom = false;
  previousScrollHeight = 0;

  // Container monitoring
  containerHeight = 200;

  // Auto messages
  autoMessagesInterval?: ReturnType<typeof setInterval>;

  private nextMessageId = 1;
  private nextElementId = 1;
  private readonly sampleMessages = [
    'Hello there!',
    'How are you doing?',
    'This is a test message',
    'Angular lifecycle hooks are interesting',
    'The chat auto-scrolls when new messages arrive',
    'This demonstrates ngAfterViewChecked',
    'Performance monitoring is important',
    'Keep operations lightweight in this hook',
  ];

  constructor(public logger: LoggerService) {
    this.logger.log('NgAfterViewCheckedDemo', 'Constructor called');

    // Add initial messages
    this.addMessage('System', 'Welcome to the chat demo!', false);
    this.addMessage(
      'Assistant',
      'This chat demonstrates auto-scrolling behavior',
      false
    );
  }

  ngAfterViewInit(): void {
    this.logger.log('NgAfterViewCheckedDemo', 'ngAfterViewInit called');
    this.updateScrollMetrics();
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.viewCheckedCount++;
    this.lastViewCheckTime = new Date();

    if (this.messagesList) {
      this.updateScrollMetrics();

      // Check if scroll height changed (new content)
      if (this.scrollHeight !== this.previousScrollHeight) {
        this.scrollChangesCount++;
        this.previousScrollHeight = this.scrollHeight;

        // Auto-scroll to bottom if user was already at bottom
        if (this.wasAtBottomBeforeChange()) {
          this.scrollToBottom();
          this.autoScrollCount++;

          if (this.detailedLogging) {
            this.logger.log(
              'NgAfterViewCheckedDemo',
              `Auto-scrolled to bottom (scroll height: ${this.scrollHeight}px)`
            );
          }
        }
      }
    }

    // Log occasionally to avoid spam
    if (this.viewCheckedCount % 100 === 0 && this.detailedLogging) {
      this.logger.log(
        'NgAfterViewCheckedDemo',
        `Hook called ${this.viewCheckedCount} times (${this.scrollChangesCount} scroll changes)`
      );
    }
  }

  ngOnDestroy(): void {
    this.stopAutoMessages();
  }

  private updateScrollMetrics(): void {
    if (this.messagesList) {
      const element = this.messagesList.nativeElement;
      this.scrollHeight = element.scrollHeight;
      this.clientHeight = element.clientHeight;
      this.scrollTop = element.scrollTop;
      this.isAtBottom =
        Math.abs(this.scrollHeight - this.clientHeight - this.scrollTop) < 5;
    }
  }

  private wasAtBottomBeforeChange(): boolean {
    // Simple heuristic: if user was scrolled near bottom, assume they want to stay at bottom
    return (
      this.isAtBottom ||
      this.scrollHeight - this.clientHeight - this.scrollTop < 50
    );
  }

  private scrollToBottom(): void {
    if (this.messagesList) {
      const element = this.messagesList.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.addMessage('You', this.newMessage.trim(), true);
      this.newMessage = '';

      this.logger.log('NgAfterViewCheckedDemo', 'User message sent');
    }
  }

  simulateIncomingMessage(): void {
    const randomMessage =
      this.sampleMessages[
        Math.floor(Math.random() * this.sampleMessages.length)
      ];
    this.addMessage('Assistant', randomMessage, false);

    this.logger.log('NgAfterViewCheckedDemo', 'Incoming message simulated');
  }

  private addMessage(
    sender: string,
    content: string,
    isOwnMessage: boolean
  ): void {
    const message = {
      id: this.nextMessageId++,
      sender,
      content,
      timestamp: new Date(),
      isOwnMessage,
    };
    this.messages.push(message);
  }

  startAutoMessages(): void {
    this.autoMessagesInterval = setInterval(() => {
      this.simulateIncomingMessage();
    }, 2000);

    this.logger.log(
      'NgAfterViewCheckedDemo',
      'Auto messages started (2s interval)'
    );
  }

  stopAutoMessages(): void {
    if (this.autoMessagesInterval) {
      clearInterval(this.autoMessagesInterval);
      this.autoMessagesInterval = undefined;

      this.logger.log('NgAfterViewCheckedDemo', 'Auto messages stopped');
    }
  }

  clearMessages(): void {
    const count = this.messages.length;
    this.messages = [];
    this.logger.log('NgAfterViewCheckedDemo', `Cleared ${count} messages`);
  }

  addDynamicElement(): void {
    const colors = [
      '#ffcdd2',
      '#f8bbd9',
      '#e1bee7',
      '#d1c4e9',
      '#c5cae9',
      '#bbdefb',
    ];
    const element = {
      id: this.nextElementId++,
      timestamp: new Date(),
      styled: Math.random() > 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    this.dynamicElements.push(element);

    this.logger.log(
      'NgAfterViewCheckedDemo',
      `Added dynamic element ${element.id}`
    );
  }

  removeDynamicElement(): void {
    if (this.dynamicElements.length > 0) {
      const removed = this.dynamicElements.pop();
      this.logger.log(
        'NgAfterViewCheckedDemo',
        `Removed dynamic element ${removed?.id}`
      );
    }
  }

  resizeContainer(): void {
    this.containerHeight = this.containerHeight === 200 ? 300 : 200;
    this.logger.log(
      'NgAfterViewCheckedDemo',
      `Container resized to ${this.containerHeight}px`
    );
  }

  toggleElementStyle(): void {
    this.dynamicElements.forEach((element) => {
      element.styled = !element.styled;
    });
    this.logger.log(
      'NgAfterViewCheckedDemo',
      'Toggled styles for all elements'
    );
  }

  toggleDetailedLogging(): void {
    this.detailedLogging = !this.detailedLogging;
    this.logger.log(
      'NgAfterViewCheckedDemo',
      `Detailed logging ${this.detailedLogging ? 'enabled' : 'disabled'}`
    );
  }

  getRecentLogs() {
    return this.logger.logs.slice(-15);
  }
}
