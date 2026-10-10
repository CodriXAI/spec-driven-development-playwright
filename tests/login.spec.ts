// spec: specs/login.md
// seed: seed.spec.ts

import { test, expect, type Page } from '@playwright/test';

const LOGIN_URL = 'https://practicetestautomation.com/practice-test-login/';

async function expectRejectedLogin(page: Page, expectedError: string) {
  await expect(page).not.toHaveURL(/\/logged-in-successfully\//);
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.locator('#error')).toHaveClass(/show/);
  await expect(page.locator('#error')).toHaveText(expectedError);
}

async function expectSuccessfulLogin(page: Page) {
  await expect(page).toHaveURL(/\/logged-in-successfully\//);
  await expect(
    page.getByText('Congratulations student. You successfully logged in!', {
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
}

test.describe('Inicio de sesión', () => {
  test.beforeEach(async ({ page }) => {
    // Preparación: comenzar cada escenario en la página de login sin sesión previa.
    await page.goto(LOGIN_URL);
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('');
    await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('');
  });

  test('LOGIN-01: Acceso exitoso con credenciales válidas', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });

    // 1. Escribir student en Username.
    await username.fill('student');

    // 2. Escribir Password123 en Password.
    await password.fill('Password123');

    // 3. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 4-6. Verificar URL, mensaje de confirmación y enlace Log out.
    await expectSuccessfulLogin(page);
  });

  test('LOGIN-02: Usuario inválido', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir incorrectUser en Username.
    await username.fill('incorrectUser');

    // 2. Escribir Password123 en Password.
    await password.fill('Password123');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y que no se inició sesión.
    await expectRejectedLogin(page, 'Your username is invalid!');
  });

  test('LOGIN-03: Contraseña inválida', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir student en Username.
    await username.fill('student');

    // 2. Escribir incorrectPassword en Password.
    await password.fill('incorrectPassword');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y que no se inició sesión.
    await expectRejectedLogin(page, 'Your password is invalid!');
  });

  test('LOGIN-04: Ambos campos vacíos', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Confirmar que Username y Password están vacíos y que el error no se activó.
    await expect(username).toHaveValue('');
    await expect(password).toHaveValue('');
    await expect(error).not.toHaveClass(/show/);

    // 2. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 3-4. Verificar que el envío activa la validación, conserva el formulario
    // y no navega a la página de éxito.
    await expectRejectedLogin(page, 'Your username is invalid!');
  });

  test('LOGIN-05: Usuario vacío y contraseña válida', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Dejar Username vacío.
    await expect(username).toHaveValue('');

    // 2. Escribir Password123 en Password.
    await password.fill('Password123');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y el error asociado al usuario.
    await expectRejectedLogin(page, 'Your username is invalid!');
  });

  test('LOGIN-06: Contraseña vacía y usuario válido', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir student en Username.
    await username.fill('student');

    // 2. Dejar Password vacío.
    await expect(password).toHaveValue('');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y el error asociado a la contraseña.
    await expectRejectedLogin(page, 'Your password is invalid!');
  });

  test('LOGIN-07: Campos con solo espacios', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir tres espacios en Username.
    await username.fill('   ');

    // 2. Escribir tres espacios en Password.
    await password.fill('   ');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y una respuesta de validación.
    await expectRejectedLogin(page, 'Your username is invalid!');
  });

  test('LOGIN-08: Credenciales válidas con espacios adicionales', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir " student " en Username.
    await username.fill(' student ');

    // 2. Escribir "Password123 " en Password.
    await password.fill('Password123 ');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y un error.
    await expectRejectedLogin(page, 'Your username is invalid!');
  });

  test('LOGIN-09: Credenciales con capitalización diferente', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir Student en Username.
    await username.fill('Student');

    // 2. Escribir password123 en Password.
    await password.fill('password123');

    // 3. Confirmar que el error no se activó antes del envío.
    await expect(error).not.toHaveClass(/show/);

    // 4. Seleccionar Submit.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar el rechazo, el formulario disponible y un error.
    await expectRejectedLogin(page, 'Your username is invalid!');
  });

  test('LOGIN-10: Recuperación después de un intento rechazado', async ({ page }) => {
    const username = page.getByRole('textbox', { name: 'Username' });
    const password = page.getByRole('textbox', { name: 'Password' });
    const error = page.locator('#error');

    // 1. Escribir incorrectUser en Username y Password123 en Password.
    await username.fill('incorrectUser');
    await password.fill('Password123');

    // 2. Seleccionar Submit y verificar el rechazo sin salir de la página.
    await expect(error).not.toHaveClass(/show/);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expectRejectedLogin(page, 'Your username is invalid!');

    // 3. Reemplazar los valores por student y Password123.
    await username.fill('student');
    await password.fill('Password123');

    // 4. Seleccionar Submit nuevamente.
    await page.getByRole('button', { name: 'Submit' }).click();

    // 5. Verificar URL, mensaje de acceso exitoso y enlace Log out.
    await expectSuccessfulLogin(page);
  });
});
