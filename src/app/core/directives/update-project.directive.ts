import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[updateProject]',
})
export class UpdateProjectDirective {
  @Input() appHighlight = '';
  @Input() projectId = '';

  constructor(private el: ElementRef, private router: Router) {}

  @HostListener('click') onClick() {
    this.router.navigate([`project/form/${this.projectId}`]);
  }

  // @HostListener('mouseenter') onMouseEnter() {
  //   this.highlight(this.appHighlight || 'cyan');
  // }

  // @HostListener('mouseleave') onMouseLeave() {
  //   this.highlight('');
  // }

  // private highlight(color: string) {
  //   this.el.nativeElement.style.backgroundColor = color;
  // }
}
