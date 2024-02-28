import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StorageProps } from 'src/app/core/enums/enums';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() totalItems = 0;
  @Input() itemsPerPage = 10;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pagesCount(): number[] {
    const pages = [];
    for (let i = 0; i < this.totalPages; i++) {
      pages.push(i + 1);
    }
    return pages;
  }

  changePage(page: number): void {
    localStorage.setItem(StorageProps.PROJECT_PAGE, page.toString());
    this.pageChange.emit(page);
  }
}
