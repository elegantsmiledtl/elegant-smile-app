
export type DentalCase = {
  id: string;
  patientName: string;
  dentistName: string;
  toothNumbers: string;
  prosthesisType: string;
  material: string;
  shade: string;
  createdAt: any; // Using 'any' for Firestore ServerTimestamp flexibility
  notes?: string;
  photoDataUri?: string;
  source?: 'Mobile' | 'Desktop';
};
