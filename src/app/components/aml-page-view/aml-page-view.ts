import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AmlPageConfig, InputTypeConfig } from '../../../appTypes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aml-page-view',
  imports: [CommonModule],
  templateUrl: './aml-page-view.html',
  styleUrl: './aml-page-view.css',
})
export class AmlPageView {

  @Input() isOpen: boolean = true;
  @Input() amlPageConfig: AmlPageConfig | null = null;
  @Output() close = new EventEmitter<void>();

  // Simulation d'une action de soumission pour la prévisualisation
  handlePreviewSubmit() {
    alert("Ceci est une prévisualisation. Dans l'application réelle, cela soumettrait les données.");
  }


  onClose() {
    this.close.emit();
  }






}
