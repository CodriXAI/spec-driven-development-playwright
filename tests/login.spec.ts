// spec: specs/login.md
// seed: seed.spec.ts

import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

function requireEnvironmentVariable(name: 'TEST_USERNAME' | 'TEST_PASSWORD'): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const validUsername = requireEnvironmentVariable('TEST_USERNAME');
const validPassword = requireEnvironmentVariable('TEST_PASSWORD');
const invalidUsername = `${validUsername}_invalid`;
const invalidPassword = `${validPassword}_invalid`;

test.describe('Inicio de sesión', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Preparación: comenzar cada escenario en la página de login sin sesión previa.
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.expectEmptyForm();
  });

  test('LOGIN-01: Acceso exitoso con credenciales válidas', async () => {
    // 1-2. Escribir las credenciales válidas configuradas en .env.
    await loginPage.fillCredentials(validUsername, validPassword);

    // 3. Seleccionar Submit.
    await loginPage.submit();

    // 4-6. Verificar URL, mensaje de confirmación y enlace Log out.
    await loginPage.expectSuccessfulLogin();
  });

  test('LOGIN-02: Usuario inválido', async () => {
    // 1-2. Escribir un usuario inválido y la contraseña válida de .env.
    await loginPage.fillCredentials(invalidUsername, validPassword);

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y que no se inició sesión.
    await loginPage.expectRejectedLogin('Your username is invalid!');
  });

  test('LOGIN-03: Contraseña inválida', async () => {
    // 1-2. Escribir el usuario válido de .env y una contraseña inválida.
    await loginPage.fillCredentials(validUsername, invalidPassword);

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y que no se inició sesión.
    await loginPage.expectRejectedLogin('Your password is invalid!');
  });

  test('LOGIN-04: Ambos campos vacíos', async () => {
    // 1. Confirmar que Username y Password están vacíos y que el error no se activó.
    await loginPage.expectEmptyForm();
    await loginPage.expectErrorNotShown();

    // 2. Seleccionar Submit.
    await loginPage.submit();

    // 3-4. Verificar que el envío activa la validación, conserva el formulario
    // y no navega a la página de éxito.
    await loginPage.expectRejectedLogin('Your username is invalid!');
  });

  test('LOGIN-05: Usuario vacío y contraseña válida', async () => {
    // 1. Dejar Username vacío.
    await loginPage.fillUsername('');

    // 2. Escribir la contraseña válida configurada en .env.
    await loginPage.fillPassword(validPassword);

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y el error asociado al usuario.
    await loginPage.expectRejectedLogin('Your username is invalid!');
  });

  test('LOGIN-06: Contraseña vacía y usuario válido', async () => {
    // 1. Escribir el usuario válido configurado en .env.
    await loginPage.fillUsername(validUsername);

    // 2. Dejar Password vacío.
    await loginPage.fillPassword('');

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y el error asociado a la contraseña.
    await loginPage.expectRejectedLogin('Your password is invalid!');
  });

  test('LOGIN-07: Campos con solo espacios', async () => {
    // 1-2. Escribir tres espacios en Username y Password.
    await loginPage.fillCredentials('   ', '   ');

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y una respuesta de validación.
    await loginPage.expectRejectedLogin('Your username is invalid!');
  });

  test('LOGIN-08: Credenciales válidas con espacios adicionales', async () => {
    // 1-2. Añadir espacios a las credenciales válidas de .env.
    await loginPage.fillCredentials(`${validUsername} `, `${validPassword} `);

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y un error.
    await loginPage.expectRejectedLogin('Your username is invalid!');
  });

  test('LOGIN-09: Credenciales con capitalización diferente', async () => {
    const differentlyCasedUsername =
      validUsername.charAt(0).toUpperCase() + validUsername.slice(1);

    // 1-2. Cambiar la capitalización de las credenciales válidas de .env.
    await loginPage.fillCredentials(differentlyCasedUsername, validPassword.toLowerCase());

    // 3. Confirmar que el error no se activó antes del envío.
    await loginPage.expectErrorNotShown();

    // 4. Seleccionar Submit.
    await loginPage.submit();

    // 5. Verificar el rechazo, el formulario disponible y un error.
    await loginPage.expectRejectedLogin('Your username is invalid!');
  });

  test('LOGIN-10: Recuperación después de un intento rechazado', async () => {
    // 1. Escribir un usuario inválido y la contraseña válida de .env.
    await loginPage.fillCredentials(invalidUsername, validPassword);

    // 2. Seleccionar Submit y verificar el rechazo sin salir de la página.
    await loginPage.expectErrorNotShown();
    await loginPage.submit();
    await loginPage.expectRejectedLogin('Your username is invalid!');

    // 3. Reemplazar los valores por las credenciales válidas de .env.
    await loginPage.fillCredentials(validUsername, validPassword);

    // 4. Seleccionar Submit nuevamente.
    await loginPage.submit();

    // 5. Verificar URL, mensaje de acceso exitoso y enlace Log out.
    await loginPage.expectSuccessfulLogin();
  });
});
