import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Flag, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Task, TaskStatus } from '../types';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { addTask, updateTask, deleteTask } = useData();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    status: TaskStatus.TODO,
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        assignee: task.assignee,
        status: task.status,
        priority: task.priority,
        dueDate: format(new Date(task.dueDate), 'yyyy-MM-dd')
      });
    } else {
      setFormData({
        title: '',
        description: '',
        assignee: '',
        status: TaskStatus.TODO,
        priority: 'medium',
        dueDate: format(new Date(), 'yyyy-MM-dd')
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      updateTask(task.id, {
        ...formData,
        dueDate: new Date(formData.dueDate)
      });
      toast.success('Task updated successfully');
    } else {
      addTask({
        ...formData,
        dueDate: new Date(formData.dueDate)
      });
      toast.success('Task created successfully');
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      toast.success('Task deleted successfully');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
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
              Task Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Assign to..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={TaskStatus.TODO}>To Do</option>
                <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                <option value={TaskStatus.DONE}>Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <div className="relative">
                <Flag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-between pt-6">
            {task && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            )}
            
            <div className="flex space-x-3 ml-auto">
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
                {task ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}