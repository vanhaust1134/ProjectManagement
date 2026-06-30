import React, { useRef } from 'react';
import { 
  Briefcase, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertCircle, 
  Calendar, 
  ArrowRight 
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard({ projects, tasks, users, setTab, setSelectedProjectId }) {
  const containerRef = useRef(null);

  // Stats calculations
  const totalProjects = projects.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = tasks.filter(t => t.status !== 'completed').length;
  const totalUsers = users.length;

  // Task lists
  const overdueTasks = tasks.filter(task => {
    if (task.status === 'completed') return false;
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    return due < today;
  });

  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4);

  const handleTaskClick = (projectId) => {
    setSelectedProjectId(projectId);
    setTab('tasks');
  };

  // GSAP animations scoped to containerRef
  useGSAP(() => {
    // Animate stats cards
    gsap.fromTo('.stat-card', 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
    );

    // Animate details grids
    gsap.fromTo('.dashboard-column', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.15, duration: 0.7, delay: 0.2, ease: 'power2.out' }
    );

    // Stagger task cards inside dashboard columns
    gsap.fromTo('.task-card', 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, delay: 0.4, ease: 'power1.out' }
    );
  }, { dependencies: [projects.length, tasks.length], scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here is a summary of your workspace activities.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalProjects}</span>
            <span className="stat-label">Total Projects</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--color-info)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{activeTasks}</span>
            <span className="stat-label">Active Tasks</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedTasks}</span>
            <span className="stat-label">Completed Tasks</span>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'var(--color-purple)' }}>
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalUsers}</span>
            <span className="stat-label">Team Members</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginTop: '24px' }}>
        {/* Overdue Tasks */}
        <div className="glass-card dashboard-column">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '18px' }}>
            <AlertCircle size={20} color="var(--color-danger)" />
            Overdue Tasks ({overdueTasks.length})
          </h3>
          {overdueTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p>Awesome! No overdue tasks.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {overdueTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div 
                    key={task.id} 
                    className="task-card" 
                    style={{ borderLeft: '4px solid var(--color-danger)', cursor: 'pointer' }}
                    onClick={() => handleTaskClick(task.projectId)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="badge badge-high">{task.priority} Priority</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-danger)', fontWeight: 'bold' }}>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="task-title" style={{ margin: 0 }}>{task.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span>Project: <strong>{project ? project.name : 'Unknown'}</strong></span>
                      <div className="task-assignee">
                        <div className="assignee-avatar">{task.assignee ? task.assignee.substring(0,2) : '??'}</div>
                        <span>{task.assignee || 'Unassigned'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="glass-card dashboard-column">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '18px' }}>
            <Calendar size={20} color="var(--color-info)" />
            Upcoming Deadlines
          </h3>
          {upcomingTasks.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p>No upcoming active tasks.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingTasks.map(task => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <div 
                    key={task.id} 
                    className="task-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleTaskClick(task.projectId)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: '600', margin: '4px 0' }}>{task.title}</h4>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Project: {project ? project.name : 'Unknown'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
