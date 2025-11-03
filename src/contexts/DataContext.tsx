import React, { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addTask as addTaskAction,
  updateTask as updateTaskAction,
  deleteTask as deleteTaskAction,
  addPatient as addPatientAction,
  updatePatient as updatePatientAction,
  deletePatient as deletePatientAction,
  addAppointment as addAppointmentAction,
  updateAppointment as updateAppointmentAction,
  deleteAppointment as deleteAppointmentAction,
} from '../store/dataSlice';
import { Task, Patient, Appointment } from '../types';

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

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.data.tasks);
  const patients = useAppSelector((state) => state.data.patients);
  const appointments = useAppSelector((state) => state.data.appointments);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    dispatch(addTaskAction(task));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    dispatch(updateTaskAction({ id, updates }));
  };

  const deleteTask = (id: string) => {
    dispatch(deleteTaskAction(id));
  };

  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt'>) => {
    dispatch(addPatientAction(patient));
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    dispatch(updatePatientAction({ id, updates }));
  };

  const deletePatient = (id: string) => {
    dispatch(deletePatientAction(id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    dispatch(addAppointmentAction(appointment));
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    dispatch(updateAppointmentAction({ id, updates }));
  };

  const deleteAppointment = (id: string) => {
    dispatch(deleteAppointmentAction(id));
  };

  return (
    <DataContext.Provider
      value={{
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
        deleteAppointment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
