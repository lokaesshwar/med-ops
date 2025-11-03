import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock, User } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Appointment } from '../types';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
}

export function AppointmentCalendar({ appointments, onEditAppointment }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
          
          {monthDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-[120px] ${
                  !isSameMonth(day, currentDate) ? 'text-gray-400' : 'text-gray-900'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-blue-600' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      onClick={() => onEditAppointment(appointment)}
                      className="bg-blue-100 text-blue-700 text-xs p-1 rounded cursor-pointer hover:bg-blue-200 transition-colors"
                    >
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{format(new Date(appointment.date), 'HH:mm')}</span>
                      </div>
                      <div className="truncate">{appointment.patientName}</div>
                    </div>
                  ))}
                  
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}