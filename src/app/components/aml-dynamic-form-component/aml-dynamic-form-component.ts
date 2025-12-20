import { Component, OnInit, Input, input } from '@angular/core';
import { InputTypeConfig, Option } from '../../../appTypes';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  // Simulation de la configuration reçue du backend, utilisant votre structure InputTypeConfig
  // Cette structure est celle que vous chargez.
  @Input()
  amlConfig: InputTypeConfig[] = [
    {
      id: 1, type: 'uploadFile', name: 'id_document', labelMessage: 'Veuillez télécharger votre pièce d\'identité.', facteur: 15, score: 55, required: false,
      options: [
        // { id: 1, InputTypeConfigId: 1, value: 'uploaded', score: 10 },
      ] as Option[],
    },
    {
      id: 2, type: 'select', name: 'country', labelMessage: 'Quel est votre pays de résidence ?', facteur: 5, required: true,
      options: [
        { id: 101, InputTypeConfigId: 2, value: 'Faible Risque', score: 0 },
        { id: 102, InputTypeConfigId: 2, value: 'Moyen Risque', score: 5 },
        { id: 103, InputTypeConfigId: 2, value: 'Haut Risque', score: 10 }
      ] as Option[]
    },
    {
      id: 3, type: 'radio', name: 'ppe_status', labelMessage: 'Êtes-vous une Personne Politiquement Exposée (PPE) ?', facteur: 1, required: true,
      options: [
        { id: 201, InputTypeConfigId: 3, value: 'true', score: 1, order: 1 }, // Le score est de 1 ici, il est multiplié par le facteur 20
        { id: 202, InputTypeConfigId: 3, value: 'false', score: 2, order: 2 }
      ] as Option[]
    },
    {
      id: 4, type: 'checkbox', name: 'aaaa', labelMessage: 'test de check box ?', facteur: 1, required: true,
      options: [
        { id: 201, name: 'option1', InputTypeConfigId: 4, value: 'est ce que option1', score: 10, order: 1 }, // Le score est de 1 ici, il est multiplié par le facteur 20
        { id: 202, name: 'option2', InputTypeConfigId: 4, value: 'est ce que option 2', score: 20, order: 2 }
      ] as Option[]
    },

  ];

  dynamicForm: FormGroup;
  totalRiskScore: number = 0;
  fieldScores: FieldScore[] = [];

  constructor(private fb: FormBuilder) {
    this.dynamicForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.buildDynamicForm();
    this.subscribeToFormChanges();
  }

  // Construction dynamique des FormControls
  private buildDynamicForm(): void {
    this.amlConfig.forEach(config => {
      const validators = config.required ? [Validators.required] : [];

      if (config.type === 'uploadFile') {
        this.dynamicForm.addControl(config.name, this.fb.control(null, validators));
      } else if (config.type === 'select') {
        this.dynamicForm.addControl(config.name, this.fb.control(null, validators));
        // Pour les types avec options, on peut ajouter des validateurs spécifiques si nécessaire
      } else if (config.type === 'checkbox') {
        let subFormForSelect = this.fb.group({});
        config.options?.forEach(option => {
          const controlName = option.name || '';
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
    this.amlConfig.forEach(config => {
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
        config.options?.forEach(option => {
          let isChecked = subFormGroup.get(option.name || '')?.value;
          if (isChecked) {
            score += (option.score * config.facteur);
          }
        });
      }

      //case radio
      if (config.type === 'radio') {
        let fieldValue = this.dynamicForm.get(config.name)?.value;
        if (fieldValue != null && fieldValue != undefined  && fieldValue != '') {
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
    return this.amlConfig.find(c => c.name === name);
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
      console.log(JSON.stringify(this.dynamicForm.value));
      console.log('Formulaire valide soumis ! Score de risque final:', this.totalRiskScore);
      alert(`Score de risque total : ${this.totalRiskScore}`);
    } else {
      alert('Veuillez remplir tous les champs requis.');
    }
  }




}
