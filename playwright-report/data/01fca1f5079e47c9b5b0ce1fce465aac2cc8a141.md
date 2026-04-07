# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-1.spec.ts >> 測試：隨機將任務分配給司機後，執行回溯並確認任務退回
- Location: tests\test-1.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[id="1"]').locator('div.task-item').filter({ hasText: '任務 E' }).getByRole('button', { name: '回溯' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - heading "task-assignment" [level=2] [ref=e5]
    - generic [ref=e6]:
      - link "首頁" [ref=e7] [cursor=pointer]:
        - /url: /
      - link "關於" [ref=e8] [cursor=pointer]:
        - /url: /dashboard/about
      - link "服務" [ref=e9] [cursor=pointer]:
        - /url: /dashboard/serve
  - generic [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]: 任務池
      - generic [ref=e15]:
        - strong [ref=e17]: 任務 C
        - strong [ref=e19]: 任務 B
        - strong [ref=e21]: 任務 I
        - strong [ref=e23]: 任務 O
        - strong [ref=e25]: 任務 P
        - strong [ref=e27]: 任務 Q
        - strong [ref=e29]: 任務 R
        - strong [ref=e31]: 任務 D
        - strong [ref=e33]: 任務 M
        - strong [ref=e35]: 任務 L
        - strong [ref=e37]: 任務 T
        - strong [ref=e39]: 任務 K
        - strong [ref=e41]: 任務 H
        - strong [ref=e43]: 任務 G
        - strong [ref=e45]: 任務 A
        - strong [ref=e47]: 任務 J
        - strong [ref=e49]: 任務 F
    - generic [ref=e51]:
      - generic [ref=e52]: 司機的行程
      - strong [ref=e55]: "洪金鑫 (ID: 1)"
      - strong [ref=e58]: "於思淼 (ID: 2)"
      - strong [ref=e61]: "薛天宇 (ID: 4)"
      - strong [ref=e64]: "盧天磊 (ID: 5)"
      - generic [ref=e65]:
        - strong [ref=e67]: "丁曉博 (ID: 3)"
        - generic [ref=e68]:
          - text: 任務 N
          - button "回溯" [ref=e69]
      - generic [ref=e70]:
        - strong [ref=e72]: "蔣苑博 (ID: 6)"
        - generic [ref=e73]:
          - text: 任務 S
          - button "回溯" [ref=e74]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('測試：隨機將任務分配給司機後，執行回溯並確認任務退回', async ({ page }) => {
  4  |   await page.goto('http://localhost:4200/dashboard/assignment');
  5  | 
  6  |   const taskPool = page.locator('#todoList');
  7  |   const allTasks = taskPool.locator('div.task-item');
  8  | 
  9  |   await expect(allTasks.first()).toBeVisible();
  10 | 
  11 |   // === 【隨機抽取邏輯】 ===
  12 |   // 取得目前共有幾個任務
  13 |   const taskCount = await allTasks.count();
  14 |   // 產生 0 到 (總數-1) 的隨機亂數
  15 |   const randomIndex = Math.floor(Math.random() * taskCount);
  16 | 
  17 |   // 鎖定該隨機任務
  18 |   const sourceTask = allTasks.nth(randomIndex);
  19 | 
  20 |   // 把任務名稱「讀出來並存進變數」。根據你的 HTML 結構，名稱包在 <strong> 裡
  21 |   const taskName = await sourceTask.locator('strong').innerText();
  22 |   console.log(`[QA 測試紀錄] 本次抽取的隨機任務為：${taskName}`); // 方便除錯用
  23 |   // ========================
  24 | 
  25 |   const targetDriver = page.locator('[id="1"]');
  26 | 
  27 |   // 2. 執行拖曳 (針對 Angular CDK 終極優化)
  28 |   const sourceBox = await sourceTask.boundingBox();
  29 |   const targetBox = await targetDriver.boundingBox();
  30 | 
  31 |   if (sourceBox && targetBox) {
  32 |     // 步驟一：移至任務中心點並按下滑鼠
  33 |     await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  34 |     await page.mouse.down();
  35 | 
  36 |     // 步驟二：微小移動脫離原位，強制喚醒 Angular CDK 生成拖曳預覽
  37 |     await page.mouse.move(
  38 |       sourceBox.x + sourceBox.width / 2 + 10,
  39 |       sourceBox.y + sourceBox.height / 2 + 10,
  40 |     );
  41 |     await page.waitForTimeout(100); // 停頓讓動畫跟上
  42 | 
  43 |     // 步驟三：平滑移動到目標司機卡片中心
  44 |     await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
  45 |       steps: 20,
  46 |     });
  47 | 
  48 |     await page.mouse.up();
  49 |   }
  50 | 
  51 |   // 3. 執行回溯操作
  52 |   // 精準定位：用剛剛記住的 taskName 去司機區塊找回該任務
  53 |   const assignedTask = targetDriver.locator('div.task-item').filter({ hasText: taskName });
> 54 |   await assignedTask.getByRole('button', { name: '回溯' }).click();
     |                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  55 | 
  56 |   await page.getByRole('textbox', { name: '請輸入原因' }).fill('44444');
  57 |   await page.getByRole('button', { name: '確認' }).click();
  58 | 
  59 |   // 4. QA 斷言 (Assert)：驗證回溯是否成功
  60 |   await expect(page.getByText('請輸入原因')).not.toBeVisible();
  61 | 
  62 |   // 驗證隨機抽到的任務已經回到任務池
  63 |   await expect(taskPool).toContainText(taskName);
  64 | });
  65 | 
```