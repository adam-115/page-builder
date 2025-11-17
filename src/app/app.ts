import { Component, signal } from '@angular/core';
import { PageBuilderDisplay } from "./page-builder-display/page-builder-display";
import { PageViewer } from "./page-viewer/page-viewer";

@Component({
  selector: 'app-root',
  imports: [PageBuilderDisplay, PageViewer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('page-builder');
}
