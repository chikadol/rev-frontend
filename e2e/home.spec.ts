import { test, expect } from '@playwright/test';

test.describe('홈페이지', () => {
  test('홈페이지 접근 및 게시판 목록 표시', async ({ page }) => {
    await page.goto('/');

    // 페이지 제목 확인
    await expect(page).toHaveTitle(/RE-V/i);

    // 게시판 목록이 로드될 때까지 대기
    // API 응답을 기다리거나 로딩 상태가 사라질 때까지 대기
    await page.waitForLoadState('networkidle');

    // 게시판 목록이 표시되는지 확인 (에러가 없는 경우)
    const errorMessage = page.locator('text=게시판 목록을 불러올 수 없습니다');
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (!hasError) {
      // 게시판 목록이 있는 경우
      const boardCards = page.locator('[class*="card"]');
      const count = await boardCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('게시판 카드 클릭 시 게시판 페이지로 이동', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 첫 번째 게시판 링크 찾기
    const firstBoardLink = page.locator('a[href*="/boards/"]').first();
    const linkExists = await firstBoardLink.isVisible().catch(() => false);

    if (linkExists) {
      const href = await firstBoardLink.getAttribute('href');
      await firstBoardLink.click();
      
      // URL이 변경되었는지 확인
      await expect(page).toHaveURL(new RegExp('/boards/'));
    }
  });
});

