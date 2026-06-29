import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Users, 
  ArrowUpRight, 
  FolderPlus, 
  X,
  UserPlus
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ProjectList({ 
  projects, 
  tasks, 
  users, 
  addProject, 
  deleteProject, 
  addUser, 
  deleteUser,
  setTab, 
  setSelectedProjectId 
}) {
  const containerRef = useRef(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectDueDate, setProjectDueDate] = useState('');
  const [projectStatus, setProjectStatus] = useState('Planning');

  const [newUserName, setNewUserName] = useState('');

  // GSAP animations for cards and team chips
  useGSAP(() => {
    gsap.fromTo('.project-card', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
    );
    
    gsap.fromTo('.user-chip', 
      { scale: 0.7, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.03, duration: 0.3, ease: 'back.out(1.5)' }
    );
  }, { dependencies: [projects.length, users.length], scope: containerRef });

  // GSAP animation for the modal popup
  useGSAP(() => {
    if (showProjectModal) {
      gsap.fromTo('.modal-overlay', 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo('.modal-content', 
        { scale: 0.9, y: 15, opacity: 0 }, 
        { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }, { dependencies: [showProjectModal], scope: containerRef });

  // Handle Project Form Submission
  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    const newProject = {
      id: `project-${Date.now()}`,
      name: projectName,
      desc: projectDesc,
      dueDate: projectDueDate || new Date().toISOString().split('T')[0],
      status: projectStatus
    };

    addProject(newProject);
    
    // Reset Form
    setProjectName('');
    setProjectDesc('');
    setProjectDueDate('');
    setProjectStatus('Planning');
    setShowProjectModal(false);
  };

  // Handle User Form Submission
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    if (users.includes(newUserName.trim())) {
      alert('User already exists!');
      return;
    }
    addUser(newUserName.trim());
    setNewUserName('');
  };

  // Helper to calculate project stats
  const getProjectStats = (projectId) => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const total = projectTasks.length;
    const completed = projectTasks.filter(t => t.status === 'completed').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, progress };
  };

  const handleOpenProject = (projectId) => {
    setSelectedProjectId(projectId);
    setTab('tasks');
  };

  return (
    <div ref={containerRef}>
      {/* Top Section - Project List Title & Create Button */}
      <div className="page-header">
        <div className="header-title">
          <h1>Projects</h1>
          <p>Create, manage and monitor your active workspace projects.</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowProjectModal(true)}
          >
            <FolderPlus size={18} />
            Create Project
          </button>
        </div>
      </div>

      {/* Team Member Management Card */}
      <div className="glass-card user-manager-card" style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Users size={18} color="var(--color-primary)" />
          Workspace Team Members
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Manage members available for task assignments in this demo.
        </p>

        <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '8px', maxWidth: '400px', marginBottom: '16px' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter name (e.g. Emily Watson)" 
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '13px' }}
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <UserPlus size={14} />
            Add Member
          </button>
        </form>

        <div className="user-chips">
          {users.map(user => (
            <div key={user} className="user-chip">
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {user.substring(0, 2)}
              </span>
              <span>{user}</span>
              <button 
                className="user-chip-delete" 
                onClick={() => deleteUser(user)}
                title={`Remove ${user}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-card empty-state">
          <FolderPlus size={48} />
          <h3>No Projects Yet</h3>
          <p>Create your first project to start managing tasks and tracking reports.</p>
          <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
            Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => {
            const { total, completed, progress } = getProjectStats(project.id);
            const isCompleted = project.status === 'Completed' || (total > 0 && progress === 100);

            return (
              <div 
                key={project.id} 
                className={`glass-card project-card ${isCompleted ? 'completed' : ''}`}
              >
                <div className="project-header">
                  <div>
                    <h3 className="project-title">{project.name}</h3>
                    <span 
                      className="badge" 
                      style={{ 
                        backgroundColor: 
                          project.status === 'Active' ? 'rgba(6, 182, 212, 0.1)' : 
                          project.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 
                          'rgba(245, 158, 11, 0.1)',
                        color: 
                          project.status === 'Active' ? 'var(--color-info)' : 
                          project.status === 'Completed' ? 'var(--color-success)' : 
                          'var(--color-warning)',
                        marginTop: '6px',
                        display: 'inline-block'
                      }}
                    >
                      {project.status}
                    </span>
                  </div>
                  <button 
                    className="action-btn-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Are you sure you want to delete project "${project.name}" and all its tasks?`)) {
                        deleteProject(project.id);
                      }
                    }}
                    style={{ color: 'var(--color-danger)' }}
                    title="Delete Project"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p className="project-desc">{project.desc || 'No description provided.'}</p>

                <div className="project-progress-wrapper">
                  <div className="progress-label-row">
                    <span>Progress</span>
                    <span>{progress}% ({completed}/{total} Tasks)</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="project-meta">
                  <div className="meta-item">
                    <Calendar size={13} />
                    <span>Due {new Date(project.dueDate).toLocaleDateString()}</span>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => handleOpenProject(project.id)}
                    style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px' }}
                  >
                    Board
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <div className="modal-header">
              <h2>Create New Project</h2>
              <button className="modal-close" onClick={() => setShowProjectModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required
                  placeholder="e.g. Brand Refresh"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  placeholder="Summarize the project goals..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={projectDueDate}
                    onChange={(e) => setProjectDueDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select 
                    className="form-control"
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
