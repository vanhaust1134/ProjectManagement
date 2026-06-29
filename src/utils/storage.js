const STORAGE_KEY_PROJECTS = 'pm_demo_projects';
const STORAGE_KEY_TASKS = 'pm_demo_tasks';
const STORAGE_KEY_USERS = 'pm_demo_users';

const INITIAL_USERS = [
  'Alice Smith',
  'Bob Johnson',
  'Charlie Brown',
  'David Miller'
];

const INITIAL_PROJECTS = [
  {
    id: 'project-1',
    name: 'E-Commerce Platform',
    desc: 'Build a modern e-commerce storefront with a fully featured admin dashboard, shopping cart, and Stripe payment gateway.',
    dueDate: '2026-07-25',
    status: 'Active'
  },
  {
    id: 'project-2',
    name: 'Mobile App Design',
    desc: 'Create wireframes, user flow diagrams, and high-fidelity interactive mockups in Figma for the iOS and Android applications.',
    dueDate: '2026-08-10',
    status: 'Active'
  },
  {
    id: 'project-3',
    name: 'Marketing Campaign Q3',
    desc: 'Plan, design, and execute the Q3 marketing and advertising campaign across social channels and search engines.',
    dueDate: '2026-09-01',
    status: 'Planning'
  }
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Design Database Schema',
    desc: 'Create entity relationship diagrams and finalize database schemas for products, orders, and user transactions.',
    status: 'completed',
    priority: 'high',
    assignee: 'Alice Smith',
    dueDate: '2026-07-02'
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Setup React Storefront UI',
    desc: 'Set up Vite with React, Tailwind CSS, routing, and catalog search filter components.',
    status: 'completed',
    priority: 'medium',
    assignee: 'Bob Johnson',
    dueDate: '2026-07-05'
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'Integrate Stripe Payments',
    desc: 'Implement serverless backend handlers for Stripe checkout sessions, webhooks, and secure frontend payment forms.',
    status: 'progress',
    priority: 'high',
    assignee: 'Bob Johnson',
    dueDate: '2026-07-20'
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    title: 'Draft API Documentation',
    desc: 'Write complete REST API documentation including requests, responses, and error codes using Swagger UI.',
    status: 'todo',
    priority: 'low',
    assignee: 'Charlie Brown',
    dueDate: '2026-07-24'
  },
  {
    id: 'task-5',
    projectId: 'project-2',
    title: 'User Persona Interviews',
    desc: 'Conduct interviews with 10 target users to define core needs, user journeys, and personas.',
    status: 'completed',
    priority: 'medium',
    assignee: 'David Miller',
    dueDate: '2026-07-10'
  },
  {
    id: 'task-6',
    projectId: 'project-2',
    title: 'Figma High-Fidelity UI Screens',
    desc: 'Create pixel-perfect high-fidelity mockups for onboarding, dashboard, search, and checkout screens.',
    status: 'review',
    priority: 'high',
    assignee: 'Alice Smith',
    dueDate: '2026-07-30'
  },
  {
    id: 'task-7',
    projectId: 'project-2',
    title: 'Prototype Interactive Click-through',
    desc: 'Link Figma screens together to create an interactive demo prototype for stakeholders.',
    status: 'todo',
    priority: 'medium',
    assignee: 'David Miller',
    dueDate: '2026-08-05'
  },
  {
    id: 'task-8',
    projectId: 'project-3',
    title: 'Finalize Copywriting & Ad Assets',
    desc: 'Write ad copy, landing page headlines, and create banners/videos for Google and Meta Ads.',
    status: 'todo',
    priority: 'medium',
    assignee: 'Charlie Brown',
    dueDate: '2026-08-25'
  }
];

export const loadData = () => {
  let projects = localStorage.getItem(STORAGE_KEY_PROJECTS);
  let tasks = localStorage.getItem(STORAGE_KEY_TASKS);
  let users = localStorage.getItem(STORAGE_KEY_USERS);

  if (!projects || !tasks || !users) {
    // Seed initial data
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(INITIAL_PROJECTS));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(INITIAL_TASKS));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(INITIAL_USERS));
    
    return {
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      users: INITIAL_USERS
    };
  }

  return {
    projects: JSON.parse(projects),
    tasks: JSON.parse(tasks),
    users: JSON.parse(users)
  };
};

export const saveData = (projects, tasks, users) => {
  localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};
