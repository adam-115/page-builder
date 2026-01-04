import { AlertService } from './../../services/alert-service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AmlPageConfigValue, InputTypeConfig, Option } from '../../../appTypes';
import { AmlPageConfigValueService } from '../../services/aml-page-config-value-service';
import { AmlPageConfig } from './../../../appTypes';
import { PageConfigService } from './../../services/page-config-service';

// Interface pour le suivi du score par champ (simplifiée pour l'affichage)
interface FieldScore {
  name: string;
  label: string;
  facteur: number;
  scoreObtenu: number;
}

@Component({
  selector: 'app-aml-dynamic-form-component',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './aml-dynamic-form-component.html',
  styleUrl: './aml-dynamic-form-component.css',
})
export class AmlDynamicFormComponent implements OnInit {

  activatedRoute = inject(ActivatedRoute);
  pageConfigService = inject(PageConfigService);
  amlPageConfigValueService = inject(AmlPageConfigValueService);
  alertService = inject(AlertService);
  fb = inject(FormBuilder);
  selectedPageConfig: AmlPageConfig | null = null;
  dynamicForm: FormGroup;
  totalRiskScore: number = 0;
  fieldScores: FieldScore[] = [];
  InpuTypeConfigs: InputTypeConfig[] = [];




  constructor() {
    this.dynamicForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.loadPageConfig();
  }

  private loadPageConfig(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get("id");
      if (id) {
        this.pageConfigService.findById(id).subscribe(data => {
          this.selectedPageConfig = data;
          console.log('data loaded ' + this.selectedPageConfig);
          this.InpuTypeConfigs = this.selectedPageConfig.formConfig;
          // Reconstruire le formulaire dynamique avec la nouvelle configuration
          this.buildDynamicForm();
          this.subscribeToFormChanges();
        })
      }
    });

  }
  // Construction dynamique des FormControls
  private buildDynamicForm(): void {
    this.InpuTypeConfigs.forEach(config => {
      const validators = config.required ? [Validators.required] : [];

      if (config.type === 'uploadFile') {
        this.dynamicForm.addControl(config.name, this.fb.control(null, validators));
      } else if (config.type === 'select') {
        this.dynamicForm.addControl(config.name, this.fb.control(null, validators));
        // Pour les types avec options, on peut ajouter des validateurs spécifiques si nécessaire
      } else if (config.type === 'checkbox') {
        let subFormForSelect = this.fb.group({});
        config.options?.forEach(option => {
          const controlName = option.id || '';
          subFormForSelect.addControl(controlName, this.fb.control(false));
        });
        this.dynamicForm.addControl(config.name, subFormForSelect);

      } else if (config.type === 'radio') {
        this.dynamicForm.addControl(config.name, this.fb.control(
          config.defaultValue || '', // Utilisation de defaultValue s'il est fourni
          validators
        ));
      }
    });
  }

  // Abonnement aux changements pour déclencher le scoring
  private subscribeToFormChanges(): void {
    this.dynamicForm.valueChanges.subscribe(values => {
      this.calculateRiskScore2();
    });
    // Calcul initial
    this.calculateRiskScore2();
  }

  private calculateRiskScore2(): void {
    let score = 0;
    this.InpuTypeConfigs.forEach(config => {
      // case input upload file
      if (config.type === 'uploadFile') {
        let fileName = this.dynamicForm.get(config.name)?.value;
        if (fileName == '' || fileName == null || fileName == undefined) {
          score += (config.score || 0 * config.facteur) || 0;
        }
      }
      // case type select
      if (config.type === 'select') {
        if (this.dynamicForm.get(config.name)?.value != null) {
          let fieldValue: Option = this.dynamicForm.get(config.name)?.value;
          score += (fieldValue.score * config.facteur);
        }
      }
      //case type checkbox
      if (config.type === 'checkbox') {
        let subFormGroup = this.dynamicForm.get(config.name) as FormGroup;
        // alert(JSON.stringify(subFormGroup.value));
        // alert(JSON.stringify(config.options));
        config.options?.forEach(option => {
          let isChecked = subFormGroup.get(option.id || '')?.value;
          if (isChecked) {
            score += (option.score * config.facteur);
          }
        });
      }

      //case radio
      if (config.type === 'radio') {
        let fieldValue = this.dynamicForm.get(config.name)?.value;
        if (fieldValue != null && fieldValue != undefined && fieldValue != '') {
          let selectedOption = config.options?.find(opt => opt.value === fieldValue);
          if (selectedOption) {
            score += (selectedOption.score * config.facteur);
          }
        }
      }
    });
    this.totalRiskScore = score;
  }

  // Méthode utilitaire pour accéder à la configuration
  getFieldConfig(name: string): InputTypeConfig | undefined {
    return this.InpuTypeConfigs.find(c => c.name === name);
  }

  // Gestion de l'upload (met le nom du fichier comme valeur du FormControl)
  handleFileUpload(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.dynamicForm.get(controlName)?.setValue(input.files[0].name);
    } else {
      this.dynamicForm.get(controlName)?.setValue('');
    }
  }

  //compare two option object used in select form
  compareOptionObjects(object1: Option | null, object2: Option | null): boolean {
    // Compare based on a unique identifier (like 'id')
    return object1 && object2 ? object1.id === object2.id : object1 === object2;
  }


  onSubmit(): void {
    if (this.dynamicForm.valid) {

      this.alertService.confirmMessage("Confirmation de soumission", "Êtes-vous sûr de vouloir soumettre le formulaire ?", 'question').then(confirmed => {
        if (confirmed) {
          this.saveFormValues();
        }
      });
    }
  }

  private saveFormValues(): void {
    let error = false;
    //TODO add efter params to identify the user who submit the form
    const amlPageConfigValues = this.convertFomValueToAmlPageConfigValues();
    amlPageConfigValues.forEach(value => {
      this.amlPageConfigValueService.create(value).subscribe({
        next: (response) => {
          // alert('Formulaire soumis avec succès !');
          //TDOO afficher un message de succès et route to the correct page
        }, error: (err) => {
          error = true;
        }
      });
    });
    if (error) {
      this.alertService.displayMessage("error", "error d envoie du formulaire , contacter le support  !", 'error');
    }

  }

  goBack(): void {
    window.history.back();
  }

  isFormValid(): boolean {
    let isValid = true;
    this.selectedPageConfig?.formConfig.forEach(config => {
      const control = this.dynamicForm.get(config.name);
      if (config.required) {
        if (config.type === 'checkbox') {
          const subFormGroup = control as FormGroup;
          let isSubFormValid = false;
          config.options?.forEach(option => {
            if (subFormGroup.get(option.id || '')?.value === true) {
              isSubFormValid = true;
            }
          });
          if (!isSubFormValid) {
            isValid = false;
          }
        } else {
          if (control?.invalid) {
            isValid = false;
          }
        }
      }
    });
    return isValid;
  }


  private convertFomValueToAmlPageConfigValues(): AmlPageConfigValue[] {
    const amlPageConfigValues: AmlPageConfigValue[] = [];
    console.log("the values of the dynamic form ****************");
    console.log(this.dynamicForm.value);

    this.InpuTypeConfigs.forEach(config => {
      if (config.type === 'checkbox') {
        const subFormGroup = this.dynamicForm.get(config.name);
        config.options?.forEach(option => {
          const isChecked = subFormGroup?.get(option.id || '')?.value;
          if (isChecked) {
            amlPageConfigValues.push({
              amlPageConfigID: this.selectedPageConfig?.id,
              InputTypeConfigID: config.id ?? '',
              value: option.value || ''
            });
          }
        });

      } else {
        if (config.type === 'select') {
          const selectedOption: Option = this.dynamicForm.get(config.name)?.value;
          amlPageConfigValues.push({
            amlPageConfigID: this.selectedPageConfig?.id,
            InputTypeConfigID: config.id || '',
            value: selectedOption.value || ''
          });
        }
        else {
          const controlValue = this.dynamicForm.get(config.name)?.value;
          amlPageConfigValues.push({
            amlPageConfigID: this.selectedPageConfig?.id,
            InputTypeConfigID: config.id || '',
            value: controlValue ? controlValue.toString() : ''
          });
        }
      }
    });
    console.log("aml page config ***************  result ");
    console.log(amlPageConfigValues);
    return amlPageConfigValues;
  }

}
