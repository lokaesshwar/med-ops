import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">MedOps</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user?.name}</div>
                <div className="text-gray-500 capitalize">{user?.role}</div>
              </div>
            </div>
            
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}