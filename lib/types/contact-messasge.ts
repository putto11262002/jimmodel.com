export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ContactMesasgeCreateInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  message: string;
};
