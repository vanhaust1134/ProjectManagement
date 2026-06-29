import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  X,
  AlertCircle,
  Filter
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', className: 'todo' },
  { id: 'progress', title: 'In Progress', className: 'progress' },
  { id: 'review', title: 'In Review', className: 'review' },
  { id: 'completed', title: 'Completed', className: 'done' }
];

export default function KanbanBoard({ 
  projects, 
  tasks, 
  users, 
  addTask, 
  updateTaskStatus, 
  deleteTask, 
  selectedProjectId, 
  setSelectedProjectId 
}) {
  const containerRef = useRef(null);
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  // New Task Form Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskProjectId, setTaskProjectId] = useState(selectedProjectId || (projects[0]?.id || ''));
  const [taskAssignee, setTaskAssignee] = useState(users[0] || '');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');

  // Synchronize form project field when selectedProjectId changes
  useEffect(() => {
    if (selectedProjectId && selectedProjectId !== 'all') {
      setTaskProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  // GSAP Board entry animations
  useGSAP(() => {
    gsap.fromTo('.board-column', 
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
    );
    
    gsap.fromTo('.task-card', 
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power1.out', delay: 0.1 }
    );
  }, { dependencies: [selectedProjectId, selectedUserFilter, tasks.length], scope: containerRef });

  // GSAP Modal animation
  useGSAP(() => {
    if (showTaskModal) {
      gsap.fromTo('.modal-overlay', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo('.modal-content', 
        { scale: 0.9, y: 15, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }, { dependencies: [showTaskModal], scope: containerRef });

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (id) {
      // Find the card element to animate it dropped in
      const el = document.getElementById(id);
      if (el) {
        gsap.fromTo(el, { scale: 0.92, y: -5 }, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
      }
      updateTaskStatus(id, status);
      setDraggedTaskId(null);
    }
  };

  // Move via button click
  const moveTask = (taskId, currentStatus, direction) => {
    const statusOrder = ['todo', 'progress', 'review', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      // Animate the button click action on the card
      const el = document.getElementById(taskId);
      if (el) {
        gsap.to(el, { 
          x: direction * 40, 
          opacity: 0.2, 
          duration: 0.2, 
          onComplete: () => {
            updateTaskStatus(taskId, statusOrder[newIndex]);
            // Wait briefly for React to re-render it in the new column, then animate it in
            setTimeout(() => {
              const newEl = document.getElementById(taskId);
              if (newEl) {
                gsap.fromTo(newEl, 
                  { x: -direction * 40, opacity: 0 }, 
                  { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
                );
              }
            }, 50);
          }
        });
      } else {
        updateTaskStatus(taskId, statusOrder[newIndex]);
      }
    }
  };

  // Form submit handler
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskProjectId) return;

    const newTask = {
      id: `task-${Date.now()}`,
      projectId: taskProjectId,
      title: taskTitle,
      desc: taskDesc,
      status: taskStatus,
      priority: taskPriority,
      assignee: taskAssignee,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0]
    };

    addTask(newTask);

    // Reset Form
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('medium');
    setTaskDueDate('');
    setTaskStatus('todo');
    setShowTaskModal(false);
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    const projectMatch = selectedProjectId === 'all' || task.projectId === selectedProjectId;
    const userMatch = selectedUserFilter === 'all' || task.assignee === selectedUserFilter;
    return projectMatch && userMatch;
  });

  const getColumnTasks = (columnId) => {
    return filteredTasks.filter(task => task.status === columnId);
  };

  const handleOpenCreateModal = () => {
    if (selectedProjectId && selectedProjectId !== 'all') {
      setTaskProjectId(selectedProjectId);
    } else if (projects.length > 0) {
      setTaskProjectId(projects[0].id);
    }
    setTaskAssignee(users[0] || '');
    setShowTaskModal(true);
  };

  return (
    <div ref={containerRef}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>Kanban Board</h1>
          <p>Organize, track, and assign project tasks across execution stages.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={handleOpenCreateModal}
            disabled={projects.length === 0}
          >
            <Plus size={18} />
            Create Task
          </button>
        </div>
      </div>

      {/* Board Filter Bar */}
      <div className="glass-card board-filters">
        <div className="filters-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Filters:</span>
          </div>

          {/* Project Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <select 
              className="form-control" 
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', width: '200px' }}
            >
              <option value="all">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Assignee Selector */}
          <div className="form-group" style={{ margin: 0 }}>
            <select 
              className="form-control" 
              value={selectedUserFilter}
              onChange={(e) => setSelectedUserFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', width: '200px' }}
            >
              <option value="all">All Members</option>
              {users.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Showing {filteredTasks.length} tasks
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card empty-state" style={{ marginTop: '24px' }}>
          <AlertCircle size={48} />
          <h3>No Projects Available</h3>
          <p>You need to create at least one project before you can manage tasks.</p>
        </div>
      ) : (
        /* Kanban Board Grid */
        <div className="board-grid">
          {COLUMNS.map(col => {
            const columnTasks = getColumnTasks(col.id);
            return (
              <div 
                key={col.id} 
                className="board-column"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className={`column-header ${col.className}`}>
                  <span className="column-title">
                    {col.title}
                  </span>
                  <span className="column-count">{columnTasks.length}</span>
                </div>

                <div className="tasks-list">
                  {columnTasks.length === 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 1,
                      border: '2px dashed rgba(0,0,0,0.03)',
                      borderRadius: '8px',
                      color: 'var(--text-muted)',
                      fontSize: '12px',
                      padding: '24px 0',
                      textAlign: 'center'
                    }}>
                      Drop tasks here
                    </div>
                  ) : (
                    columnTasks.map(task => {
                      const project = projects.find(p => p.id === task.projectId);
                      const isOverdue = task.status !== 'completed' && task.dueDate && (new Date(task.dueDate) < new Date().setHours(0,0,0,0));
                      
                      return (
                        <div 
                          key={task.id}
                          id={task.id}
                          className="task-card"
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                        >
                          <div className="task-tags">
                            <span className={`badge badge-${task.priority}`}>
                              {task.priority}
                            </span>
                            <button 
                              className="action-btn-icon" 
                              onClick={() => {
                                if (confirm(`Delete task "${task.title}"?`)) {
                                  deleteTask(task.id);
                                }
                              }}
                              style={{ color: 'var(--color-danger)', padding: '2px' }}
                              title="Delete Task"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          <div className="task-title">{task.title}</div>
                          <div className="task-desc">{task.desc}</div>

                          <div 
                            style={{ 
                              fontSize: '10px', 
                              color: 'var(--color-primary)', 
                              fontWeight: 600, 
                              marginBottom: '8px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                            title={project ? project.name : 'Unknown Project'}
                          >
                            📁 {project ? project.name : 'Unknown Project'}
                          </div>

                          <div className="task-footer">
                            <div className="task-assignee">
                              <div className="assignee-avatar">
                                {task.assignee ? task.assignee.substring(0, 2) : '??'}
                              </div>
                              <span title={task.assignee || 'Unassigned'}>
                                {task.assignee ? (task.assignee.split(' ')[0]) : 'Unassigned'}
                              </span>
                            </div>

                            <div className={`task-due ${isOverdue ? 'overdue' : ''}`}>
                              <Calendar size={10} />
                              <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'}) : 'No date'}</span>
                            </div>
                          </div>

                          {/* Quick movement controls */}
                          <div className="task-actions">
                            <button 
                              className="action-btn-icon"
                              onClick={() => moveTask(task.id, task.status, -1)}
                              disabled={task.status === 'todo'}
                              style={{ opacity: task.status === 'todo' ? 0.3 : 1 }}
                              title="Move Left"
                            >
                              <ChevronLeft size={14} />
                            </button>
                            <button 
                              className="action-btn-icon"
                              onClick={() => moveTask(task.id, task.status, 1)}
                              disabled={task.status === 'completed'}
                              style={{ opacity: task.status === 'completed' ? 0.3 : 1 }}
                              title="Move Right"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. Design Login Page"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  placeholder="Detail the specifications for this task..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assign Project *</label>
                  <select 
                    className="form-control"
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    required
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign Team Member</label>
                  <select 
                    className="form-control"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                  >
                    <option value="">Select Member</option>
                    {users.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select 
                    className="form-control"
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-control"
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
