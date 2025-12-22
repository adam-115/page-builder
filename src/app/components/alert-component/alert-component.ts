import { AlertConfig } from './../../../appTypes';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

export type AlertType = 'error' | 'warning' | 'info' | 'success' | 'confirm';

@Component({
  selector: 'app-alert-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alert-component.html',
  styleUrl: './alert-component.css',
})
export class AlertComponent {
  @Input()
  isOpen: boolean = false;

  @Input()
  alertConfig: AlertConfig = {
    type: 'error',
    title: 'information',
    message: 'c est un message d information bien fait ',
    confirmText: 'Continuer',
    cancelText: 'Annuler'
  };


  // the number fort identifying the alert instance
  @Output() confirmed = new EventEmitter<number>();
  @Output() cancelled = new EventEmitter<number>();

  close() {
    this.isOpen = false;
    this.cancelled.emit(this.alertConfig.id);
  }

  confirm() {
    this.isOpen = false;
    this.confirmed.emit(this.alertConfig.id);
  }

  // Helper pour les couleurs Tailwind
  getStyles() {
    switch (this.alertConfig.type) {
      case 'error': return { iconBg: 'bg-red-100', iconColor: 'text-red-600', btn: 'bg-red-600 hover:bg-red-700' };
      case 'warning': return { iconBg: 'bg-amber-100', iconColor: 'text-amber-600', btn: 'bg-amber-600 hover:bg-amber-700' };
      case 'success': return { iconBg: 'bg-green-100', iconColor: 'text-green-600', btn: 'bg-green-600 hover:bg-green-700' };
      default: return { iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', btn: 'bg-indigo-600 hover:bg-indigo-700' };
    }
  }

}
