export interface Employee {
  id: string;
  name: string;
  userName: string;
  role: string;
  isDeleted: boolean;
}

export interface EmployeeFormValues {
  name: string;
  userName: string;
  password: string;
  role?: string;
}

export interface EmployeeResponse {
  id: string;
  name: string;
  userName: string;
  role: string;
  isDeleted: boolean;
  token?: string;
  message?: string;
} 