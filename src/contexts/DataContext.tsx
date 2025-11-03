import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, Patient, Appointment, TaskStatus, AppointmentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DataContextType {
  tasks: Task[];
  patients: Patient[];
  appointments: Appointment[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Mock data for demonstration
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review Patient Charts',
    description: 'Review and update patient charts for morning rounds',
    assignee: 'Dr. Sarah Johnson',
    status: TaskStatus.TODO,
    priority: 'high',
    dueDate: new Date('2025-01-15'),
    createdAt: new Date('2025-01-10')
  },
  {
    id: '2',
    title: 'Medication Inventory',
    description: 'Check and update medication inventory levels',
    assignee: 'Emily Chen',
    status: TaskStatus.IN_PROGRESS,
    priority: 'medium',
    dueDate: new Date('2025-01-14'),
    createdAt: new Date('2025-01-09')
  },
  {
    id: '3',
    title: 'Equipment Maintenance',
    description: 'Perform routine maintenance on ICU equipment',
    assignee: 'Michael Rodriguez',
    status: TaskStatus.DONE,
    priority: 'high',
    dueDate: new Date('2025-01-12'),
    createdAt: new Date('2025-01-08')
  }
];

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: new Date('1980-05-15'),
    address: '123 Main St, Anytown, USA',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    medicalHistory: [
      {
        condition: 'Hypertension',
        diagnosedDate: new Date('2020-03-10'),
        status: 'Ongoing'
      },
      {
        condition: 'Type 2 Diabetes',
        diagnosedDate: new Date('2019-11-22'),
        status: 'Managed'
      }
    ],
    allergies: ['Penicillin', 'Shellfish'],
    bloodType: 'A+',
    createdAt: new Date('2025-01-01')
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+1 (555) 234-5678',
    dateOfBirth: new Date('1995-12-08'),
    address: '456 Oak Ave, Somewhere, USA',
    emergencyContact: {
      name: 'Carlos Garcia',
      phone: '+1 (555) 876-5432',
      relationship: 'Father'
    },
    medicalHistory: [
      {
        condition: 'Asthma',
        diagnosedDate: new Date('2010-06-15'),
        status: 'Controlled'
      }
    ],
    allergies: ['Dust mites'],
    bloodType: 'O-',
    createdAt: new Date('2025-01-02')
  }
];

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date('2025-01-15T09:00:00'),
    duration: 30,
    type: 'Consultation',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Follow-up appointment for hypertension monitoring',
    createdAt: new Date('2025-01-10')
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Maria Garcia',
    doctorName: 'Dr. Sarah Johnson',
    date: new Date('2025-01-15T10:30:00'),
    duration: 45,
    type: 'Telemedicine',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Remote consultation for asthma management',
    createdAt: new Date('2025-01-11')
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('medops_tasks');
    const storedPatients = localStorage.getItem('medops_patients');
    const storedAppointments = localStorage.getItem('medops_appointments');

    setTasks(storedTasks ? JSON.parse(storedTasks) : mockTasks);
    setPatients(storedPatients ? JSON.parse(storedPatients) : mockPatients);
    setAppointments(storedAppointments ? JSON.parse(storedAppointments) : mockAppointments);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('medops_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('medops_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('medops_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    const newPatient: Patient = {
      ...patient,
      id: uuidv4(),
      createdAt: new Date()
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === id ? { ...patient, ...updates } : patient
    ));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: uuidv4(),
      createdAt: new Date()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(appointment => 
      appointment.id === id ? { ...appointment, ...updates } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  return (
    <DataContext.Provider value={{
      tasks,
      patients,
      appointments,
      addTask,
      updateTask,
      deleteTask,
      addPatient,
      updatePatient,
      deletePatient,
      addAppointment,
      updateAppointment,
      deleteAppointment
    }}>
      {children}
    </DataContext.Provider>
  );
}