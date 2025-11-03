import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, Patient, Appointment, TaskStatus, AppointmentStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface DataState {
  tasks: Task[];
  patients: Patient[];
  appointments: Appointment[];
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

// Helper function to load from localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return defaultValue;
      
      // Convert date strings back to Date objects
      return parsed.map((item: any) => ({
        ...item,
        ...(item.dueDate && { dueDate: new Date(item.dueDate) }),
        ...(item.dateOfBirth && { dateOfBirth: new Date(item.dateOfBirth) }),
        ...(item.date && { date: new Date(item.date) }),
        ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
        ...(item.medicalHistory && {
          medicalHistory: item.medicalHistory.map((record: any) => ({
            ...record,
            ...(record.diagnosedDate && { diagnosedDate: new Date(record.diagnosedDate) }),
          })),
        }),
      }));
    }
  } catch (e) {
    console.error(`Error loading ${key} from localStorage:`, e);
  }
  return defaultValue;
};

const initialState: DataState = {
  tasks: loadFromStorage('medops_tasks', mockTasks),
  patients: loadFromStorage('medops_patients', mockPatients),
  appointments: loadFromStorage('medops_appointments', mockAppointments),
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt'>>) => {
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date()
      };
      state.tasks.push(newTask);
      localStorage.setItem('medops_tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload.updates };
        localStorage.setItem('medops_tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('medops_tasks', JSON.stringify(state.tasks));
    },
    addPatient: (state, action: PayloadAction<Omit<Patient, 'id' | 'createdAt'>>) => {
      const newPatient: Patient = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date()
      };
      state.patients.push(newPatient);
      localStorage.setItem('medops_patients', JSON.stringify(state.patients));
    },
    updatePatient: (state, action: PayloadAction<{ id: string; updates: Partial<Patient> }>) => {
      const index = state.patients.findIndex(patient => patient.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = { ...state.patients[index], ...action.payload.updates };
        localStorage.setItem('medops_patients', JSON.stringify(state.patients));
      }
    },
    deletePatient: (state, action: PayloadAction<string>) => {
      state.patients = state.patients.filter(patient => patient.id !== action.payload);
      localStorage.setItem('medops_patients', JSON.stringify(state.patients));
    },
    addAppointment: (state, action: PayloadAction<Omit<Appointment, 'id' | 'createdAt'>>) => {
      const newAppointment: Appointment = {
        ...action.payload,
        id: uuidv4(),
        createdAt: new Date()
      };
      state.appointments.push(newAppointment);
      localStorage.setItem('medops_appointments', JSON.stringify(state.appointments));
    },
    updateAppointment: (state, action: PayloadAction<{ id: string; updates: Partial<Appointment> }>) => {
      const index = state.appointments.findIndex(appointment => appointment.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = { ...state.appointments[index], ...action.payload.updates };
        localStorage.setItem('medops_appointments', JSON.stringify(state.appointments));
      }
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
      localStorage.setItem('medops_appointments', JSON.stringify(state.appointments));
    },
    loadDataFromStorage: (state) => {
      state.tasks = loadFromStorage('medops_tasks', mockTasks);
      state.patients = loadFromStorage('medops_patients', mockPatients);
      state.appointments = loadFromStorage('medops_appointments', mockAppointments);
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  addPatient,
  updatePatient,
  deletePatient,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  loadDataFromStorage,
} = dataSlice.actions;

export default dataSlice.reducer;

