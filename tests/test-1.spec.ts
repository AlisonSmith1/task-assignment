import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:4200/dashboard/assignment');

  const taskPool = page.locator('#todoList');
  const allTasks = taskPool.locator('div.task-item');

  await expect(allTasks.first()).toBeVisible();

  const taskCount = await allTasks.count();
  const randomIndex = Math.floor(Math.random() * taskCount);

  const sourceTask = allTasks.nth(randomIndex);

  const taskName = await sourceTask.locator('strong').innerText();
  console.log(`[QA 測試紀錄] 本次抽取的隨機任務為：${taskName}`);

  const targetDriver = page.locator('[id="1"]');

  const sourceBox = await sourceTask.boundingBox();
  const targetBox = await targetDriver.boundingBox();

  if (sourceBox && targetBox) {
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();

    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2 + 10,
      sourceBox.y + sourceBox.height / 2 + 10,
    );
    await page.waitForTimeout(100);

    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
      steps: 20,
    });

    await page.mouse.up();
    await page.mouse.up();
  }

  const assignedTask = targetDriver.locator('div.task-item').filter({ hasText: taskName });
  await assignedTask.getByRole('button', { name: '回溯' }).click();

  await page.getByRole('textbox', { name: '請輸入原因' }).fill('44444');
  await page.getByRole('button', { name: '確認' }).click();

  await expect(page.getByText('請輸入原因')).not.toBeVisible();

  await expect(taskPool).toContainText(taskName);
});
