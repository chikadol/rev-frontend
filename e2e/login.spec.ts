import { test, expect } from '@playwright/test';

test.describe('로그인', () => {
  test('로그인 페이지 접근', async ({ page }) => {
    await page.goto('/login');

    // 로그인 폼 요소 확인
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /로그인/i })).toBeVisible();
  });

  test('이메일과 비밀번호 입력', async ({ page }) => {
    await page.goto('/login');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('test@example.com');
    await passwordInput.fill('password123');

    await expect(emailInput).toHaveValue('test@example.com');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('회원가입 링크 클릭', async ({ page }) => {
    await page.goto('/login');

    const registerLink = page.getByRole('link', { name: /회원가입/i });
    await registerLink.click();

    // 회원가입 페이지로 이동 확인
    await expect(page).toHaveURL(/\/register/);
  });

  test('소셜 로그인 버튼 표시', async ({ page }) => {
    await page.goto('/login');

    // 소셜 로그인 버튼들이 표시되는지 확인
    const googleButton = page.locator('a[href*="/oauth2/authorization/google"]');
    const naverButton = page.locator('a[href*="/oauth2/authorization/naver"]');
    const kakaoButton = page.locator('a[href*="/oauth2/authorization/kakao"]');

    await expect(googleButton).toBeVisible();
    await expect(naverButton).toBeVisible();
    await expect(kakaoButton).toBeVisible();
  });
});

