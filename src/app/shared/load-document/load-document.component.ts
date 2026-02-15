import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-load-document',
  templateUrl: './load-document.component.html',
  styleUrls: ['./load-document.component.css']
})
export class LoadDocumentComponent {
  @Input() generatepdfMsg: string | undefined
}
