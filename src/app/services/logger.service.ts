import { Injectable } from '@angular/core';

export interface LogEntry {
  timestamp: Date;
  component: string;
  message: string;
  data?: any;
}

@Injectable()
export class LoggerService {
  private _logs: LogEntry[] = [];

  get logs(): LogEntry[] {
    return this._logs;
  }

  log(component: string, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      component,
      message,
      data,
    };
    this._logs.push(entry);
    console.log(`[${component}] ${message}`, data || '');
  }

  clear(): void {
    this._logs = [];
  }

  getLogsForComponent(component: string): LogEntry[] {
    return this._logs.filter((log) => log.component === component);
  }
}
