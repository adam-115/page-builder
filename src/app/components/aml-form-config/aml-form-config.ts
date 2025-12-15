import { Component } from '@angular/core';
import { AmlFieldEdit } from "../aml-field-edit/aml-field-edit";

@Component({
  selector: 'app-aml-form-config',
  imports: [AmlFieldEdit],
  templateUrl: './aml-form-config.html',
  styleUrl: './aml-form-config.css',
})
export class AmlFormConfig {

  showDialogNouveauChamp = false;

  clickShowDialogNouveauChamp() {
    this.showDialogNouveauChamp = true;
  }

  closeDialogNouveauChamp() {
    this.showDialogNouveauChamp = false;
  }

  updateFormConfig() {
    // Logic to update form configuration
    this.showDialogNouveauChamp = false;
  }


  clickAjouterChamp() {
    this.showDialogNouveauChamp = true;
  }


}
