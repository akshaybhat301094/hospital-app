import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  Form,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ActionType,
  ICommonConfig,
  IDepartmentData,
  IHospitalData,
} from 'src/app/models/common-models';
import { UtilService } from 'src/app/services/util.service';

export interface Idummy {
  [key: string]: any;
}

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
})
export class CommonLayoutComponent implements OnInit, OnChanges {
  @Input()
  public config!: ICommonConfig;
  @Input()
  public entityData!: Array<IHospitalData> | Array<IDepartmentData>;
  @Output()
  public userAction: EventEmitter<any> = new EventEmitter();
  public isAsc = false;
  public enableAddMode = true;
  public controls: FormArray = new FormArray([]);
  public addForm: FormGroup = new FormGroup({});
  public bannerMessage = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.entityData) {
      this.initializeForm();
    } else {
      this.initializeAddForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entityData.currentValue) {
      this.initializeForm();
    } else {
      this.initializeAddForm();
    }
  }

  /**
   * @param index index of form group
   * @param field field name of entity
   * @returns form control
   */
  public getControl(index: number, field: string): FormControl {
    return this.controls.at(index).get(field) as FormControl;
  }

  /**
   * @param field field name of entity
   * @returns form control
   */
  public getAddControl(field: string): FormControl {
    return this.addForm.get(field) as FormControl;
  }

  /**
   * function used to toggle the sort order between ascending and descending
   */
  public sortByName(): void {
    const sortKey = this.config.sortKey as string;
    this.entityData.sort((a, b) =>
      this.isAsc
        ? new UtilService().ascending(a, b, sortKey)
        : new UtilService().descending(a, b, sortKey)
    );
    this.isAsc = !this.isAsc;
    this.initializeForm();
  }

  /**
   * maked a row editable
   * @param idx index of the row we want to edit
   */
  public editRow(idx: number): void {
    this.entityData.forEach((item) => {
      item.editMode = false;
    });
    this.entityData[idx].editMode = true;
    this.enableAddMode = false;
  }

  /**
   * deletes a particular row
   * @param idx index of row we want to delete
   */
  public deleteRow(idx: number): void {
    const rawData = (this.controls.at(idx) as FormGroup).getRawValue();
    this.userAction.emit({
      actionType: ActionType.DELETE,
      data: rawData,
    });
    this.entityData.splice(idx, 1);
    if (this.entityData.length) {
      this.initializeForm();
    }
  }

  /**
   * updates the changes made to the particular row
   * @param idx index of the row we want to update
   */
  public saveEdit(idx: number): void {
    if (this.controls?.at(idx).valid) {
      const rawData = (this.controls.at(idx) as FormGroup).getRawValue();
      new UtilService().addMissingValues(this.entityData[idx], rawData);
      this.userAction.emit({
        actionType: ActionType.PATCH,
        data: rawData,
      });
      this.entityData[idx] = rawData;
    }
  }

  /**
   * disables the row edit action for the specified row
   * @param idx index of the row we want to cancel editing
   */
  public cancelEdit(idx: number): void {
    this.entityData[idx].editMode = false;
  }

  /**
   * navigates to the detailed view of the particular department
   * @param idx index of the row
   */
  public navigateToDept(idx: number): void {
    const key = this.config.columnConfig[0].field;
    const hospitalName = (this.controls.at(idx).get(key) as FormControl).value;
    this.router.navigate(['department'], {
      queryParams: {
        name: hospitalName,
      },
    });
  }

  /**
   * function used to navigate back to the hospital view
   */
  public navigateBack(): void {
    this.router.navigate(['hospital']);
  }

  /**
   * function used to add a new row in the form
   */
  public addData(): void {
    if (this.addForm.valid) {
      const key = this.config.columnConfig[0].field;
      const rawData = this.addForm.getRawValue();
      const idx = this.entityData.findIndex(
        (entity: any) => entity[key] === rawData[key]
      );
      if (idx) {
        this.bannerMessage = 'Field already exists';
        this.initializeAddForm();
        setTimeout(() => {
          this.bannerMessage = '';
        }, 5000);
        return;
      }
      this.userAction.emit({
        actionType: ActionType.POST,
        data: rawData,
      });
      this.entityData.push(rawData);
      this.initializeForm();
    }
  }

  /**
   * function used to enable adding new data in row
   */
  public enableAdd(): void {
    this.enableAddMode = true;
    this.entityData.forEach((item) => {
      item.editMode = false;
    });
  }

  /**
   * function used to create the dynamic form for provided data
   */
  private initializeForm(): void {
    const toGroups = (
      this.entityData as Array<IHospitalData | IDepartmentData>
    ).map((entity) => {
      const formControl: any = {};
      this.config.columnConfig.forEach((col) => {
        formControl[col.field] = new FormControl(
          (entity as any)[col.field],
          Validators.required
        );
      });
      return new FormGroup(formControl);
    });
    this.controls = new FormArray(toGroups);

    this.initializeAddForm();
  }

  /**
   * function used to create the add form controls
   */
  private initializeAddForm(): void {
    const formcontrol: any = {};
    this.config.columnConfig.forEach((col) => {
      formcontrol[col.field] = new FormControl('', Validators.required);
    });
    this.addForm = new FormGroup(formcontrol);
  }
}
