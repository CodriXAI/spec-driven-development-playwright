// spec: specs/exceptions.md
// seed: seed.spec.ts

import { test, expect } from '@playwright/test';
import { ExceptionsPage, INITIAL_ROW1_VALUE, ROW2_MAX_WAIT_MS } from '../pages/ExceptionsPage';

test.describe('Excepciones dinámicas', () => {
  let exceptionsPage: ExceptionsPage;

  test.beforeEach(async ({ page }) => {
    // Preparación: abrir la URL al comienzo de cada escenario, sin filas agregadas.
    exceptionsPage = new ExceptionsPage(page);
    await exceptionsPage.open();
    await expect(exceptionsPage.row1Input).toBeVisible();
  });

  test('EXC-01: Espera por la aparición diferida de Row 2', async () => {
    // 1. Verificar que el campo de Row 1 está visible, contiene Pizza y está deshabilitado.
    await exceptionsPage.expectRow1Value(INITIAL_ROW1_VALUE);
    await exceptionsPage.expectRow1Disabled();

    // 2. Verificar que el campo de Row 2 no está visible.
    await exceptionsPage.expectRow2Hidden();

    // 3. Seleccionar Add.
    await exceptionsPage.clickAdd();

    // 4. Esperar hasta 10 segundos a que el campo de Row 2 sea visible.
    await exceptionsPage.expectRow2Visible(ROW2_MAX_WAIT_MS);

    // 5. Verificar que Row 2 está visible y habilitada, y que su valor inicial está vacío.
    await exceptionsPage.expectRow2EnabledAndEmpty();

    // 6. Verificar que Row 1 sigue visible y contiene Pizza.
    await exceptionsPage.expectRow1Value(INITIAL_ROW1_VALUE);
  });

  test('EXC-02: Selección del botón Save visible en Row 2', async () => {
    // 1. Seleccionar Add y esperar hasta 10 segundos a que Row 2 esté visible.
    await exceptionsPage.clickAdd();
    await exceptionsPage.expectRow2Visible(ROW2_MAX_WAIT_MS);

    // 2. Verificar que hay dos botones con name="Save": el de Row 1 oculto y el de Row 2 visible.
    await exceptionsPage.expectSaveButtonsLayout();

    // 3. Escribir Pizza en el campo de Row 2.
    await exceptionsPage.fillRow2('Pizza');

    // 4. Seleccionar Save dentro de Row 2 (no el botón oculto de Row 1).
    await exceptionsPage.saveRow2();

    // 5. Verificar que Row 2 conserva Pizza, queda deshabilitado y aparece Row 2 was saved.
    await exceptionsPage.expectSaved(2, 'Pizza');
  });

  test('EXC-03: Habilitar Row 1 antes de editarla', async () => {
    // 1. Verificar que el campo de Row 1 está visible, contiene Pizza y no está habilitado.
    await exceptionsPage.expectRow1Value(INITIAL_ROW1_VALUE);
    await exceptionsPage.expectRow1Disabled();

    // 2. Seleccionar Edit dentro de Row 1.
    await exceptionsPage.clickEdit();

    // 3. Verificar que el campo de Row 1 queda habilitado.
    await exceptionsPage.expectRow1Enabled();

    // 4. Reemplazar el contenido por Tacos.
    await exceptionsPage.fillRow1('Tacos');

    // 5. Verificar que el campo muestra Tacos.
    await exceptionsPage.expectRow1Value('Tacos');

    // 6. Seleccionar Save dentro de Row 1.
    await exceptionsPage.saveRow1();

    // 7. Verificar que conserva Tacos, vuelve a quedar deshabilitado y aparece Row 1 was saved.
    await exceptionsPage.expectSaved(1, 'Tacos');
  });

  test('EXC-04: Eliminar las instrucciones al agregar Row 2', async () => {
    // 1. Verificar que el texto de instrucciones está visible.
    await exceptionsPage.expectInstructionsVisible();
    await exceptionsPage.expectRow2Hidden();

    // 2. Seleccionar Add.
    await exceptionsPage.clickAdd();

    // 3. Verificar que las instrucciones ya no están visibles justo después de la acción,
    // sin esperar a que termine la carga de Row 2.
    await exceptionsPage.expectInstructionsGone(2_000);

    // 4. Esperar hasta 10 segundos a que Row 2 esté visible.
    await exceptionsPage.expectRow2Visible(ROW2_MAX_WAIT_MS);

    // 5. Verificar que el texto de instrucciones continúa ausente.
    await exceptionsPage.expectInstructionsGone();
  });

  test('EXC-05: Manejar el vencimiento de una espera de 3 segundos', async () => {
    await exceptionsPage.expectRow2Hidden();

    // 1. Seleccionar Add.
    await exceptionsPage.clickAdd();
    const addedAt = Date.now();

    // 2-3. Esperar como máximo 3 segundos a que Row 2 esté visible. El vencimiento es
    // el resultado esperado de esta espera y no debe hacer fallar el caso.
    const appearedWithinShortWait = await exceptionsPage.waitForRow2Within(3_000);
    expect(
      appearedWithinShortWait,
      'Row 2 apareció antes de los 3 segundos: el escenario dejó de reproducir la demora',
    ).toBe(false);

    // 4. Tras el vencimiento, esperar a que Row 2 esté visible sin superar 10 segundos
    // en total desde que se pulsó Add.
    const remainingMs = Math.max(ROW2_MAX_WAIT_MS - (Date.now() - addedAt), 1);
    await exceptionsPage.expectRow2Visible(remainingMs);

    // 5. Verificar que el campo de Row 2 está visible y habilitado.
    await expect(exceptionsPage.row2Input).toBeVisible();
    await expect(exceptionsPage.row2Input).toBeEnabled();
  });
});
