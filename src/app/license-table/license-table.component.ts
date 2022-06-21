import { Component, OnInit, } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

const LIST_LICENSE_TABLE = gql`
  query getLicenseTable {
    listApprovedLicenses {
      id,
      name,
      spdxName,
      oeApproved,
      fsfApproved,
      osiApproved,
      lowRisk
    }
  }
`;
@Component({
  selector: 'app-license-table',
  templateUrl: './license-table.component.html',
  styleUrls: ['./license-table.component.scss']
})
export class LicenseTableComponent implements OnInit {
  licenseList: License[];
  loading: boolean = true;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    setTimeout(() => this.getLicenseTable(), 100);
  }

  getLicenseTable() {
    this.apollo
      .query<any>({
        query: LIST_LICENSE_TABLE,
      })
      .subscribe(({data}) => {
        this.loading = false;
        this.licenseList = (<any>data).listApprovedLicenses;
      });
  }

  isEllipsisActive(e: any) {
    return (e.offsetWidth < e.scrollWidth);
  }
}

class License {
  id: string;
  name: string;
  spdxName: string;
  oeApproved: string;
  fsfApproved: string;
  osiApproved: string;
  lowRisk: string;
}