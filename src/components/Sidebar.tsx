import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  Calendar, 
  Video,
  Activity,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN] },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN] },
  { name: 'Patients', href: '/patients', icon: Users, roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN] },
  { name: 'Appointments', href: '/appointments', icon: Calendar, roles: [UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.PATIENT] },
  { name: 'Telemedicine', href: '/telemedicine', icon: Video, roles: [UserRole.DOCTOR, UserRole.PATIENT] },
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">MedOps</span>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}