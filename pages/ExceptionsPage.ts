import { errors, expect, type Locator, type Page } from '@playwright/test';

const EXCEPTIONS_URL = 'https://practicetestautomation.com/practice-test-exceptions/';

export const INITIAL_ROW1_VALUE = 'Pizza';
export const ROW2_MAX_WAIT_MS = 10_000;

export class ExceptionsPage {
  readonly row1: Locator;
  readonly row2: Locator;
  readonly row1Input: Locator;
  readonly row2Input: Locator;
  readonly editButton: Locator;
  readonly addButton: Locator;
  readonly row1SaveButton: Locator;
  readonly row2SaveButton: Locator;
  readonly allSaveButtons: Locator;
  readonly instructions: Locator;

  constructor(private readonly page: Page) {
    // Los contenedores de fila son los únicos selectores por id; el resto va por rol o texto.
    this.row1 = page.locator('#row1');
    this.row2 = page.locator('#row2');
    this.row1Input = this.row1.getByRole('textbox');
    this.row2Input = this.row2.getByRole('textbox');
    this.editButton = this.row1.getByRole('button', { name: 'Edit', exact: true });
    this.addButton = page.getByRole('button', { name: 'Add', exact: true });
    this.row1SaveButton = this.row1.getByRole('button', { name: 'Save', exact: true });
    this.row2SaveButton = this.row2.getByRole('button', { name: 'Save', exact: true });
    // Incluye los botones ocultos: getByRole los excluye por defecto.
    this.allSaveButtons = page.locator('[name="Save"]');
    this.instructions = page.getByText(/Push .Add. button to add another row/);
  }

  async open(): Promise<void> {
    await this.page.goto(EXCEPTIONS_URL);
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  async fillRow1(text: string): Promise<void> {
    await this.row1Input.fill(text);
  }

  async fillRow2(text: string): Promise<void> {
    await this.row2Input.fill(text);
  }

  async saveRow1(): Promise<void> {
    await this.row1SaveButton.click();
  }

  async saveRow2(): Promise<void> {
    await this.row2SaveButton.click();
  }

  /**
   * Espera hasta `timeoutMs` a que el campo de Row 2 sea visible.
   * Devuelve false si la espera vence, para que el vencimiento sea un resultado
   * observable y no un fallo no controlado.
   */
  async waitForRow2Within(timeoutMs: number): Promise<boolean> {
    try {
      await this.row2Input.waitFor({ state: 'visible', timeout: timeoutMs });
      return true;
    } catch (error) {
      if (error instanceof errors.TimeoutError) {
        return false;
      }
      throw error;
    }
  }

  async expectInitialState(): Promise<void> {
    await this.expectRow1Value(INITIAL_ROW1_VALUE);
    await expect(this.row1Input).toBeDisabled();
    await expect(this.row2Input).toBeHidden();
  }

  async expectRow1Value(value: string): Promise<void> {
    await expect(this.row1Input).toBeVisible();
    await expect(this.row1Input).toHaveValue(value);
  }

  async expectRow1Disabled(): Promise<void> {
    await expect(this.row1Input).toBeDisabled();
  }

  async expectRow1Enabled(): Promise<void> {
    await expect(this.row1Input).toBeEnabled();
  }

  async expectRow2Hidden(): Promise<void> {
    await expect(this.row2Input).toBeHidden();
  }

  async expectRow2Visible(timeoutMs: number = ROW2_MAX_WAIT_MS): Promise<void> {
    await expect(this.row2Input).toBeVisible({ timeout: timeoutMs });
  }

  async expectRow2EnabledAndEmpty(): Promise<void> {
    await expect(this.row2Input).toBeEnabled();
    await expect(this.row2Input).toHaveValue('');
  }

  async expectSaved(row: 1 | 2, value: string): Promise<void> {
    const input = row === 1 ? this.row1Input : this.row2Input;
    await expect(input).toHaveValue(value);
    await expect(input).toBeDisabled();
    await expect(this.page.getByText(`Row ${row} was saved`, { exact: true })).toBeVisible();
  }

  async expectSaveButtonsLayout(): Promise<void> {
    // Dos botones con name="Save": el de Row 1 oculto y el de Row 2 visible.
    await expect(this.allSaveButtons).toHaveCount(2);
    await expect(this.allSaveButtons.first()).toBeHidden();
    await expect(this.allSaveButtons.last()).toBeVisible();
  }

  async expectInstructionsVisible(): Promise<void> {
    await expect(this.instructions).toBeVisible();
  }

  async expectInstructionsGone(timeoutMs?: number): Promise<void> {
    await expect(this.instructions).toBeHidden({ timeout: timeoutMs });
  }
}
