import { test, expect } from '@playwright/test';

test.describe('Project Management Application E2E Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('Verify initial loading and tab navigation', async ({ page }) => {
    // 1. Verify app title in the header
    await expect(page.locator('.logo-text')).toHaveText('PlanIQ');

    // 2. Check that we are on the Dashboard by default
    await expect(page.locator('h1')).toHaveText('Dashboard');
    await expect(page.locator('.stat-card').first()).toBeVisible();

    // 3. Navigate to Projects tab
    await page.click('.menu-item:has-text("Projects")');
    await expect(page.locator('h1')).toHaveText('Projects');
    await expect(page.locator('button:has-text("Create Project")')).toBeVisible();

    // 4. Navigate to Kanban Board tab
    await page.click('.menu-item:has-text("Kanban Board")');
    await expect(page.locator('h1')).toHaveText('Kanban Board');
    await expect(page.locator('button:has-text("Create Task")')).toBeVisible();

    // 5. Navigate to Reports & Analytics tab
    await page.click('.menu-item:has-text("Reports & Analytics")');
    await expect(page.locator('h1')).toHaveText('Analytics & Reports');
    await expect(page.locator('.chart-card').first()).toBeVisible();
  });

  test('Verify workspace team member creation and deletion', async ({ page }) => {
    // Go to Projects tab where member manager resides
    await page.click('.menu-item:has-text("Projects")');

    const testUserName = 'John Doe Playwright';

    // 1. Add a new team member
    await page.fill('input[placeholder="Enter name (e.g. Emily Watson)"]', testUserName);
    await page.click('button:has-text("Add Member")');

    // 2. Verify new member chip is added
    const userChip = page.locator(`.user-chip:has-text("${testUserName}")`);
    await expect(userChip).toBeVisible();

    // 3. Remove the team member
    await userChip.locator('.user-chip-delete').click();
    await expect(userChip).not.toBeVisible();
  });

  test('Verify project creation lifecycle', async ({ page }) => {
    await page.click('.menu-item:has-text("Projects")');

    const testProjectName = 'Automated QA Project';
    const testProjectDesc = 'Testing project description for Playwright automated runner.';

    // 1. Open project modal
    await page.click('.page-header button:has-text("Create Project")');
    await expect(page.locator('.modal-header h2')).toHaveText('Create New Project');

    // 2. Fill and submit form
    await page.fill('input[placeholder="e.g. Brand Refresh"]', testProjectName);
    await page.fill('textarea[placeholder="Summarize the project goals..."]', testProjectDesc);
    await page.selectOption('select:near(label:has-text("Status"))', 'Active');
    await page.click('.modal-content button:has-text("Create Project")');

    // 3. Verify project card exists in list
    const projectCard = page.locator(`.project-card:has-text("${testProjectName}")`);
    await expect(projectCard).toBeVisible();
    await expect(projectCard.locator('.project-desc')).toHaveText(testProjectDesc);

    // 4. Delete the project and verify it is removed
    // Accept confirm dialog automatically
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain(`Are you sure you want to delete project "${testProjectName}"`);
      await dialog.accept();
    });
    
    await projectCard.locator('button.action-btn-icon').click();
    await expect(projectCard).not.toBeVisible();
  });

  test('Verify task creation, assignment, and status transitions on Kanban board', async ({ page }) => {
    // 1. Create a test project first to attach the task to
    await page.click('.menu-item:has-text("Projects")');
    const qaProjectName = 'QA Task Board Project';
    await page.click('.page-header button:has-text("Create Project")');
    await page.fill('input[placeholder="e.g. Brand Refresh"]', qaProjectName);
    await page.click('.modal-content button:has-text("Create Project")');

    // 2. Go to Kanban Board
    await page.click('.menu-item:has-text("Kanban Board")');

    // 3. Create a new task
    await page.click('.page-header button:has-text("Create Task")');
    const taskTitleName = 'Playwright Test Task';
    const taskDescText = 'Verify task can traverse columns and update project progress.';

    await page.fill('input[placeholder="e.g. Design Login Page"]', taskTitleName);
    await page.fill('textarea[placeholder="Detail the specifications for this task..."]', taskDescText);
    await page.selectOption('select:has-text("QA Task Board Project")', { label: qaProjectName });
    await page.selectOption('select:has-text("Select Member")', { label: 'Alice Smith' });
    await page.selectOption('select:near(label:has-text("Priority"))', 'high');
    await page.selectOption('select:near(label:has-text("Status"))', 'todo');
    await page.click('.modal-content button:has-text("Create Task")');

    // 4. Verify task card is in "To Do" column
    const todoColumn = page.locator('.board-column:has-text("To Do")');
    const taskCard = todoColumn.locator(`.task-card:has-text("${taskTitleName}")`);
    await expect(taskCard).toBeVisible();
    await expect(taskCard.locator('.task-desc')).toHaveText(taskDescText);

    // 5. Transition task through columns: To Do -> In Progress -> In Review -> Completed
    const progressColumn = page.locator('.board-column:has-text("In Progress")');
    const reviewColumn = page.locator('.board-column:has-text("In Review")');
    const completedColumn = page.locator('.board-column:has-text("Completed")');

    // Move to In Progress
    await taskCard.locator('button[title="Move Right"]').click();
    await expect(progressColumn.locator(`.task-card:has-text("${taskTitleName}")`)).toBeVisible();

    // Move to In Review
    const taskCardProgress = progressColumn.locator(`.task-card:has-text("${taskTitleName}")`);
    await taskCardProgress.locator('button[title="Move Right"]').click();
    await expect(reviewColumn.locator(`.task-card:has-text("${taskTitleName}")`)).toBeVisible();

    // Move to Completed
    const taskCardReview = reviewColumn.locator(`.task-card:has-text("${taskTitleName}")`);
    await taskCardReview.locator('button[title="Move Right"]').click();
    await expect(completedColumn.locator(`.task-card:has-text("${taskTitleName}")`)).toBeVisible();

    // 6. Verify Project progress updates to 100% on Projects tab
    await page.click('.menu-item:has-text("Projects")');
    const projectCard = page.locator(`.project-card:has-text("${qaProjectName}")`);
    await expect(projectCard.locator('.progress-label-row')).toContainText('100%');

    // 7. Cleanup project (deletes the project and its tasks)
    page.on('dialog', async dialog => {
      await dialog.accept();
    });
    await projectCard.locator('button.action-btn-icon').click();
  });
});
