import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bread',
  templateUrl: './bread.component.html',
  styleUrls: ['./bread.component.scss'],
})
export class BreadComponent implements OnInit {
  @Input() breads: any[] = [];

  constructor() {}

  ngOnInit(): void {}
}
