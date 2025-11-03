import React, { useState } from 'react';
import { Video, Phone, Clock, User, Calendar, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export function Telemedicine() {
  const navigate = useNavigate();
  const { appointments, patients } = useData();
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');

  const telemedicineAppointments = appointments.filter(
    appointment => appointment.type === 'Telemedicine'
  );

  const handleStartCall = (appointmentId?: string) => {
    const callRoomId = appointmentId || uuidv4();
    navigate(`/video-call/${callRoomId}`);
  };

  const handleJoinCall = () => {
    if (roomId.trim()) {
      navigate(`/video-call/${roomId}`);
    } else {
      toast.error('Please enter a room ID');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Telemedicine</h1>
        <button
          onClick={() => handleStartCall()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Video className="h-4 w-4" />
          <span>Start New Call</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Start Video Call</span>
                </div>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Create a new secure video call room for patient consultation
              </p>
              <button
                onClick={() => handleStartCall()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Call
              </button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Join Call</span>
                </div>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Join an existing video call using a room ID
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleJoinCall}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  Join Call
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Telemedicine Appointments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Scheduled Video Calls</h2>
          </div>
          
          <div className="p-6">
            {telemedicineAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No scheduled telemedicine appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {telemedicineAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.doctorName}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-500 mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {format(new Date(appointment.date), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(appointment.date), 'h:mm a')}
                        </div>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mb-3">{appointment.notes}</p>
                    )}
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleStartCall(appointment.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Video className="h-4 w-4" />
                        <span>Start Call</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Use Telemedicine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Start a Call</h3>
            <p className="text-sm text-gray-600">
              Click "Start New Call" to create a secure video room and share the room ID with your patient
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Join a Call</h3>
            <p className="text-sm text-gray-600">
              Enter the room ID provided by your doctor or patient to join an existing call
            </p>
          </div>
          
          <div className="text-center">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Scheduled Calls</h3>
            <p className="text-sm text-gray-600">
              View and start calls for scheduled telemedicine appointments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}