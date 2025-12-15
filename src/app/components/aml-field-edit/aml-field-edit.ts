import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputType, InputTypeConfig, Option } from '../../../appTypes';

// Valeurs initiales par défaut
const initialField: InputTypeConfig = {
  id: null,
  type: 'select',
  name: '',
  facteur: 1,
  required: false,
  labelMessage: '',
};

@Component({
  selector: 'app-aml-field-edit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './aml-field-edit.html',
  styleUrl: './aml-field-edit.css',
})
export class AmlFieldEdit implements OnInit , OnChanges {

  @Input()
  showDialog = false;
  @Input()
  fieldConfig: InputTypeConfig = initialField;
  @Output()
  save = new EventEmitter<InputTypeConfig>();
  @Output()
  close = new EventEmitter<void>();

  amlForm!: FormGroup;
  availableTypes: InputType[] = ['select', 'checkbox', 'radio', 'uploadFile'];
  optionRequiredTypes: InputType[] = ['select', 'checkbox', 'radio'];

  constructor(private fb: FormBuilder) { }

  ngOnChanges(): void {
    if (this.showDialog) {
      const dataToLoad = this.fieldConfig.id !== null ? this.fieldConfig : initialField;
      this.initForm(dataToLoad);
    }
  }

  ngOnInit(): void {
    const initialData = this.fieldConfig.id !== null ? this.fieldConfig : initialField;
    this.initForm(initialData);

    // Abonnement pour gérer dynamiquement le FormArray 'options'
    this.amlForm.get('type')?.valueChanges.subscribe((type: InputType) => {
      this.toggleOptionsLogic(type);
    });
  }

  // Initialisation du formulaire réactif
  initForm(config: InputTypeConfig): void {

    // Créer le FormArray 'options' basé sur les données existantes
    const initialOptions: Option[] = config.options || [];

    this.amlForm = this.fb.group({
      id: [config.id],
      type: [config.type, Validators.required],
      name: [config.name, Validators.required],
      labelMessage: [config.labelMessage, Validators.required],
      required: [config.required],
      facteur: [config.facteur, [Validators.required, Validators.min(0)]],
      // REMOVED: score from the main form group
      placeholder: [config.placeholder || ''],
      errorMessage: [config.errorMessage || ''],
      customStyle: [config.customStyle || ''],
      defaultValue: [config.defaultValue],
      optionsLayout: [config.optionsLayout || 'block'],
      options: this.fb.array(this.createOptionFormArray(initialOptions, config.type))
    });

    this.toggleOptionsLogic(config.type);
  }

  // Crée un FormGroup pour une seule option
  createOptionFormGroup(option: Option): FormGroup {
    return this.fb.group({
      id: [option.id],
      value: [option.value, Validators.required],
      score: [option.score, [Validators.required, Validators.min(0)]], // Score reste ici
      order: [option.order]
    });
  }

  // Mappe les données initiales en FormGroups
  createOptionFormArray(options: Option[], currentType: InputType): FormGroup[] {
    // Si c'est un champ à options et qu'il n'y en a pas, ajouter une option par défaut
    if (this.optionRequiredTypes.includes(currentType) && options.length === 0) {
      return [this.createOptionFormGroup({ value: '', score: 0 })];
    }
    return options.map(opt => this.createOptionFormGroup(opt));
  }


  // Logique pour gérer le champ 'options' (ajouter/retirer le FormArray)
  toggleOptionsLogic(type: InputType): void {
    const optionsArray = this.amlForm.get('options') as FormArray;
    const isOptionsRequired = this.optionRequiredTypes.includes(type);

    if (isOptionsRequired) {
      // S'assurer qu'il y a au moins un élément si le type requiert des options
      if (optionsArray.length === 0) {
        this.addOption();
      }
    } else {
      // Vider le FormArray si le type ne nécessite plus d'options
      optionsArray.clear();
    }
  }


  // Getter pour le FormArray 'options'
  get options(): FormArray {
    return this.amlForm.get('options') as FormArray;
  }

  // Méthodes pour gérer les options
  addOption(): void {
    this.options.push(this.createOptionFormGroup({ value: '', score: 0 }));
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  // Soumission
  onSubmit(): void {
    if (this.amlForm.valid) {
      // Récupérer les données brutes (y compris les champs non contrôlés par le FormArray si nécessaire,
      // mais ici nous utilisons getRawValue() pour obtenir toutes les valeurs)
      const finalValue: InputTypeConfig = this.amlForm.getRawValue();

      // Nettoyer les propriétés inutiles si le type ne les utilise pas
      if (!this.optionRequiredTypes.includes(finalValue.type)) {
        finalValue.options = undefined;
        finalValue.optionsLayout = undefined;
      }

      this.save.emit(finalValue);
    } else {
      this.amlForm.markAllAsTouched();
    }
  }

  onClose(): void {
    this.close.emit();
  }

  /**
   * @description Simule le traitement d'un fichier CSV/JSON pour ajouter des options.
   * NOTE: Le traitement réel (lecture, parsing du fichier) se ferait dans un service Angular.
   */
  handleFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Ici, on simule l'ajout d'options basées sur le nom du fichier.
      console.log(`Fichier sélectionné pour importation : ${file.name}`);

      // --- LOGIQUE SIMULÉE CÔTÉ CLIENT (A ADAPTER) ---
      // Si on détecte un fichier, on pourrait vider les options existantes
      // et ajouter des options factices (ou réelles après parsing).
      this.options.clear();

      // Simulation: Ajouter deux options après l'import
      this.options.push(this.createOptionFormGroup({ value: 'Import-A: ' + file.name, score: 5 }));
      this.options.push(this.createOptionFormGroup({ value: 'Import-B: ' + file.name, score: 10 }));

      // Réinitialiser la valeur de l'input pour permettre l'upload du même fichier à nouveau
      input.value = '';

      alert(`Importation simulée réussie de ${file.name} ! Vérifiez la section "Options" ci-dessous.`);
    }
  }
}
