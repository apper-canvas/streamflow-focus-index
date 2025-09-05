import React, { useState, useEffect } from "react";
import { format, isPast, isToday } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

const TaskWidget = ({ contactId }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const contactTasks = await taskService.getByContactId(contactId);
      setTasks(contactTasks);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [contactId]);

  const handleAddTask = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      dueDate: ""
    });
    setEditingTask(null);
    setIsAddModalOpen(true);
  };

  const handleEditTask = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ""
    });
    setEditingTask(task);
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      const taskData = {
        ...formData,
        contactId,
        dueDate: formData.dueDate ? new Date(formData.dueDate + "T00:00:00.000Z").toISOString() : null,
        completed: editingTask?.completed || false
      };

      if (editingTask) {
        await taskService.update(editingTask.Id, taskData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(taskData);
        toast.success("Task created successfully");
      }

      await loadTasks();
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await taskService.update(task.Id, { completed: !task.completed });
      toast.success(task.completed ? "Task marked as incomplete" : "Task completed!");
      await loadTasks();
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    try {
      await taskService.delete(task.Id);
      toast.success("Task deleted successfully");
      await loadTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "error",
      medium: "warning", 
      low: "info"
    };
    return colors[priority] || "default";
  };

  const getDueDateStatus = (dueDate, completed) => {
    if (!dueDate || completed) return null;
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
      return { status: "overdue", color: "error" };
    }
    if (isToday(date)) {
      return { status: "due today", color: "warning" };
    }
    return null;
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
        <Button onClick={handleAddTask} size="sm">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Empty 
          title="No tasks found"
          description="Create your first task to get started"
          action={
            <Button onClick={handleAddTask} variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {tasks.map(task => {
            const dueDateStatus = getDueDateStatus(task.dueDate, task.completed);
            
            return (
              <div
                key={task.Id}
                className={`bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow ${
                  task.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => handleToggleComplete(task)}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-success border-success text-white'
                          : 'border-gray-300 hover:border-success'
                      }`}
                    >
                      {task.completed && <ApperIcon name="Check" size={12} />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        <Badge 
                          variant={getPriorityColor(task.priority)} 
                          size="sm"
                        >
                          {task.priority}
                        </Badge>
                        {dueDateStatus && (
                          <Badge variant={dueDateStatus.color} size="sm">
                            {dueDateStatus.status}
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                          {task.description}
                        </p>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-500">
                          <ApperIcon name="Calendar" size={12} className="mr-1" />
                          Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTask(task)}
                      className="p-1"
                    >
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task)}
                      className="p-1 text-error hover:text-error"
                    >
                      <ApperIcon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={editingTask ? "Edit Task" : "Add New Task"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <TextArea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <Select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskWidget;