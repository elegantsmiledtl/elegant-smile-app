// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import type { DentalCase } from '@/types';

const firebaseConfig = {
  projectId: "elegant-smile-r6jex",
  appId: "1:684195793511:web:ff41b829e9a2b0c0dd62c2",
  storageBucket: "elegant-smile-r6jex.firebasestorage.app",
  apiKey: "AIzaSyDFrcocVla_sSA4-rkX6oL8Q35X0kBLQgA",
  authDomain: "elegant-smile-r6jex.firebaseapp.com",
  messagingSenderId: "684195793511"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const casesCollection = collection(db, 'dentalCases');

// A function to get all cases
export const getCases = async (): Promise<DentalCase[]> => {
  const snapshot = await getDocs(casesCollection);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as DentalCase;
  });
};

// A function to get cases for a specific doctor
export const getCasesByDoctor = async (dentistName: string): Promise<DentalCase[]> => {
  const q = query(casesCollection, where("dentistName", "==", dentistName));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as DentalCase;
  });
};


// A function to add a new case
export const addCase = async (newCase: Omit<DentalCase, 'id'>) => {
  const docRef = await addDoc(casesCollection, newCase);
  return docRef.id;
};

// A function to update a case
export const updateCase = async (caseId: string, updatedCase: Partial<DentalCase>) => {
  const caseDoc = doc(db, 'dentalCases', caseId);
  await updateDoc(caseDoc, updatedCase);
};

// A function to delete a case
export const deleteCase = async (caseId: string) => {
  const caseDoc = doc(db, 'dentalCases', caseId);
  await deleteDoc(caseDoc);
};
