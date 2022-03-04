import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit } from '@angular/core';
import { faGrinTongueSquint } from '@fortawesome/free-regular-svg-icons';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
const LIST_LICENSES = gql`
    query listLicenseBytName($name: String!){
        listLicensesByName(name: $name, limit: 8) {
            id,
            name,
            spdxName
        }
    }
`;
const GET_LICENSETAGS = gql`
    query getLicenseTag($id: Int!) {
      license(licenseID: $id) {
        name,
        licenseMainTags{
          mainTag{
            name,
            description
          }
        },
        canFeatureTags{
          name,
          description
        },
        mustFeatureTags{
          name,
          description
        },
        cannotFeatureTags{
          name,
          description
        }
      }
    }
`;
@Component({
  selector: 'app-license-compare',
  templateUrl: './license-compare.component.html',
  styleUrls: ['./license-compare.component.scss'],
  animations: [
    trigger('toast-animation', [
      state('show', style({
        top: '50%',
        opacity: 1,
      })),
      state('hide', style({
        top: '0',
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
export class LicenseCompareComponent implements OnInit {
  licenseTagInfos: any[] = new Array(6);
  licenses$: any;
  name = '';
  loading: boolean;
  error: any;
  login: boolean;
  avatarUrl: any;
  data: any;
  showToast: boolean = false;
  //目前在为哪一个位置选择license
  activeIndex: number;

  constructor(private apollo: Apollo, private el: ElementRef) {}

  ngOnInit(): void {
    document.addEventListener('click', (e) => {
      if (!this.el.nativeElement.querySelectorAll('.toast')[0].contains(e.target)) {
        this.showToast = false;
      }
    });
    console.log(this.licenseTagInfos[0]==undefined)
  }
  //id为license的id, index为是页面上选择的第几个license
  getLicenseTagInfo(id: number, index: number) {
    this.apollo.query<any>({
      query: GET_LICENSETAGS,
      variables: {id: id}
    }).subscribe((res) => {
      this.licenseTagInfos[this.activeIndex] = res.data.license;
      console.log(this.licenseTagInfos);
    });
  }

  filterName($event: Event): void {
    this.licenses$ = this.apollo.query<any>({
      query: LIST_LICENSES,
      variables: { name: this.name }
    }).pipe(
      map(({data, loading, error}) => {
      this.loading = loading;
      this.error = error;
      this.data = data;
      console.log("data: "+ JSON.stringify(data));
      return data?.listLicensesByName;
    }));
    this.licenses$.subscribe();
  }

  reverseShowToast(activeIndex: number){
    this.activeIndex = activeIndex;
    this.showToast = !this.showToast;
  }

  displayNoneToast() {
    if (this.showToast == false) {
      this.el.nativeElement.querySelectorAll('.toast')[0].style.display='none';
    }
  }

  displayBlockToast() {
    this.el.nativeElement.querySelectorAll('.toast')[0].style.display='block';
  }
}

//对某一个License的Tag信息
class LicenseTagInfo {
  name: string;
  licenseMainTags: LicenseMainTag[];
  canFeatureTags: FeatureTag[];
  mustFeatureTags: FeatureTag[];
  cannotFeatureTags: FeatureTag[];
}

class LicenseMainTag {
  mainTag: MainTag;
}

class MainTag {
  name: string;
  description: string;
}

class FeatureTag {
  name: string;
  description: string;
}