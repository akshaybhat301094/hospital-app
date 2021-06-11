import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import {
  ActionType,
  ICommonConfig,
  IDepartmentData,
  IUserAction,
  ViewType,
} from 'src/app/models/common-models';
import { HospitalService } from 'src/app/services/hospital.service';
import { BaseComponent } from '../base-component/base.component';

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.scss'],
})
export class DepartmentViewComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public commonConfig!: ICommonConfig;
  public departmentData!: Array<IDepartmentData>;
  private hospitalName!: string;
  constructor(private service: HospitalService, private route: ActivatedRoute) {
    super();
    this.route.queryParams.subscribe((param) => {
      if (param.name) {
        this.hospitalName = param.name;
      }
    });
  }

  ngOnInit(): void {
    this.initializeConfig();
    this.service
      .getDepartmentData()
      .pipe(takeUntil(this.componentDestroyed))
      .subscribe((response: IDepartmentData[]) => {
        this.departmentData = response.filter(
          (res) => res.hospitalname === this.hospitalName
        );
      });
  }

  /**
   * department grid config
   */
  private initializeConfig(): void {
    this.commonConfig = {
      title: 'Department List',
      callerModule: ViewType.DEPARTMENT,
      enableBack: true,
      enableViewMode: false,
      sortLabel: 'Department',
      sortKey: 'departmentname',
      columnConfig: [
        {
          title: 'Department Name',
          field: 'departmentname',
        },
        {
          title: 'Head of Department',
          field: 'head',
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
          .deleteDepartment(userAction.data as IDepartmentData)
          .pipe(takeUntil(this.componentDestroyed))
          .subscribe((res) => {
            console.log(res);
          });
        break;
      case ActionType.PATCH:
        this.service
          .updateDepartmentData(userAction.data as IDepartmentData)
          .pipe(takeUntil(this.componentDestroyed))
          .subscribe(() => {});
        break;
      case ActionType.POST:
        const payload: IDepartmentData = {
          ...(userAction.data as IDepartmentData),
          hospitalname: this.hospitalName,
        };
        this.service
          .addDepartmentData(payload)
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
