import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Video, FileText } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Appointment, AppointmentStatus } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: Appointment | null;
}

export function AppointmentModal({ isOpen, onClose, appointment }: AppointmentModalProps) {
  const { patients, addAppointment, updateAppointment } = useData();
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    doctorName: '',
    date: '',
    time: '',
    duration: 30,
    type: 'Consultation',
    status: AppointmentStatus.SCHEDULED,
    notes: ''
  });

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.date);
      setFormData({
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        date: format(appointmentDate, 'yyyy-MM-dd'),
        time: format(appointmentDate, 'HH:mm'),
        duration: appointment.duration,
        type: appointment.type,
        status: appointment.status,
        notes: appointment.notes || ''
      });
    } else {
      setFormData({
        patientId: '',
        patientName: '',
        doctorName: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00',
        duration: 30,
        type: 'Consultation',
        status: AppointmentStatus.SCHEDULED,
        notes: ''
      });
    }
  }, [appointment]);

  const handlePatientChange = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    setFormData({
      ...formData,
      patientId,
      patientName: patient?.name || ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentDate = new Date(`${formData.date}T${formData.time}`);
    
    const appointmentData = {
      patientId: formData.patientId,
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      date: appointmentDate,
      duration: formData.duration,
      type: formData.type,
      status: formData.status,
      notes: formData.notes
    };

    if (appointment) {
      updateAppointment(appointment.id, appointmentData);
      toast.success('Appointment updated successfully');
    } else {
      addAppointment(appointmentData);
      toast.success('Appointment booked successfully');
    }
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {appointment ? 'Edit Appointment' : 'Book New Appointment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <select
                required
                value={formData.patientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <input
              type="text"
              required
              value={formData.doctorName}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter doctor name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                required
                min="15"
                max="180"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <div className="relative">
                <Video className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Telemedicine">Telemedicine</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {appointment ? 'Update' : 'Book'} Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}