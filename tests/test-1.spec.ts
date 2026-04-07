import { test, expect } from '@playwright/test';

test('測試：隨機將任務分配給司機後，執行回溯並確認任務退回', async ({ page }) => {
  await page.goto('http://localhost:4200/dashboard/assignment');

  const taskPool = page.locator('#todoList');
  const allTasks = taskPool.locator('div.task-item');

  await expect(allTasks.first()).toBeVisible();

  // === 【隨機抽取邏輯】 ===
  // 取得目前共有幾個任務
  const taskCount = await allTasks.count();
  // 產生 0 到 (總數-1) 的隨機亂數
  const randomIndex = Math.floor(Math.random() * taskCount);

  // 鎖定該隨機任務
  const sourceTask = allTasks.nth(randomIndex);

  // 把任務名稱「讀出來並存進變數」。根據你的 HTML 結構，名稱包在 <strong> 裡
  const taskName = await sourceTask.locator('strong').innerText();
  console.log(`[QA 測試紀錄] 本次抽取的隨機任務為：${taskName}`); // 方便除錯用
  // ========================

  const targetDriver = page.locator('[id="1"]');

  // 2. 執行拖曳 (針對 Angular CDK 終極優化)
  const sourceBox = await sourceTask.boundingBox();
  const targetBox = await targetDriver.boundingBox();

  if (sourceBox && targetBox) {
    // 步驟一：移至任務中心點並按下滑鼠
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();

    // 步驟二：微小移動脫離原位，強制喚醒 Angular CDK 生成拖曳預覽
    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2 + 10,
      sourceBox.y + sourceBox.height / 2 + 10,
    );
    await page.waitForTimeout(100); // 停頓讓動畫跟上

    // 步驟三：平滑移動到目標司機卡片中心
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
      steps: 20,
    });

    await page.mouse.up();
  }

  // 3. 執行回溯操作
  // 精準定位：用剛剛記住的 taskName 去司機區塊找回該任務
  const assignedTask = targetDriver.locator('div.task-item').filter({ hasText: taskName });
  await assignedTask.getByRole('button', { name: '回溯' }).click();

  await page.getByRole('textbox', { name: '請輸入原因' }).fill('44444');
  await page.getByRole('button', { name: '確認' }).click();

  // 4. QA 斷言 (Assert)：驗證回溯是否成功
  await expect(page.getByText('請輸入原因')).not.toBeVisible();

  // 驗證隨機抽到的任務已經回到任務池
  await expect(taskPool).toContainText(taskName);
});
