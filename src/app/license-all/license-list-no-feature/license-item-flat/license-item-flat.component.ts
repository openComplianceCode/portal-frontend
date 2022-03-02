import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-license-item-flat',
  templateUrl: './license-item-flat.component.html',
  styleUrls: ['./license-item-flat.component.scss'],
})
export class LicenseItemFlatComponent implements OnInit {
  @Input() license: any;

  constructor() {}

  ngOnInit(): void {}

  showShortFeature(input: string): string {
    if (input.length > 10) {
      return input.substring(0, 10) + '...';
    }
    return input;
  }
}
