import React, { useState } from 'react';
import { Plus, Calendar, Clock, User, Video, Phone, MoreHorizontal } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Appointment, AppointmentStatus } from '../types';
import { format } from 'date-fns';
import { AppointmentModal } from '../components/AppointmentModal';
import { AppointmentCalendar } from '../components/AppointmentCalendar';
import toast from 'react-hot-toast';

export function Appointments() {
  const { appointments, updateAppointment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    updateAppointment(appointmentId, { status: newStatus });
    toast.success('Appointment status updated');
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED: return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.CONFIRMED: return 'bg-green-100 text-green-800';
      case AppointmentStatus.COMPLETED: return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar appointments={appointments} onEditAppointment={handleEditAppointment} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patientName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(appointment.date), 'MMM d, yyyy')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {format(new Date(appointment.date), 'h:mm a')} ({appointment.duration}min)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {appointment.type === 'Telemedicine' ? (
                          <Video className="h-4 w-4 mr-1" />
                        ) : (
                          <Phone className="h-4 w-4 mr-1" />
                        )}
                        {appointment.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment.id, e.target.value as AppointmentStatus)}
                        className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(appointment.status)}`}
                      >
                        <option value={AppointmentStatus.SCHEDULED}>Scheduled</option>
                        <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
                        <option value={AppointmentStatus.COMPLETED}>Completed</option>
                        <option value={AppointmentStatus.CANCELLED}>Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        appointment={editingAppointment}
      />
    </div>
  );
}