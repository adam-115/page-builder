import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AmlPageConfig } from '../../../appTypes';
import { AlertService } from '../../services/alert-service';
import { AmlFieldEdit } from "../aml-field-edit/aml-field-edit";
import { InputTypeConfig } from './../../../appTypes';
import { NavigationService } from './../../services/navigation-service';
import { PageConfigService } from './../../services/page-config-service';

@Component({
  selector: 'app-aml-page-config-component',
  imports: [CommonModule, ReactiveFormsModule, AmlFieldEdit],
  templateUrl: './aml-page-config-component.html',
  styleUrl: './aml-page-config-component.css',
})
export class AmlPageConfigComponent implements OnInit {

  // service injection
  pageConfigService = inject(PageConfigService);
  navigationService = inject(NavigationService);
  alertService = inject(AlertService);
  activatedRoute = inject(ActivatedRoute);

  inputTypesConfigs: InputTypeConfig[] = [];

  // if is on edit mode
  isEditeMode = false;
  editedPageConfig: AmlPageConfig | null = null;
  selectedInputTypeConfig: InputTypeConfig | null = null;
  showDialogNewInputTypeConfig = false;

  showDialogPreview: boolean = false;


  amlPagePreviewConfig: AmlPageConfig | null = null;
  pageForm: FormGroup = new FormGroup({});

  // Initialisation de l'objet selon votre interface AmlPageConfig
  pageConfig: AmlPageConfig = {
    pageName: '',
    pageTitle: '',
    pageDescription: '',
    formConfig: [],
    order: 1,
  };

  constructor(private readonly fb: FormBuilder) { }
  ngOnInit(): void {
    // build dynamic form
    this.buildForm();
    // check if is update a init data if the case
    this.isItUpdateMode();
  }

  // load config to update
  private isItUpdateMode(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get("id");
      this.isEditeMode = !!id;
      if (this.isEditeMode) {
        this.pageConfigService.findById(id).subscribe(data => {
          this.editedPageConfig = data;
          this.initializeFormWithAmlPageConfig(this.editedPageConfig);
        })
      }
    });
  }

  // build dynamic form for the page
  private buildForm(): void {
    this.pageForm = this.fb.group({
      pageName: [this.pageConfig.pageName, Validators.required],
      pageTitle: [this.pageConfig.pageTitle, Validators.required],
      pageDescription: [this.pageConfig.pageDescription],
      pageOrder: [this.pageConfig.order],
    });
  }


  openInputFieldDialogForEdit(inputTypeConfig: InputTypeConfig): void {
    this.selectedInputTypeConfig = inputTypeConfig;
    this.showDialogNewInputTypeConfig = true;
  }

  // SAUVEGARDE GLOBALE DE LA PAGE
  private saveNewPage(): void {
    if (this.pageForm.valid && this.inputTypesConfigs.length > 0) {
      this.pageConfig = this.convertFormToAmlPageConfig();

      this.alertService.confirmMessage("Ajout Nouvelle Page ", "Voullez-vous ajouter la page", 'question').then(result => {
        if (result) {
          this.pageConfigService.create(this.pageConfig).subscribe({
            next: (response) => {
              this.alertService.displayMessage("nouvelle page ", "la nouvelle page est bien ajouter ", 'success');
              this.navigationService.navigateToPageConfigList();
            },
            error: (err) => {
              this.alertService.displayMessage("Error... ", "Error ajout de la page merci de contacter le support ", 'error');
            }
          });
        }
      })
    }
  }

  private editNewPage(): void {
    if (this.pageForm.valid && this.inputTypesConfigs.length > 0) {
      this.pageConfig = this.convertFormToAmlPageConfig();
      this.pageConfig.id = this.editedPageConfig?.id;

      this.alertService.confirmMessage("Updtae Page ", "Voullez-vous mettre a jour la page " + this.pageConfig.pageName, 'question').then(result => {
        if (result) {
          this.pageConfigService.update(this.editedPageConfig?.id, this.pageConfig).subscribe({
            next: (response) => {
              this.alertService.displayMessage("Page mis  a jour  ", "la nouvelle page est bien ajouter ", 'success');
              this.navigationService.navigateToPageConfigList();
            },
            error: (err) => {
              this.alertService.displayMessage("Error... ", "Error de la mise a jour de la page, merci de contacter le support ", 'error');
            }
          });
        }
      })
    }
  }




  private isInputTypeConfigExist(name: string): boolean {
    return this.inputTypesConfigs.some(config => config.name === name);
  }



  OnDeleteInputTypeConfigDialo(toDeleteInputTypeConfig: InputTypeConfig): void {
    this.alertService.confirmMessage("suppression Input type config ", "voullez-vous supprimez " + toDeleteInputTypeConfig.name, 'warning').then(result => {
      if (result) {
        this.deleteInputTypeConfig(toDeleteInputTypeConfig.name);
        this.alertService.displayMessage("New InputType Config", "the input with name " + toDeleteInputTypeConfig.name + " is deleted .", "success")
      }
    })

  }



  private deleteInputTypeConfig(name: string): void {
    const index = this.inputTypesConfigs.findIndex(config => config.name === name);
    if (index !== -1) {
      this.inputTypesConfigs.splice(index, 1);
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
    }
  }



  Onsubmit(): void {
    if (this.isEditeMode) {
      this.editNewPage();
    } else {
      this.saveNewPage();
    }
  }


  // In your component class
  private convertFormToAmlPageConfig(): AmlPageConfig {
    const formValue = this.pageForm.getRawValue(); // Use getRawValue() to get all values including disabled controls

    const amlPageConfig: AmlPageConfig = {
      pageName: formValue.pageName,
      pageTitle: formValue.pageTitle,
      pageDescription: formValue.pageDescription || '', // Handle optional field
      order: formValue.pageOrder || 0, // Assuming order is number, provide default
      formConfig: this.inputTypesConfigs,
    };

    return amlPageConfig;
  }

  annuler(): void {
    this.navigationService.navigateToPageConfigList();
  }

  openPreviewDialog(): void {
    this.amlPagePreviewConfig = this.convertFormToAmlPageConfig();
    this.showDialogPreview = true;
  }

  closePreviewDialog(): void {
    this.showDialogPreview = false;
  }

  // Initialize form when creating component or loading data
  private initializeFormWithAmlPageConfig(pageConfig: AmlPageConfig): void {
    this.pageForm = this.fb.group({
      pageName: [pageConfig.pageName || '', Validators.required],
      pageTitle: [pageConfig.pageTitle || '', Validators.required],
      pageDescription: [pageConfig.pageDescription || ''],
      pageOrder: [pageConfig.order || 0],
    });
    this.inputTypesConfigs = pageConfig.formConfig;

  }



  // add or update new field config
  openInputFieldConfigDialog(): void {
    this.showDialogNewInputTypeConfig = true;
  }

  closeInputFieldConfigDialog(): void {
    this.selectedInputTypeConfig = null;
    this.showDialogNewInputTypeConfig = false;
  }

  addInputTypeConfig(inputTypeConfig: any): void {

    inputTypeConfig = inputTypeConfig as InputTypeConfig;
    // check if the field already exists (update) or is new (add)
    if (this.isInputTypeConfigExist(inputTypeConfig.name)) {
      this.alertService.displayMessage("Ajout Input type config ", "input type config existe deja avec le meme nom : " + inputTypeConfig.name, "error");
    } else {
      this.inputTypesConfigs.push(inputTypeConfig);
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
    }
    this.closeInputFieldConfigDialog();
  }

  updateInputTypeConfig(updatedConfig: InputTypeConfig): void {
    if (!this.selectedInputTypeConfig) {
      return;
    }
    const index = this.inputTypesConfigs.findIndex(config => config.name === this.selectedInputTypeConfig!.name);
    if (index !== -1) {
      this.inputTypesConfigs[index] = updatedConfig;
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
    }
    this.closeInputFieldConfigDialog();
  }


}
