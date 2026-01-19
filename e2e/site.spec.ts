import { test, expect } from '@playwright/test';

test.describe('Admin Authentication', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).toHaveURL(/.*login/);
    });

    test('should show login form', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByRole('heading', { name: /Panel de Administración/i })).toBeVisible();
        await expect(page.getByLabel(/Correo electrónico/i)).toBeVisible();
        await expect(page.getByLabel(/Contraseña/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /Iniciar sesión/i })).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel(/Correo electrónico/i).fill('invalid@example.com');
        await page.getByLabel(/Contraseña/i).fill('wrongpassword');
        await page.getByRole('button', { name: /Iniciar sesión/i }).click();

        await expect(page.getByText(/Credenciales inválidas/i)).toBeVisible();
    });
});

test.describe('Public Site Navigation', () => {
    test('should display homepage with hero', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: /La Verdad Oculta/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Leer artículos/i })).toBeVisible();
    });

    test('should navigate to articles page', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: /Leer artículos/i }).click();
        await expect(page).toHaveURL(/.*articulos/);
        await expect(page.getByRole('heading', { name: /Artículos/i })).toBeVisible();
    });

    test('should navigate to manifesto page', async ({ page }) => {
        await page.goto('/manifiesto');
        await expect(page.getByRole('heading', { name: /Manifiesto/i })).toBeVisible();
    });

    test('should navigate to about page', async ({ page }) => {
        await page.goto('/acerca');
        await expect(page.getByRole('heading', { name: /Acerca de Nosotros/i })).toBeVisible();
    });

    test('should navigate to contact page', async ({ page }) => {
        await page.goto('/contacto');
        await expect(page.getByRole('heading', { name: /Contacto/i })).toBeVisible();
        await expect(page.getByLabel(/Nombre/i)).toBeVisible();
        await expect(page.getByLabel(/Correo electrónico/i)).toBeVisible();
        await expect(page.getByLabel(/Mensaje/i)).toBeVisible();
    });
});

test.describe('Responsive Design', () => {
    test('should show mobile menu on small screens', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Desktop nav should be hidden
        await expect(page.getByRole('navigation').getByRole('link', { name: /Artículos/i })).not.toBeVisible();

        // Mobile menu button should be visible
        const menuButton = page.getByLabel(/Abrir menú/i);
        await expect(menuButton).toBeVisible();

        // Open mobile menu
        await menuButton.click();
        await expect(page.getByRole('link', { name: /Artículos/i })).toBeVisible();
    });
});

test.describe('Theme Toggle', () => {
    test('should toggle dark mode', async ({ page }) => {
        await page.goto('/');

        // Find and click theme toggle
        const themeButton = page.getByLabel(/Tema/i).first();
        await themeButton.click();

        // Check if dark class is applied
        const html = page.locator('html');
        await expect(html).toHaveClass(/dark/);

        // Toggle back
        await themeButton.click();
        await expect(html).toHaveClass(/light/);
    });
});
