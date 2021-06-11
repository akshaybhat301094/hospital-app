export interface IHospitalData {
  hospitalname: string;
  contactnumber: string;
  editMode?: boolean;
}

export interface IDepartmentData extends IHospitalData {
  departmentname: string;
  head: string;
}

export enum ViewType {
  HOSPITAL = 0,
  DEPARTMENT,
}

export interface ICommonConfig {
  title: string;
  enableBack?: boolean;
  enableViewMode?: boolean;
  callerModule?: ViewType;
  columnConfig: Array<IColumnConfig>;
  sortLabel?: string;
  sortKey?: string;
}

export interface IColumnConfig {
  title: string;
  field: string;
}

export interface IResponseData {
  success: boolean;
  msg: string;
}

export enum ActionType {
  POST = 0,
  GET,
  PATCH,
  DELETE,
}

export interface IUserAction {
  actionType: ActionType;
  data: IHospitalData | IDepartmentData;
}
