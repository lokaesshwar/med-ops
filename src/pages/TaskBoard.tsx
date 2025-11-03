import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Calendar, User, Flag, MoreHorizontal } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Task, TaskStatus } from '../types';
import { format } from 'date-fns';
import { TaskModal } from '../components/TaskModal';
import toast from 'react-hot-toast';

const columns = [
  { id: TaskStatus.TODO, title: 'To Do', color: 'bg-gray-100' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-100' },
  { id: TaskStatus.DONE, title: 'Done', color: 'bg-green-100' }
];

export function TaskBoard() {
  const { tasks, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId !== destination.droppableId) {
      updateTask(draggableId, { status: destination.droppableId as TaskStatus });
      toast.success('Task moved successfully');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Task</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div key={column.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className={`p-4 ${column.color} rounded-t-lg`}>
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {tasks.filter(task => task.status === column.id).length} tasks
                </p>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="p-4 space-y-3 min-h-[200px]"
                  >
                    {tasks
                      .filter(task => task.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleEditTask(task)}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                              
                              <div className="flex items-center space-x-2 mb-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{task.assignee}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        task={editingTask}
      />
    </div>
  );
}