export type DentalCase = {
  id: string;
  patientName: string;
  dentistName: string;
  toothNumbers: string;
  prosthesisType: string;
  material: string;
  shade: string;
  notes?: string;
  source?: 'Mobile' | 'Desktop';
};
