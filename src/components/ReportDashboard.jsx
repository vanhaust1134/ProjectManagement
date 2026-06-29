import React, { useState, useRef } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, PieChartIcon, TrendingUp, Users } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ReportDashboard({ projects, tasks, users }) {
  const containerRef = useRef(null);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');

  // GSAP animation for report cards
  useGSAP(() => {
    gsap.fromTo('.chart-card', 
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' }
    );
  }, { dependencies: [selectedProjectFilter, projects.length, tasks.length], scope: containerRef });

  // Filter tasks based on selected project
  const filteredTasks = selectedProjectFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.projectId === selectedProjectFilter);

  // 1. Task Status Data
  const statusCounts = { todo: 0, progress: 0, review: 0, completed: 0 };
  filteredTasks.forEach(task => {
    if (statusCounts[task.status] !== undefined) {
      statusCounts[task.status]++;
    }
  });

  const statusData = [
    { name: 'To Do', value: statusCounts.todo, color: '#06b6d4' },       // Cyan
    { name: 'In Progress', value: statusCounts.progress, color: '#f59e0b' }, // Amber
    { name: 'In Review', value: statusCounts.review, color: '#a855f7' },   // Purple
    { name: 'Completed', value: statusCounts.completed, color: '#10b981' }  // Emerald
  ].filter(item => item.value > 0); // Only show statuses with tasks

  // 2. Task Priority Data
  const priorityCounts = { low: 0, medium: 0, high: 0 };
  filteredTasks.forEach(task => {
    if (priorityCounts[task.priority] !== undefined) {
      priorityCounts[task.priority]++;
    }
  });

  const priorityData = [
    { name: 'Low', count: priorityCounts.low, color: '#10b981' },
    { name: 'Medium', count: priorityCounts.medium, color: '#f59e0b' },
    { name: 'High', count: priorityCounts.high, color: '#ef4444' }
  ];

  // 3. User Workload Data
  const userWorkload = {};
  users.forEach(user => {
    userWorkload[user] = 0;
  });
  
  // Count unassigned as well if they exist
  let unassignedCount = 0;
  filteredTasks.forEach(task => {
    if (task.assignee && userWorkload[task.assignee] !== undefined) {
      userWorkload[task.assignee]++;
    } else if (!task.assignee) {
      unassignedCount++;
    }
  });

  const workloadData = Object.keys(userWorkload).map(user => ({
    name: user.split(' ')[0], // Show first name only for chart spacing
    tasks: userWorkload[user]
  }));

  if (unassignedCount > 0) {
    workloadData.push({ name: 'Unassigned', tasks: unassignedCount });
  }

  // 4. Project Progress Data
  const projectProgressData = projects.map(proj => {
    const projTasks = tasks.filter(t => t.projectId === proj.id);
    const total = projTasks.length;
    const completed = projTasks.filter(t => t.status === 'completed').length;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      name: proj.name.length > 15 ? proj.name.substring(0, 15) + '...' : proj.name,
      progress: progress,
      totalTasks: total
    };
  });

  // Custom tooltips for nice glassmorphic tooltip styling
  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="custom-tooltip-label">{payload[0].name}</p>
          <p className="custom-tooltip-value" style={{ color: payload[0].payload.color || 'var(--color-primary)' }}>
            Value: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="custom-tooltip-label">{label}</p>
          <p className="custom-tooltip-value" style={{ color: 'var(--color-primary)' }}>
            Tasks: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomProgressTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="custom-tooltip-label">{label}</p>
          <p className="custom-tooltip-value" style={{ color: 'var(--color-success)' }}>
            Completion: {payload[0].value}%
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Total Tasks: {payload[0].payload.totalTasks}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="reports-layout" ref={containerRef}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-title">
          <h1>Analytics & Reports</h1>
          <p>Real-time statistical breakdowns of projects and workloads.</p>
        </div>
        
        {/* Project Filter Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Filter Report by Project:</span>
          <select 
            className="form-control" 
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', width: '220px', margin: 0 }}
          >
            <option value="all">All Workspace Projects</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Charts */}
      {filteredTasks.length === 0 ? (
        <div className="glass-card empty-state">
          <TrendingUp size={48} />
          <h3>No Data to Analyze</h3>
          <p>There are no tasks associated with the selected scope. Add tasks to visualize reporting metrics.</p>
        </div>
      ) : (
        <div className="charts-grid">
          {/* Chart 1: Task Status Distribution */}
          <div className="glass-card chart-card">
            <div className="chart-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChartIcon size={18} color="var(--color-info)" />
                Task Status Distribution
              </h3>
              <p>Proportion of tasks across the execution pipeline</p>
            </div>
            
            <div className="chart-container-wrapper">
              {statusData.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  No tasks found
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomChartTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      iconType="circle"
                      iconSize={10}
                      formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Task Priority Breakdown */}
          <div className="glass-card chart-card">
            <div className="chart-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="var(--color-danger)" />
                Task Priority Breakdown
              </h3>
              <p>Quantity of tasks grouped by priority level</p>
            </div>

            <div className="chart-container-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priorityData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-muted)" 
                    fontSize={11} 
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={11} 
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.01)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: User Workload */}
          <div className="glass-card chart-card">
            <div className="chart-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="var(--color-purple)" />
                Team Workload (Tasks per Member)
              </h3>
              <p>Number of active and completed tasks assigned to each user</p>
            </div>

            <div className="chart-container-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={workloadData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-muted)" 
                    fontSize={11} 
                  />
                  <YAxis 
                    stroke="var(--text-muted)" 
                    fontSize={11} 
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.01)' }} />
                  <Bar dataKey="tasks" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Project Progress Overview */}
          <div className="glass-card chart-card">
            <div className="chart-card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={18} color="var(--color-success)" />
                Project Completion Progress (%)
              </h3>
              <p>Percentage of completed tasks for each project</p>
            </div>

            <div className="chart-container-wrapper">
              {projectProgressData.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                  No projects to display
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={projectProgressData}
                    margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                    <XAxis 
                      type="number" 
                      domain={[0, 100]} 
                      stroke="var(--text-muted)" 
                      fontSize={11}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      stroke="var(--text-muted)" 
                      fontSize={11} 
                      width={100}
                    />
                    <Tooltip content={<CustomProgressTooltip />} cursor={{ fill: 'rgba(0,0,0,0.01)' }} />
                    <Bar dataKey="progress" fill="var(--color-success)" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
