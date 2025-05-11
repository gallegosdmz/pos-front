export interface Business {
  id: number;
  name: string;
  email: string;
}

export interface BusinessFormValues {
  name: string;
  email: string;
}

export interface CreateBusinessResponse {
  id: number;
  name: string;
  email: string;
} 