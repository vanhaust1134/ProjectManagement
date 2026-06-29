import React, { useState, useEffect, useRef } from 'react';
import { loadData, saveData } from './utils/storage';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import KanbanBoard from './components/KanbanBoard';
import ReportDashboard from './components/ReportDashboard';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Columns, 
  BarChart3, 
  TrendingUp 
} from 'lucide-react';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Register the useGSAP plugin
gsap.registerPlugin(useGSAP);

function App() {
  const [tab, setTab] = useState('dashboard');
  
  // Data State
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Selection/Filtering State
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  // GSAP Animation Refs
  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);

  // Load Initial Data
  useEffect(() => {
    const data = loadData();
    setProjects(data.projects);
    setTasks(data.tasks);
    setUsers(data.users);
  }, []);

  // Save data on state changes
  useEffect(() => {
    if (projects.length > 0 || tasks.length > 0 || users.length > 0) {
      saveData(projects, tasks, users);
    }
  }, [projects, tasks, users]);

  // Sidebar Entry Animation
  useGSAP(() => {
    gsap.from(sidebarRef.current, {
      x: -260,
      opacity: 0.5,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    gsap.from('.logo-container, .sidebar-menu li, .sidebar-footer', {
      x: -30,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out'
    });
  }, { scope: sidebarRef });

  // Tab Transition Animation
  useGSAP(() => {
    if (mainContentRef.current) {
      // Fade and slide layout content on tab switch
      gsap.fromTo(mainContentRef.current.children, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, { dependencies: [tab], scope: mainContentRef });

  // Project Actions
  const addProject = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

  const deleteProject = (projectId) => {
    setProjects((prev) => prev.filter(p => p.id !== projectId));
    setTasks((prev) => prev.filter(t => t.projectId !== projectId));
    if (selectedProjectId === projectId) {
      setSelectedProjectId('all');
    }
  };

  // Task Actions
  const addTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter(t => t.id !== taskId));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));
  };

  // User Actions
  const addUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  const deleteUser = (username) => {
    setUsers((prev) => prev.filter(u => u !== username));
    setTasks((prev) => prev.map(t => {
      if (t.assignee === username) {
        return { ...t, assignee: '' };
      }
      return t;
    }));
  };

  // Render active tab view
  const renderView = () => {
    switch (tab) {
      case 'dashboard':
        return (
          <Dashboard 
            projects={projects}
            tasks={tasks}
            users={users}
            setTab={setTab}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
      case 'projects':
        return (
          <ProjectList 
            projects={projects}
            tasks={tasks}
            users={users}
            addProject={addProject}
            deleteProject={deleteProject}
            addUser={addUser}
            deleteUser={deleteUser}
            setTab={setTab}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
      case 'tasks':
        return (
          <KanbanBoard 
            projects={projects}
            tasks={tasks}
            users={users}
            addTask={addTask}
            updateTaskStatus={updateTaskStatus}
            deleteTask={deleteTask}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
          />
        );
      case 'reports':
        return (
          <ReportDashboard 
            projects={projects}
            tasks={tasks}
            users={users}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar" ref={sidebarRef}>
        <div className="logo-container">
          <div className="logo-icon">P</div>
          <span className="logo-text">PlanIQ</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <div 
              className={`menu-item ${tab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setTab('dashboard')}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </div>
          </li>
          <li>
            <div 
              className={`menu-item ${tab === 'projects' ? 'active' : ''}`}
              onClick={() => setTab('projects')}
            >
              <FolderKanban />
              <span>Projects</span>
            </div>
          </li>
          <li>
            <div 
              className={`menu-item ${tab === 'tasks' ? 'active' : ''}`}
              onClick={() => setTab('tasks')}
            >
              <Columns />
              <span>Kanban Board</span>
            </div>
          </li>
          <li>
            <div 
              className={`menu-item ${tab === 'reports' ? 'active' : ''}`}
              onClick={() => setTab('reports')}
            >
              <BarChart3 />
              <span>Reports & Analytics</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="username">Admin Demo</span>
              <span className="user-role">Workspace Owner</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="main-content" ref={mainContentRef}>
        {renderView()}
      </main>
    </div>
  );
}

export default App;
