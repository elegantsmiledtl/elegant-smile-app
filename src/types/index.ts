export type DentalCase = {
  id: string;
  patientName: string;
  dentistName: string;
  dueDate: Date;
  toothNumbers: string;
  prosthesisType: string;
  material: string;
  shade: string;
  notes?: string;
  source?: 'Mobile' | 'Desktop';
};
