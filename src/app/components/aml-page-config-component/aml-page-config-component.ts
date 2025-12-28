import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertConfig, AmlPageConfig, InputTypeConfig } from '../../../appTypes';
import { NotificationService } from '../../services/notification-service';
import { AlertComponent } from "../alert-component/alert-component";
import { AmlFieldEdit } from "../aml-field-edit/aml-field-edit";
import { AmlPageView } from "../aml-page-view/aml-page-view";
import { NavigationService } from './../../services/navigation-service';
import { PageConfigService } from './../../services/page-config-service';

@Component({
  selector: 'app-aml-page-config-component',
  imports: [CommonModule, ReactiveFormsModule, AmlFieldEdit, AlertComponent, AmlPageView],
  templateUrl: './aml-page-config-component.html',
  styleUrl: './aml-page-config-component.css',
})
export class AmlPageConfigComponent implements OnInit {

  // service injection
  pageConfigService = inject(PageConfigService);
  notificationService = inject(NotificationService);
  navigationService = inject(NavigationService);
  activatedRoute = inject(ActivatedRoute);

  inputTypesConfigs: InputTypeConfig[] = [];

  // if is on edit mode
  isEditeMode = false;
  editedPageConfig: AmlPageConfig | null = null;
  selectedTypeConfig: InputTypeConfig | null = null;
  showDialogNewInputTypeConfig = false;

  showdialogAlert: boolean = false;
  showDialogPreview: boolean = false;


  amlPagePreviewConfig: AmlPageConfig | null = null;
  pageForm: FormGroup = new FormGroup({});
  alertConfig: AlertConfig = {
    type: 'error',
    title: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
    confirmText: 'OK'
  };
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
          console.log(this.editedPageConfig);
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


  openInputFieldDialogForEdit(inputTypeConfig:InputTypeConfig):void{
    this.selectedTypeConfig = inputTypeConfig ;
    this.showDialogNewInputTypeConfig = true ;
  }



  // SUPPRIMER UN CHAMP
  // removeField(index: number): void {
  //   if (confirm('Voulez-vous vraiment supprimer ce champ ?')) {
  //     this.pageConfig.formConfig.splice(index, 1);
  //     // Réorganiser les ordres d'affichage après suppression
  //     this.pageConfig.formConfig.forEach((f, i) => f.displayOrer = i + 1);
  //   }
  // }

  // SAUVEGARDE GLOBALE DE LA PAGE
  savePage(): void {
    if (this.pageForm.valid && this.inputTypesConfigs.length > 0) {
      this.pageConfig = this.convertFormToAmlPageConfig();
      console.log(this.pageConfig);
      this.pageConfigService.create(this.pageConfig).subscribe({
        next: (response) => {
          this.notificationService.info("c est un message test ");
        },
        error: (err) => {
          this.notificationService.error("message d erreur ");
        }
      });
    }
  }

  confirmAlert(id: number): void {
    if (id === 2) { // 2 for delete confirmation
      this.deleteInputTypeConfig(this.selectedTypeConfig?.name || '');
      this.showdialogAlert = false;
    }
  }

  cancelAlert(id: number): void {
    // Logique à exécuter lorsque l'utilisateur annule l'alerte
    this.showdialogAlert = false;
  }

  private isInputTypeConfigExist(name: string): boolean {
    return this.inputTypesConfigs.some(config => config.name === name);
  }

  private showAlertFiledConfigExists(name: string): void {
    this.alertConfig = {
      type: 'warning',
      title: 'Champ existant',
      message: 'Un champ avec le nom "' + name + '" existe déjà. Veuillez choisir un nom unique.',
      confirmText: 'OK'
    };
    this.showdialogAlert = true;
  }

  dispalyDeleteConfirmationDialog(inputTypeConfig: InputTypeConfig): void {
    this.selectedTypeConfig = inputTypeConfig;
    this.alertConfig = {
      id: 2,// 2 for delete confirmation
      type: 'confirm',
      title: 'Confirmation',
      message: 'Êtes-vous sûr de vouloir supprimer ' + inputTypeConfig.name + ' ?',
      confirmText: 'OK',
      cancelText: 'Annuler'
    };
    this.showdialogAlert = true;
  }



  private deleteInputTypeConfig(name: string): void {
    const index = this.inputTypesConfigs.findIndex(config => config.name === name);
    if (index !== -1) {
      this.inputTypesConfigs.splice(index, 1);
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
    }
  }



  Onsubmit(): void {
    this.savePage();
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
    this.selectedTypeConfig = null ;
    this.showDialogNewInputTypeConfig = false;
  }

   addInputTypeConfig(inputTypeConfig: any): void {

    inputTypeConfig = inputTypeConfig as InputTypeConfig;
    // check if the field already exists (update) or is new (add)
    if (this.isInputTypeConfigExist(inputTypeConfig.name)) {
      this.showAlertFiledConfigExists(inputTypeConfig.name);
    } else {
      this.inputTypesConfigs.push(inputTypeConfig);
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
    }
    this.closeInputFieldConfigDialog() ;
  }

  updateInputTypeConfig(updatedConfig: InputTypeConfig): void {
    if (!this.selectedTypeConfig) {
      return;
    }
    const index = this.inputTypesConfigs.findIndex(config => config.name === this.selectedTypeConfig!.name);
    if (index !== -1) {
      this.inputTypesConfigs[index] = updatedConfig;
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
    }
    this.closeInputFieldConfigDialog();
  }



}
