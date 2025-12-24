import { Component, signal } from '@angular/core';
import { AmlDynamicFormComponent } from "./components/aml-dynamic-form-component/aml-dynamic-form-component";
import { AmlFormConfig } from "./components/aml-form-config/aml-form-config";
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from "./components/notification-component/notification-component";

@Component({
  selector: 'app-root',
  imports: [AmlFormConfig, AmlDynamicFormComponent, RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('page-builder');
}
