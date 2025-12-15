import { Component, signal } from '@angular/core';
import { AmlFormConfig } from "./components/aml-form-config/aml-form-config";

@Component({
  selector: 'app-root',
  imports: [ AmlFormConfig],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('page-builder');
}
