import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ActionType,
  ICommonConfig,
  IHospitalData,
  IUserAction,
  ViewType,
} from 'src/app/models/common-models';
import { HospitalService } from 'src/app/services/hospital.service';
import { BaseComponent } from '../base-component/base.component';

@Component({
  selector: 'app-hospital-view',
  templateUrl: './hospital-view.component.html',
  styleUrls: ['./hospital-view.component.scss'],
})
export class HospitalViewComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public commonConfig!: ICommonConfig;
  public hospitalData!: Array<IHospitalData>;
  public isReady = false;
  constructor(private service: HospitalService) {
    super();
  }

  ngOnInit(): void {
    this.initializeConfig();
    this.service
      .getHospitalData()
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe((res) => {
        this.isReady = true;
        this.hospitalData = res;
      });
  }

  /**
   * hospital grid config
   */
  private initializeConfig(): void {
    this.commonConfig = {
      title: 'Hospital List',
      callerModule: ViewType.HOSPITAL,
      enableBack: false,
      enableViewMode: true,
      sortLabel: 'Hospital',
      sortKey: 'hospitalname',
      columnConfig: [
        {
          title: 'Hospital Name',
          field: 'hospitalname',
        },
        {
          title: 'Contact Number',
          field: 'contactnumber',
        },
      ],
    };
  }

  /**
   * function used to trigger post, put, delete operation
   * @param userAction user action object to identify tge type of action
   */
  public triggerUserAction(userAction: IUserAction): void {
    switch (userAction.actionType) {
      case ActionType.DELETE:
        this.service
          .deleteHospital((userAction.data as IHospitalData).hospitalname)
          .pipe(takeUntil(this.componentDestroyed))
          .subscribe((res) => {
            console.log(res);
          });
        break;
      case ActionType.PATCH:
        this.service
          .updateHospitalData(userAction.data as IHospitalData)
          .pipe(takeUntil(this.componentDestroyed))
          .subscribe(() => {});
        break;
      case ActionType.POST:
        this.service
          .addHospitalData(userAction.data as IHospitalData)
          .pipe(takeUntil(this.componentDestroyed))
          .subscribe(() => {});
        break;
      default:
        break;
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
