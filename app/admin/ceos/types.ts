export interface Ceo {
  id: number;
  name: string;
  userName: string;
  businessId: number;
  business?: { id: number; name: string };
  role?: string;
}

export interface CeoFormValues {
  name: string;
  userName: string;
  password: string;
  businessId: number | '';
} 