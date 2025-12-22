import { Component, OnInit } from '@angular/core';
import { AlertConfig, AmlPageConfig, InputTypeConfig } from '../../../appTypes';
import { AlertComponent } from "../alert-component/alert-component";
import { AmlFieldEdit } from "../aml-field-edit/aml-field-edit";

@Component({
  selector: 'app-aml-page-config-component',
  imports: [AmlFieldEdit, AlertComponent],
  templateUrl: './aml-page-config-component.html',
  styleUrl: './aml-page-config-component.css',
})
export class AmlPageConfigComponent implements OnInit {
  showDilogNouveauChamp = false;
  inputTypesConfigs: InputTypeConfig[] = [];
  selectedTypeConfig: InputTypeConfig | null = null;

  showdialogAlert: boolean = false;
  alertConfig: AlertConfig = {
    type: 'error',
    title: 'Confirmation',
    message: 'Êtes-vous sûr de vouloir effectuer cette action ?',
    confirmText: 'OK'
  };
  // Initialisation de l'objet selon votre interface AmlPageConfig
  pageConfig: AmlPageConfig = {
    id: 1,
    pageName: '',
    pageTitle: '',
    pageDescription: '',
    formConfig: [],
    order: 1,
  };

  constructor() { }

  ngOnInit(): void {

  }

  // OUVRE LE DIALOGUE POUR CRÉER OU MODIFIER UN CHAMP
  openFieldDialog(field?: InputTypeConfig, index?: number): void {

    this.showDilogNouveauChamp = true;

  }

  // SUPPRIMER UN CHAMP
  removeField(index: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce champ ?')) {
      this.pageConfig.formConfig.splice(index, 1);
      // Réorganiser les ordres d'affichage après suppression
      this.pageConfig.formConfig.forEach((f, i) => f.displayOrer = i + 1);
    }
  }

  // SAUVEGARDE GLOBALE DE LA PAGE
  savePage(): void {
    if (!this.pageConfig.pageName || !this.pageConfig.pageTitle) {
      return;
    }
    console.log('Envoi de AmlPageConfig au backend:', this.pageConfig);
    // Appel service API ici
  }


  addnewField(): void {
    // Ouvrir le dialogue pour ajouter un nouveau champ
    this.openFieldDialog();
  }
  closeFieldDialog(): void {
    this.showDilogNouveauChamp = false;

  }

  addOrUpdateField(inputTypeConfig: any): void {
    console.log('Field reçu du dialogue:', inputTypeConfig);
    inputTypeConfig = inputTypeConfig as InputTypeConfig;
    // check if the field already exists (update) or is new (add)
    if (this.isInputTypeConfigExist(inputTypeConfig.name)) {
      this.showAlertFiledConfigExists(inputTypeConfig.name);
    } else {
      this.inputTypesConfigs.push(inputTypeConfig);
      this.pageConfig.formConfig = [...this.inputTypesConfigs];
      console.log(" the list of input type configs " + JSON.stringify(this.inputTypesConfigs));
      this.closeFieldDialog();
    }
  }


  confirmAlert(id: number): void {
    if(id === 2) { // 2 for delete confirmation
     this.deleteInputTypeConfig(this.selectedTypeConfig?.name || '');
     this.showdialogAlert = false;
    }
  }

  cancelAlert(id: number): void {
    // Logique à exécuter lorsque l'utilisateur annule l'alerte
    console.log('Alerte annulée');
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

  editInputTypeConfig(): void {
    let config: InputTypeConfig | undefined = this.inputTypesConfigs.find(config => config.name === this.selectedTypeConfig?.name);
    if (config) {
      this.openFieldDialog(config);
    }
  }


}
