# Plan de pruebas: Excepciones dinámicas

## Objetivo

Validar el comportamiento dinámico de la página de práctica de excepciones: aparición diferida de elementos, elementos duplicados u ocultos, campos deshabilitados, elementos que se eliminan del DOM y tiempos de espera acotados. Cada escenario corresponde a uno de los cinco casos publicados en la página (`NoSuchElementException`, `ElementNotInteractableException`, `InvalidElementStateException`, `StaleElementReferenceException` y `TimeoutException`).

## Datos de prueba

- URL: https://practicetestautomation.com/practice-test-exceptions/
- Seed: `seed.spec.ts`
- Textos de ejemplo para escribir en los campos: `Pizza` (fila 2) y `Tacos` (fila 1).
- Elementos publicados en la página:
  - Fila 1 (**Row 1**): campo de texto, botón **Edit** y botón **Save**.
  - Botón **Add**, que agrega la fila 2 (**Row 2**).
  - Indicador `Loading…` y mensaje `Row 2 was added`.
  - Texto de instrucciones: `Push “Add” button to add another row`.
- Tiempos publicados por la página: la fila 2 aparece después de unos 5 segundos. Usar un máximo de 10 segundos como margen de espera y no verificar tiempos exactos.

## Elementos de la página (para el POM)

Nombres lógicos pensados para una futura `pages/ExceptionsPage.ts`, siguiendo la convención de `pages/LoginPage.ts`: un `Locator` por elemento, preferentemente por rol o texto visible, un método `open()`, métodos de acción y métodos `expect*`. Los selectores concretos se fijan en la exploración.

| Nombre lógico | Elemento | Escenarios |
| --- | --- | --- |
| `addButton` | Botón **Add** | EXC-01, 02, 04, 05 |
| `row1Input` | Campo de texto de **Row 1** (deshabilitado al inicio) | EXC-03 |
| `editButton` | Botón **Edit** de la fila 1 | EXC-03 |
| `row2Input` | Campo de texto de **Row 2** (aparece de forma diferida) | EXC-01, 02, 05 |
| `saveButtons` | Los dos elementos `name="Save"`: el de la fila 1 oculto y el de la fila 2 visible | EXC-02 |
| `loadingIndicator` | Indicador `Loading…` | EXC-01 |
| `confirmationMessage` | `Row 2 was added` y la confirmación de guardado | EXC-01, 02 |
| `instructionsText` | Texto `Push “Add” button to add another row` | EXC-04 |

Métodos sugeridos: `open()`, `addRow()`, `editRow1()`, `saveRow2()`, `expectRow2NotVisibleYet()`, `expectRow2Visible()`, `expectInstructionsRemoved()`.

## Page Object

Los escenarios asumen un Page Object `pages/ExceptionsPage.ts` que sigue las convenciones de `pages/LoginPage.ts`: localizadores `readonly` por rol y nombre accesible cuando existan (`getByRole`), `#id` solo si no hay otra opción, un método `open()` y métodos `expect*` para las verificaciones repetidas. Los nombres lógicos que usan los pasos de este plan son:

- Localizadores: campo de **Row 1**, campo de **Row 2**, botón **Edit**, botón **Add**, botones con `name="Save"` (fila 1 y fila 2), indicador `Loading…`, mensaje de confirmación y texto de instrucciones.
- Acciones: `open()`, `clickAdd()`, `clickEdit()`, `fillRow1(texto)`, `fillRow2(texto)` y `saveRow2()`.
- Verificaciones: `expectOnlyRow1()`, `expectRow2Visible()`, `expectRow2NotVisibleFor(ms)`, `expectRow1Disabled()`, `expectRow1Enabled()` y `expectInstructionsGone()`.

Los selectores concretos se definen tras la exploración (ver "Puntos a confirmar"); este plan no los fija.

## Preparación

- Ejecutar cada escenario de forma independiente, comenzando en la URL de la página recién cargada, sin filas agregadas y sin interacción previa.
- El contenido estático de la página incluye `Loading…` y `Row 2 was added` antes de interactuar. Durante la exploración con `browser_snapshot`, confirmar que están ocultos al inicio. Verificar **visibilidad**, no la mera presencia del texto en el DOM.
- Esperar siempre por condición (elemento visible, oculto o con un texto) y nunca con pausas fijas.
- Registrar cualquier diferencia respecto de los criterios esperados como incidencia. No probar persistencia tras recargar, ni pulsar **Add** varias veces seguidas: están fuera del alcance.

### EXC-01: La fila 2 no aparece de inmediato tras pulsar Add

**Caso de la página:** NoSuchElementException.

**Estado inicial:** URL abierta; solo la fila 1 visible; la fila 2 no existe.

1. Verificar que el campo de **Row 1** es visible y que no hay ningún campo de **Row 2** visible.
2. Seleccionar **Add**.
3. Verificar que el campo de **Row 2** todavía no es visible justo después del clic y que el indicador `Loading…` sí lo está.
4. Esperar hasta 10 segundos a que aparezca el campo de **Row 2**.
5. Verificar que el campo de **Row 2** es visible, está habilitado y vacío.
6. Verificar que `Loading…` ya no es visible y que aparece `Row 2 was added`.

**Éxito:** El campo de la fila 2 aparece solo después de la carga y el mensaje de confirmación coincide.
**Fallo:** El campo aparece sin carga previa, nunca aparece dentro de 10 segundos o falta el mensaje `Row 2 was added`.

### EXC-02: Dos botones Save con el mismo nombre; solo uno es interactuable

**Caso de la página:** ElementNotInteractableException.

**Estado inicial:** URL abierta; solo la fila 1 visible.

1. Seleccionar **Add**.
2. Esperar a que el campo de **Row 2** sea visible.
3. Verificar que existen dos elementos con atributo `name="Save"`.
4. Verificar que el primero (fila 1) no es visible y que el segundo (fila 2) sí lo es.
5. Escribir `Pizza` en el campo de **Row 2**.
6. Seleccionar el botón **Save** visible de la fila 2.
7. Verificar que se muestra una confirmación de guardado y que el campo de **Row 2** conserva el valor `Pizza`.

**Éxito:** Se guarda el texto usando el botón visible; el botón de la fila 1 permanece oculto.
**Fallo:** Hay un número distinto de botones `Save`, el botón correcto no es accionable o el texto no queda guardado.

### EXC-03: Campo de la fila 1 deshabilitado hasta pulsar Edit

**Caso de la página:** InvalidElementStateException.

**Estado inicial:** URL abierta; solo la fila 1 visible.

1. Verificar que el campo de **Row 1** está deshabilitado (no editable).
2. Seleccionar **Edit**.
3. Verificar que el campo de **Row 1** queda habilitado.
4. Limpiar el contenido del campo de **Row 1**.
5. Escribir `Tacos` en el campo de **Row 1**.
6. Verificar que el valor del campo es `Tacos`.

**Éxito:** El campo solo es editable después de **Edit** y refleja el texto nuevo.
**Fallo:** El campo ya está habilitado al inicio, sigue deshabilitado tras **Edit** o el valor no cambia.

### EXC-04: El texto de instrucciones desaparece al agregar la fila 2

**Caso de la página:** StaleElementReferenceException.

**Estado inicial:** URL abierta; solo la fila 1 visible.

1. Verificar que el texto `Push “Add” button to add another row` es visible.
2. Seleccionar **Add**.
3. Verificar que el texto de instrucciones ya no es visible ni está presente en la página.
4. Esperar a que el campo de **Row 2** sea visible.
5. Verificar que el texto de instrucciones sigue ausente.

**Éxito:** El texto desaparece tras pulsar **Add** y no vuelve a aparecer.
**Fallo:** El texto permanece visible o reaparece cuando se carga la fila 2.

### EXC-05: La fila 2 tarda más de 3 segundos en aparecer

**Caso de la página:** TimeoutException.

**Estado inicial:** URL abierta; solo la fila 1 visible.

1. Seleccionar **Add**.
2. Verificar que durante los primeros 3 segundos el campo de **Row 2** no se vuelve visible.
3. Esperar hasta 10 segundos en total a que el campo de **Row 2** sea visible.
4. Verificar que el campo de **Row 2** es visible.

**Éxito:** El campo no aparece dentro de los 3 segundos y sí aparece antes de los 10.
**Fallo:** Aparece antes de 3 segundos (el escenario deja de reproducir la demora) o no aparece dentro de 10 segundos.

## Criterio global

En todos los escenarios, los elementos dinámicos deben comportarse como describe la página: la fila 2 aparece de forma diferida, el botón **Save** accionable es el de la fila 2, el campo de la fila 1 solo se edita tras **Edit** y el texto de instrucciones se elimina al agregar la fila. Las verificaciones deben apoyarse en esperas por condición y no en tiempos fijos.

## Puntos a confirmar en la exploración

- Selectores y roles reales de los elementos. Este plan los describe por su texto visible.
- Texto exacto de la confirmación tras pulsar **Save** (EXC-02).
- Si el botón **Save** de la fila 1 pasa a ser visible tras pulsar **Edit** (EXC-03).
- Si el texto de instrucciones desaparece al pulsar **Add** o recién al cargar la fila 2 (EXC-04).
