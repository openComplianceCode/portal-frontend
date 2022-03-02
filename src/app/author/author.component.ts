import { Component, OnInit } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
})
export class AuthorComponent implements OnInit {
  faGithub = faGithub;
  breads: any = [{ url: '/', label: 'Home' }, { label: '作者' }];
  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {}
}
