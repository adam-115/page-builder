import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormElement } from '../../appTypes';
import { PageBuilderInput } from "../page-builder-input/page-builder-input";

@Component({
  selector: 'app-page-builder-display',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, PageBuilderInput],
  templateUrl: './page-builder-display.html',
  styleUrl: './page-builder-display.css',
})
export class PageBuilderDisplay implements OnInit {

  displayForm!: FormGroup;

  gridNumberOfCols = 11;
  gridNumberOfRows = 10;
  gridRowHighInPX = 80;
  showLineNumbers = false;
  gridCustomStyle = ""

  // New property to hold the selected file objects
  selectedFiles: { [key: string]: File | null } = {};
  // State to track the currently selected grid item ID for design mode
  selectedItemId: number | null = null;
  selectedFormElement: FormElement | null = null;
  // Compteur simple pour l'ID
  private nextId = 12;

  gridItems: FormElement[] = [
    { id: 1, customStyle: '', defaultValue: 'dfsdfsd', name: 'firstName', type: 'text', required: true, label: 'First Name', rowStart: 1, rowEnd: 2, colStart: 1, colEnd: 6, justify: 'center', align: 'start' },
    { id: 2, name: 'lastName', type: 'text', required: true, label: 'Last Name', rowStart: 1, rowEnd: 2, colStart: 6, colEnd: 11, justify: 'center', align: 'start' },
    { id: 3, name: 'dateOfBirth', type: 'date', required: true, label: 'Date of Birth', rowStart: 2, rowEnd: 3, colStart: 1, colEnd: 6, justify: 'center', align: 'start' },
    { id: 4, name: 'country', type: 'select', required: true, label: 'Country', options: ['USA', 'Canada', 'UK'], rowStart: 2, rowEnd: 3, colStart: 6, colEnd: 11, justify: 'center', align: 'start' },
    { id: 5, name: 'address', type: 'TextArea', required: false, label: 'Address', rowStart: 3, rowEnd: 5, colStart: 1, colEnd: 11, justify: 'start', align: 'stretch' },
    { id: 6, name: 'hobbies', type: 'checkbox', required: false, label: 'Hobbies', options: ['Reading', 'Traveling', 'Cooking'], optionsLayout: 'inline', rowStart: 5, rowEnd: 6, colStart: 1, colEnd: 6, justify: 'center', align: 'start' },
    { id: 7, name: 'gender', type: 'radio', required: true, label: 'Gender', options: ['Male', 'Female', 'Other'], optionsLayout: 'block', rowStart: 5, rowEnd: 6, colStart: 6, colEnd: 11, justify: 'center', align: 'start' },
    { id: 8, name: 'profilePicture', type: 'uploadFile', required: false, label: 'Profile Picture', rowStart: 7, rowEnd: 8, colStart: 1, colEnd: 11, justify: 'center', align: 'start' },

    // Action Buttons placed in row 9 initially
    { id: 9, name: 'cancelBtn', type: 'cancel', required: false, label: 'Annuler', rowStart: 9, rowEnd: 10, colStart: 8, colEnd: 10, justify: 'end', align: 'center' },
    { id: 10, name: 'submitBtn', type: 'submit', required: false, label: 'Soumettre', rowStart: 9, rowEnd: 10, colStart: 10, colEnd: 12, justify: 'end', align: 'center' }

  ];
  private readonly fb = inject(FormBuilder);

  ngOnInit(): void {
    this.buildForm();
  }


  buildForm(): void {
    const group: { [key: string]: any } = {};
    this.gridItems.forEach(item => {
      // Skip actions (buttons) and file inputs as they do not hold standard form data
      if (item.type === 'submit' || item.type === 'cancel' || item.type === 'uploadFile') {
        // Initialize file entry in selectedFiles map
        if (item.type === 'uploadFile') {
          this.selectedFiles[item.name] = null;
        }
        return;
      }
      const validators = item.required ? [Validators.required] : [];
      let initialValue: any = null;

      if (item.type === 'checkbox') {
        initialValue = [];
      } else if (item.type === 'select') {
        initialValue = null;
      } else if (item.type == 'text') {
        initialValue = item.defaultValue;
      }


      group[item.name] = [initialValue, validators];
    });

    this.displayForm = this.fb.group(group);
  }

  getGridStyle(): string {
    // Row height set to 80px for consistent spacing of labels and inputs.
    return `grid-template-columns: repeat(${this.gridNumberOfCols}, minmax(0, 1fr)); grid-template-rows: repeat(${this.gridNumberOfRows}, ${this.gridRowHighInPX}px);`;
  }


  /**
  * Generates the full class string for a grid item, including dynamic alignment.
  * @param item The GridItem configuration.
  * @returns A Tailwind class string.
  */
  getGridItemClasses(item: FormElement): string {
    // Base classes include 'relative' to correctly position the resize handle
    const baseClasses = 'w-full h-full flex flex-col p-3 z-10 relative';

    // Determine default/explicit justification (vertical alignment for flex-col)
    let justifyClass: string;
    if (item.justify) {
      justifyClass = `justify-${item.justify}`;
    } else {
      // Default: buttons to bottom, inputs/fields to center
      justifyClass = (item.type === 'submit' || item.type === 'cancel') ? 'justify-end' : 'justify-center';
    }

    // Determine default/explicit alignment (horizontal alignment for flex-col)
    let alignClass: string;
    if (item.align) {
      alignClass = `items-${item.align}`;
    } else {
      // Default: buttons to center, inputs/fields to start (left)
      alignClass = (item.type === 'submit' || item.type === 'cancel') ? 'items-center' : 'items-start';
    }

    // Selection border and hover effect
    let borderClass = '';
    if (this.selectedFormElement?.id === item.id) {
      // Class for selected item: blue border and a ring shadow for emphasis
      borderClass = 'border-4 border-blue-500 ring-4 ring-blue-300 shadow-xl cursor-grab'; // Used cursor-grab to imply editability
    } else {
      // Base class for unselected item
      borderClass = 'border border-transparent hover:border-blue-300 cursor-pointer';
    }

    return `${baseClasses} ${justifyClass} ${alignClass} ${borderClass}`;
  }


  /**
   * Selects a grid item and logs its data to the console for design mode.
   * Clicking an already selected item deselects it.
   * @param item The GridItem to select.
   */
  selectItem(item: FormElement): void {
    alert("the select item");
    // alert(JSON.stringify(item));
    if (this.selectedFormElement != null && this.selectedFormElement?.id === item.id) {
      alert("already exist");
      this.selectedFormElement = null;
    } else {
      // Select new item
      alert("select new one ");
      this.selectedFormElement = item;
    }
  }

  /**
  * Handles the file input change event to store the selected file.
  */
  onFileSelected(event: Event, itemName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[itemName] = input.files[0];
      console.log(`Fichier sélectionné pour ${itemName}:`, this.selectedFiles[itemName]!.name);
    } else {
      this.selectedFiles[itemName] = null;
      console.log(`Sélection de fichier effacée pour ${itemName}.`);
    }
  }

  /**
   * Converts the selectedFiles map into a display-friendly object.
   */
  getFileDisplay(): any {
    const display: any = {};
    for (const key in this.selectedFiles) {
      const file = this.selectedFiles[key];
      display[key] = file ? { name: file.name, size: `${(file.size / 1024).toFixed(2)} KB`, type: file.type } : null;
    }
    return display;
  }

  /**
   * Handles changes for the multi-select checkbox group
   */
  onCheckboxChange(event: Event, controlName: string, optionValue: string): void {
    const checked = (event.target as HTMLInputElement).checked;
    const control = this.displayForm.get(controlName);

    if (control) {
      let currentValues: string[] = Array.isArray(control.value) ? [...control.value] : [];

      if (checked) {
        currentValues.push(optionValue);
      } else {
        currentValues = currentValues.filter(v => v !== optionValue);
      }

      control.setValue(currentValues);
      control.markAsDirty();
    }
  }


  onSubmit(): void {
    if (this.displayForm.valid) {
      console.log('--- Données soumises du formulaire ---');
      console.log('Valeurs du formulaire (Texte/Données):', this.displayForm.value);
      console.log('Fichiers sélectionnés:', this.selectedFiles);
      console.log('--------------------------');
    } else {
      console.log('Le formulaire est invalide. Impossible de soumettre.');
      this.displayForm.markAllAsTouched(); // Visually show all errors
    }
  }

  /**
   * Clears the form and resets its state.
   */
  onCancel(): void {
    this.displayForm.reset();
    // Reset initial values for complex controls
    this.gridItems.forEach(item => {
      if (item.type === 'checkbox') {
        this.displayForm.get(item.name)?.setValue([]);
      } else if (item.type === 'select') {
        this.displayForm.get(item.name)?.setValue(null);
      }
    });

    // Reset file inputs
    this.selectedFiles = {};
    this.gridItems.filter(item => item.type === 'uploadFile').forEach(item => {
      this.selectedFiles[item.name] = null;
    });

    console.log('Le formulaire a été annulé et réinitialisé.');
  }


  createOrUpdateFormElement(formElement: FormElement): void {
    alert("here the value " + JSON.stringify(formElement));

    // Vérification si l'élément est nouveau (ID non défini ou null)
    if (formElement.id === null || formElement.id === undefined) {
      alert("creation");
      formElement.id = this.nextId++;
      // 1. AJOUT (Create)
      // Créer un nouveau tableau en utilisant le spread operator [...]
      // pour garantir l'immutabilité et forcer le rafraîchissement.
      this.gridItems = [...this.gridItems, formElement];
      console.log('Nouvel élément ajouté (immuable):', formElement);

    } else {
      alert("update");
      // 2. MISE À JOUR (Update)

      // Créer un nouveau tableau en utilisant .map() pour mettre à jour l'élément ciblé
      // et retourner tous les autres éléments sans modification.
      const updatedGridItems = this.gridItems.map(fE => {
        if (fE.id === formElement.id) {
          // Retourne le nouvel élément mis à jour
          return formElement;
        }
        // Retourne l'élément original s'il ne correspond pas
        return fE;
      });
      // Vérifier si la mise à jour a eu lieu ou si l'élément n'a pas été trouvé
      const found = updatedGridItems.some(fE => fE.id === formElement.id);

      if (found) {
        this.gridItems = updatedGridItems;
        console.log('Élément mis à jour (immuable) :', formElement.id);
      } else {
        // Si l'élément n'est pas trouvé (mais a un ID), on l'ajoute.
        this.gridItems = [...this.gridItems, formElement];
        console.warn("Élément non trouvé, mais ajouté (comportement d'upsert) :", formElement);
      }
    }
    this.buildForm();
  }


}
