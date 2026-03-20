export interface Address {
  street: string;
  city: string;
}

export interface Company {
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: Address;
  company?: Company;
  submittedForms: CareForm[];
}

export interface CareForm {
  id: string;
  type: 'Health Check' | 'Medication';
  date: string;
  data: any;
}
