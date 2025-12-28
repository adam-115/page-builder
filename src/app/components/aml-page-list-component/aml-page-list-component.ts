import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AmlPageConfig } from '../../../appTypes';
import { PageConfigService } from './../../services/page-config-service';
import { NavigationService } from '../../services/navigation-service';

@Component({
  selector: 'app-aml-page-list-component',
  imports: [CommonModule],
  templateUrl: './aml-page-list-component.html',
  styleUrl: './aml-page-list-component.css',
})
export class AmlPageListComponent implements OnInit {
  pageConfigService = inject(PageConfigService);
  navigateService = inject(NavigationService);

  // Simulation de données provenant d'un service
  pages: AmlPageConfig[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadPagesConfig();
  }


  loadPagesConfig(): void {
    this.pageConfigService.getAll().subscribe(data => {
      this.pages = data;
    })
  }



  editPage(page: AmlPageConfig) {
    if (page.id) {
      this.navigateService.navigateToEditPageConfig(page.id);
    }
  }

  // deletePage(id: number | null) {
  //   alert("edit page "+id);
  //   if (confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
  //     this.pages = this.pages.filter(p => p.id !== id);
  //   }
  // }

  createNewPage() {
    this.navigateService.navigateToNewPageConfig();
  }


}
