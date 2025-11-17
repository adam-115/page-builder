import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { FieldType, FormElement } from '../../appTypes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-builder-input',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './page-builder-input.html',
  styleUrl: './page-builder-input.css',
})
export class PageBuilderInput implements OnInit, OnChanges {
  @Input()
  selectedFormElement: FormElement | null = null;

  @Output()
  createdOrUpdatedFormElementEmitter = new EventEmitter<FormElement>();

  pageForm: FormGroup;
  public fieldTypes: FieldType[] = [
    'text',
    'TextArea',
    'date',
    'select',
    'checkbox',
    'radio',
    'uploadFile',
    'submit',
    'cancel'
  ];


  constructor(private readonly fb: FormBuilder) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedFormElement']) {
      this.convertFormElementToForm(changes['selectedFormElement'].currentValue);
    }
  }

  ngOnInit(): void {
    this.pageForm = this.fb.group({
      fieldType: [this.fieldTypes[0], Validators.required],
      // New Controls added based on your request
      name: ['', Validators.required],
      required: [false],
      label: [''],
      placeholder: [''],
      errorMessage: ['This field is required.'],
      customStyle:[''],
      rowStart: [''],
      rowEnd: [''],
      colStart: [''],
      colEnd: [''],
      score: [''],
      defaultValue: [''],
      display: ['block'], // Defaulting to 'block'
      optionsList: [''],
    });

    this.pageForm.get('fieldType')?.valueChanges.subscribe(value => {
      if (value === 'select' || value === 'radio' || value === 'checkbox') {
        this.pageForm.get('defaultValue')?.disable();
      } else {
        this.pageForm.get('defaultValue')?.enable();
        this.pageForm.get('display')?.disable();
      }
    });

    if (this.selectedFormElement) {
      this.convertFormElementToForm(this.selectedFormElement);
    }


  }

  get selectedTypeValue(): FieldType | null {
    return this.pageForm.get('fieldType')?.value as FieldType | null;
  }

  // Méthode appelée lorsque le bouton 'Ajouter' (submit) est cliqué
  onSubmit() {
    if (this.pageForm.invalid) {
      console.error("Le formulaire n'est pas valide. Vérifiez les champs obligatoires.");
      // Optionnel: marquer tous les contrôles comme "touchés" pour afficher les erreurs
      this.pageForm.markAllAsTouched();
      return;
    }

    // Récupération des données brutes
    const rawData = this.pageForm.value;
    // Traitement des options (séparées par une nouvelle ligne)
    let processedOptions: string[] | undefined;
    if (rawData.optionsList) {
      processedOptions =String(rawData.optionsList)
        .split(',')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);
    }

    // Mappage et conversion des types vers l'interface FormElement
    const newFormElement: FormElement = {
      id: this.selectedFormElement?.id,
      type: rawData.fieldType,
      name: rawData.name,
      required: rawData.required,
      label: rawData.label,

      // Propriétés optionnelles
      // placeholder: rawData.placeholder || undefined,
      errorMessage: rawData.errorMessage || undefined,
      score: rawData.score ? Number(rawData.score) : undefined,
      defaultValue: rawData.defaultValue || undefined,

      // Options et Layout (si applicable)
      options: processedOptions,
      optionsLayout: rawData.display, // Utilisation de 'display' pour 'optionsLayout'

      // Coordonnées de Grille (Conversion obligatoire en Number)
      rowStart: Number(rawData.rowStart),
      rowEnd: Number(rawData.rowEnd),
      colStart: Number(rawData.colStart),
      colEnd: Number(rawData.colEnd),

      // Alignement (valeurs par défaut)
      justify: rawData.justify,
      align: rawData.align,
    };
    // // Affichage du résultat dans la console
    alert('✅ Nouvel élément de formulaire créé :' + JSON.stringify(newFormElement, null, 2));
    // this.communicationService.sendFormElementFromDfV2(newFormElement);
    this.createOrUpdateFormElement(newFormElement);
  }

  private convertFormElementToForm(formElement: FormElement | null) {
    if (formElement) {
      this.selectedFormElement = formElement;
      this.pageForm.patchValue({
        fieldType: formElement.type,
        name: formElement.name,
        required: formElement.required,
        label: formElement.label,
        errorMessage: formElement.errorMessage,
        rowStart: formElement.rowStart,
        rowEnd: formElement.rowEnd,
        colStart: formElement.colStart,
        colEnd: formElement.colEnd,
        score: formElement.score,
        defaultValue: formElement.defaultValue,
        display: formElement.optionsLayout,
        optionsList: formElement.options
      });
    }
    else {
      if(this.pageForm)
      {
        this.pageForm.reset();
        this.pageForm.patchValue({
        fieldType: 'text',
        });
      }
    }
  }

 private  createOrUpdateFormElement(formElement: FormElement) {
    this.createdOrUpdatedFormElementEmitter.emit(formElement);
  }



}
