import { createContext } from "react";

export type Role = "ADMIN" | "PHARMACIST" | "CASHIER" | "PATIENT";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: Role;
  phone?: string | null;
  cashierAccess?: boolean;
  pharmacyReconciliationAccess?: boolean;
  mustChangePassword?: boolean;
  lastLoginAt?: string | null;
  passwordChangedAt?: string | null;
  patientProfile?: {
    id: number;
    patientNumber: string;
    dateOfBirth?: string | null;
    address?: string | null;
    allergies?: string | null;
    chronicConditions?: string | null;
  } | null;
}

export interface AuthValue {
  user: User | null;
  login(email: string, password: string): Promise<void>;
  register(data: object): Promise<void>;
  passwordChanged(): void;
  acceptSession(data: { token: string; user: User }): void;
  logout(): Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);
