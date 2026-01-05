import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AmlFormConfig } from '../../../appTypes';
import { AmlFormConfigService } from '../../services/AmlFormConfigService';
import { NavigationService } from '../../services/navigation-service';

@Component({
  selector: 'app-aml-form-list-component',
  imports: [CommonModule],
  templateUrl: './aml-form-list-component.html',
  styleUrl: './aml-form-list-component.css',
})
export class AmlFormListComponent implements OnInit {
  amlFormConfigService = inject(AmlFormConfigService);
  navigateService = inject(NavigationService);

  // Simulation de données provenant d'un service
  AmlFormConfigs: AmlFormConfig[] = [];


  ngOnInit(): void {
    this.loadFormsConfig();
  }


  loadFormsConfig(): void {
    this.amlFormConfigService.getAll().subscribe(data => {
      this.AmlFormConfigs = data;
    })
  }



  editForm(form: AmlFormConfig) {
    if (form.id) {
      this.navigateService.navigateToEditFormConfig(form.id);
    }
  }


  createNewForm() {
    this.navigateService.navigateToNewFormConfig();
  }

  viewTheForm(page: AmlFormConfig) {
    if (page.id) {
      this.navigateService.navigateToViewFormConfig(page.id);
    }
  }


}
