import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmlPageConfig, AmlPageConfigResult, InputTypeConfig } from '../../../appTypes';
import { AmlPageConfigResultService } from './../../services/aml-page-config-result-service';
import { PageConfigService } from './../../services/page-config-service';

@Component({
  selector: 'app-aml-result-page',
  imports: [CommonModule],
  templateUrl: './aml-result-page.component.html',
  styleUrl: './aml-result-page.component.css',
})
export class AmlResultPageComponent implements OnInit {
  amlPageConfigResult!: AmlPageConfigResult;
  pageConfig!: AmlPageConfig;

  activatedRoute = inject(ActivatedRoute);
  amlPageConfigResultService = inject(AmlPageConfigResultService);
  PageConfigService = inject(PageConfigService);


  constructor() { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get("id");
      this.amlPageConfigResultService.findById(id!).subscribe(data => {
        this.amlPageConfigResult = data;
        this.loadPageConfig(data.amlPageConfigID!);
      });
    });
  }

  private loadPageConfig(pageConfigId: number): void {
    // Load the page config if needed
    this.PageConfigService.findById(pageConfigId).subscribe(data => {
      this.pageConfig = data;
    });

  }


  // Récupère la configuration d'un champ à partir de son ID technique
  getFieldConfig(configId: string): InputTypeConfig | undefined {
    return this.pageConfig.formConfig.find(c => c.id === configId);
  }

  // Groupe les valeurs par ID (utile pour les Checkboxes qui ont plusieurs entrées)
  getUniqueFieldIds(): string[] {
    const ids = this.amlPageConfigResult.AmlPageConfigValues?.map(v => v.InputTypeConfigID) || [];
    return [...new Set(ids)];
  }

  // Récupère toutes les valeurs pour un champ donné (ex: ["Value1", "Value2"])
  getValuesForField(configId: string): string[] {
    return this.amlPageConfigResult.AmlPageConfigValues
      ?.filter(v => v.InputTypeConfigID === configId)
      .map(v => v.value) || [];
  }

  // Style dynamique pour le niveau de risque
  getRiskStyles() {
    const level = this.amlPageConfigResult.riskLevel;
    if (level === 'Faible') return 'bg-green-100 text-green-700 border-green-200';
    if (level === 'Modéré') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  }
}
