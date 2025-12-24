import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification, NotificationType } from '../../appTypes';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private currentId = 0;

  get notifications$() {
    return this.notificationSubject.asObservable();
  }

  show(message: string, type: NotificationType = 'info', duration: number = 5000) {
    const id = ++this.currentId;
    const notification: Notification = { id, message, type, duration };
    this.notificationSubject.next(notification);
    return id;
  }

  info(message: string, duration: number = 3000) {
    return this.show(message, 'info', duration);
  }

  success(message: string, duration: number = 3000) {
    return this.show(message, 'success', duration);
  }

  warning(message: string, duration: number = 5000) {
    return this.show(message, 'warning', duration);
  }

  error(message: string, duration: number = 7000) {
    return this.show(message, 'error', duration);
  }

}
