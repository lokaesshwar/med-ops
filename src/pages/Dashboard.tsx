import React from 'react';
import { Users, Calendar, CheckSquare, Video, TrendingUp, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { TaskStatus, AppointmentStatus } from '../types';
import { format } from 'date-fns';

export function Dashboard() {
  const { tasks, patients, appointments } = useData();
  const { user } = useAuth();

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === TaskStatus.DONE).length,
    pending: tasks.filter(t => t.status === TaskStatus.TODO).length,
    inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length
  };

  const appointmentStats = {
    today: appointments.filter(a => 
      format(new Date(a.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
    ).length,
    upcoming: appointments.filter(a => 
      a.status === AppointmentStatus.SCHEDULED && new Date(a.date) > new Date()
    ).length,
    completed: appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length
  };

  const upcomingAppointments = appointments
    .filter(a => a.status === AppointmentStatus.SCHEDULED && new Date(a.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentTasks = tasks
    .filter(t => t.status !== TaskStatus.DONE)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <div className="text-sm text-gray-500">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Active patients</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{appointmentStats.today}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{appointmentStats.upcoming} upcoming</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{taskStats.pending}</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>{taskStats.inProgress} in progress</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Telemedicine Sessions</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Video className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Available now</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="p-6">
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(appointment.date), 'MMM d, yyyy h:mm a')}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{appointment.duration}min</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          </div>
          <div className="p-6">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No pending tasks</p>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      task.priority === 'high' ? 'bg-red-100' : 
                      task.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <CheckSquare className={`h-5 w-5 ${
                        task.priority === 'high' ? 'text-red-600' : 
                        task.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      <div className="text-sm text-gray-500">
                        Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}