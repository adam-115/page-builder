import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AmlFormConfig, AmlFormResult, AmlInputConfig } from '../../../appTypes';
import { AmlFormResultService } from '../../services/aml-form-result-result-service';
import { AmlFormConfigService } from '../../services/AmlFormConfigService';

@Component({
  selector: 'app-aml-form-result',
  imports: [CommonModule],
  templateUrl: './aml-form-result.component.html',
  styleUrl: './aml-form-result.component.css',
})
export class AmlFormResultComponent implements OnInit {
  amlFormResult!: AmlFormResult;
  amlFormConfig!: AmlFormConfig;

  activatedRoute = inject(ActivatedRoute);
  amlPageConfigResultService = inject(AmlFormResultService);
  PageConfigService = inject(AmlFormConfigService);


  constructor() { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get("id");
      this.amlPageConfigResultService.findById(id!).subscribe(data => {
        this.amlFormResult = data;
        this.loadPageConfig(data.amlFormConfigID!);
      });
    });
  }

  private loadPageConfig(pageConfigId: number): void {
    // Load the page config if needed
    this.PageConfigService.findById(pageConfigId).subscribe(data => {
      this.amlFormConfig = data;
    });

  }


  // Récupère la configuration d'un champ à partir de son ID technique
  getFieldConfig(configId: string): AmlInputConfig | undefined {
    return this.amlFormConfig.inputConfigs.find(c => c.id === configId);
  }

  // Groupe les valeurs par ID (utile pour les Checkboxes qui ont plusieurs entrées)
  getUniqueFieldIds(): string[] {
    const ids = this.amlFormResult.AmlPageConfigValues?.map(v => v.InputConfigID) || [];
    return [...new Set(ids)];
  }

  // Récupère toutes les valeurs pour un champ donné (ex: ["Value1", "Value2"])
  getValuesForField(configId: string): string[] {
    return this.amlFormResult.AmlPageConfigValues
      ?.filter(v => v.InputConfigID === configId)
      .map(v => v.value) || [];
  }

  // Style dynamique pour le niveau de risque
  getRiskStyles() {
    const level = this.amlFormResult.riskLevel;
    if (level === 'Faible') return 'bg-green-100 text-green-700 border-green-200';
    if (level === 'Modéré') return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  }

  getOptionScore(configId: string, value: string): number {
    const fieldConfig = this.getFieldConfig(configId);
    if (!fieldConfig || !fieldConfig.options) return 0;
    const option = fieldConfig.options.find(opt => opt.value === value);
    return option ? option.score * fieldConfig.facteur : 0;
  }

}
