import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'lodash';
import Clipboard from 'clipboard';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-lv-meng',
  templateUrl: './lv-meng.component.html',
  styleUrls: ['./lv-meng.component.scss'],
  animations: [
    trigger('toast-animation', [
      state('show', style({
        top: '150%',
        opacity: 1,
      })),
      state('hide', style({
        top: '120%',
        opacity: 0.5,
      })),
      transition('show => hide', [
        animate('0.3s')
      ]),
      transition('hide => show', [
        animate('0.3s')
      ]),
    ]),
  ]
})
export class LvMengComponent implements OnInit {
  loading: boolean;
  text: string;
  wordsLength: number;
  lvMengService: LvMengService;
  result: Result;
  hasResult: boolean;
  breads: any = [{ url: '/', label: 'Home' }, { label: '吕蒙' }];
  isResultConsistent = false;
  consistentLicense = "";
  hasFullTextMatch = false;
  fullTextMatchLicense = "";
  showToast: boolean = false;
  @ViewChild("toast") toast: ElementRef;
  clipboard: Clipboard;

  constructor(http: HttpClient, lvMengService: LvMengService) {
    this.loading = false;
    this.text = '';
    this.wordsLength = 0;
    this.lvMengService = lvMengService;
    this.result = {} as any;
    this.hasResult = false;
  }

  ngOnInit(): void {
    this.clipboard = new Clipboard('.copy-icon');
    this.clipboard.on('success', (e) => {
      // console.log(this.showToast)
      this.showToast = !this.showToast;
      window.setTimeout(()=>{
        this.showToast = !this.showToast;
      }, 200);
    });
  }

  ngOnDestroy(): void {
    // 每次生成这个component会生成一个clipboard，所以component销毁时clipboard也要销毁 
    this.clipboard.destroy();
  }

  updateWordsLength() {
    this.wordsLength = this.text.length;
  }

  textIdentify() {
    this.loading = true;
    this.hasResult = false;
    this.isResultConsistent = false;
    this.hasFullTextMatch = false;
    this.lvMengService.identify(this.text).subscribe((data) => {
      this.loading = false;
      this.result = data;
      this.hasResult = true;
      // 设定的规则是，如果有ExactFullText匹配则不要后面的行，直接提示完全文本匹配的
      this.filter(data);
      this.isResultConsistent = (data.summary == "不同算法扫描都指向同一最有可能的license");
    });
  }

  filter(data: Result) {    
    let scanResultList = data.scanResultList;
    for (let i = 0; i < scanResultList.length; i++) {
      for (let j = 0; j < scanResultList[i].licenses.length; j++) {
        if (data.summary == "不同算法扫描都指向同一最有可能的license") {
          this.consistentLicense = scanResultList[i].licenses[0].spdx_license_identifier; 
        }
        if (scanResultList[i].licenses[j].sim_type == "ExactFullText") {
          this.hasFullTextMatch = true;
          this.fullTextMatchLicense = scanResultList[i].licenses[j].spdx_license_identifier;
          scanResultList[i].licenses = scanResultList[i].licenses.slice(j, j + 1);
        }
      }
    }
  }

  displayNoneToast(toast: HTMLDivElement) {
    if (this.showToast == false) {
      toast.style.display='none';
    }
  }

  displayBlockToast(toast: HTMLDivElement) {
    toast.style.display='block';
  }

  windowOpen(num: number) {
    window.open(`/license/${num}`,'_blank');
  }
}

@Injectable()
export class LvMengService {
  http: HttpClient;
  constructor(http: HttpClient) {
    this.http = http;
  }

  identify(query: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    var requestBody: string = `{"licenseText": ${JSON.stringify(query)}}`;
    return this.http.post<Result>('/lvmeng/textIdentify', requestBody, {
      headers: headers,
    });
  }
}

class Result {
  summary: string;
  scanResultList: ScanResult[];
}

class ScanResult {
  algorithm: string;
  licenses: License[];
}

class License {
  id: string;
  spdx_license_identifier: string;
  name: string;
  sim_score: string;
  sim_type: string;
}
