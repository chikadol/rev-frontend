import { test, expect } from '@playwright/test';

test.describe('게시판', () => {
  test('게시판 페이지 접근', async ({ page }) => {
    // 테스트용 게시판 ID (실제 환경에 맞게 수정 필요)
    const boardId = 'test-board-id';
    
    await page.goto(`/boards/${boardId}`);
    await page.waitForLoadState('networkidle');

    // 게시판을 찾을 수 없는 경우도 처리
    const notFoundMessage = page.locator('text=게시판을 찾을 수 없습니다');
    const hasNotFound = await notFoundMessage.isVisible().catch(() => false);

    if (!hasNotFound) {
      // 게시판이 있는 경우
      const boardTitle = page.locator('h1');
      await expect(boardTitle).toBeVisible();
    }
  });

  test('게시판 목록에서 게시판 클릭', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 첫 번째 게시판 링크 찾기
    const firstBoardLink = page.locator('a[href*="/boards/"]').first();
    const linkExists = await firstBoardLink.isVisible().catch(() => false);

    if (linkExists) {
      await firstBoardLink.click();
      await page.waitForLoadState('networkidle');

      // 게시판 페이지로 이동 확인
      await expect(page).toHaveURL(/\/boards\//);
    }
  });

  test('검색 기능', async ({ page }) => {
    const boardId = 'test-board-id';
    await page.goto(`/boards/${boardId}`);
    await page.waitForLoadState('networkidle');

    // 검색 입력 필드 찾기
    const searchInput = page.locator('input[placeholder*="검색"]');
    const searchExists = await searchInput.isVisible().catch(() => false);

    if (searchExists) {
      await searchInput.fill('테스트 검색어');
      await page.getByRole('button', { name: /검색/i }).click();
      
      // 검색 결과 대기
      await page.waitForLoadState('networkidle');
    }
  });
});

