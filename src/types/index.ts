export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department: string | null;
  avatar?: string;
}

export enum UserRole {
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  ADMIN = 'admin',
  PATIENT = 'patient'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: Date;
  createdAt: Date;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done'
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: MedicalRecord[];
  allergies: string[];
  bloodType: string;
  createdAt: Date;
}

export interface MedicalRecord {
  condition: string;
  diagnosedDate: Date;
  status: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: Date;
  duration: number;
  type: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: Date;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface VideoCallSession {
  id: string;
  patientId: string;
  doctorId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'active' | 'ended';
}