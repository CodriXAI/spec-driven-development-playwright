# Plan de pruebas: Excepciones dinámicas

## Objetivo

Validar el comportamiento de la lista dinámica de alimentos en la página de práctica: carga diferida de la segunda fila, selección del botón **Save** correcto, edición de la primera fila, eliminación del texto de instrucciones y manejo de una espera corta que vence antes de que aparezca la segunda fila.

Los nombres de los casos corresponden a los ejemplos de excepciones Selenium publicados en la página. Las pruebas de Playwright verifican el comportamiento observable y no deben provocar deliberadamente excepciones de Selenium ni dejar una aserción fallida sin manejar.

## Datos de prueba

- URL: https://practicetestautomation.com/practice-test-exceptions/
- Seed: `seed.spec.ts`
- Valores iniciales observados: **Row 1** contiene `Pizza` y está deshabilitado.
- Texto para editar **Row 1**: `Tacos`.
- Texto para **Row 2**: `Pizza`.
- La página indica que **Row 2** tarda aproximadamente 5 segundos en aparecer. Usar 10 segundos como límite máximo para la espera eventual; no exigir un tiempo exacto de aparición.

## Preparación

- Ejecutar cada escenario de forma independiente. Abrir la URL al comienzo del caso y comprobar el estado inicial antes de interactuar.
- Estado inicial observado: existe una sola fila; su campo contiene `Pizza` y está deshabilitado. El botón **Edit** y el botón **Add** están disponibles.
- El texto `Row 2 was added` aparece visible incluso antes de pulsar **Add**. No usar su mera visibilidad como confirmación de que la fila se agregó ni como evidencia de una transición.
- No se observó un indicador `Loading…` en la página. No esperarlo como parte del flujo.
- Esperar por estados de los controles (visibilidad, habilitación, valor) en vez de usar pausas fijas, excepto en EXC-05, donde el límite corto de 3 segundos es el comportamiento bajo prueba.
- Registrar como incidencia cualquier diferencia entre el comportamiento observado y los criterios de cada caso. No probar persistencia tras recargar, eliminación de filas ni agregar varias filas: están fuera del alcance.

### EXC-01: Espera por la aparición diferida de Row 2

**Caso de la página:** NoSuchElementException.

**Estado inicial:** página recién abierta; solo **Row 1** está presente.

1. Verificar que el campo de **Row 1** está visible, contiene `Pizza` y está deshabilitado.
2. Verificar que el campo de **Row 2** no está visible.
3. Seleccionar **Add**.
4. Esperar hasta 10 segundos, desde el envío de la acción, a que el campo de **Row 2** sea visible. No asumir que el campo existe inmediatamente después del clic.
5. Verificar que **Row 2** está visible y habilitada, y que su valor inicial está vacío.
6. Verificar que **Row 1** sigue visible y contiene `Pizza`.

**Éxito:** La segunda fila aparece dentro del límite y ambas filas conservan el estado y valores esperados.
**Fallo:** La fila aparece con un estado inesperado, no aparece dentro del límite o se altera **Row 1**.

### EXC-02: Selección del botón Save visible en Row 2

**Caso de la página:** ElementNotInteractableException.

**Estado inicial:** página recién abierta; solo **Row 1** está presente.

1. Seleccionar **Add** y esperar hasta 10 segundos a que **Row 2** esté visible.
2. Verificar que hay dos botones cuyo atributo `name` es `Save`: el de **Row 1** está oculto y el de **Row 2** está visible.
3. Escribir `Pizza` en el campo de **Row 2**.
4. Seleccionar **Save** dentro de **Row 2**; no seleccionar el botón oculto de **Row 1** ni depender únicamente del orden global de botones con el mismo nombre.
5. Verificar que el campo de **Row 2** conserva `Pizza`, queda deshabilitado y que aparece la confirmación `Row 2 was saved`.

**Éxito:** Se guarda el valor en la fila correcta y se muestra su confirmación.
**Fallo:** Se selecciona un control distinto, el valor no se conserva, el campo no queda deshabilitado o no aparece la confirmación.

### EXC-03: Habilitar Row 1 antes de editarla

**Caso de la página:** InvalidElementStateException.

**Estado inicial:** página recién abierta; **Row 1** contiene `Pizza` y está deshabilitada.

1. Verificar que el campo de **Row 1** está visible, contiene `Pizza` y no está habilitado para edición.
2. Seleccionar **Edit** dentro de **Row 1**.
3. Verificar que el campo de **Row 1** queda habilitado.
4. Reemplazar el contenido por `Tacos`.
5. Verificar que el campo muestra `Tacos`.
6. Seleccionar **Save** dentro de **Row 1**.
7. Verificar que el campo conserva `Tacos`, vuelve a quedar deshabilitado y aparece `Row 1 was saved`.

**Éxito:** El campo solo puede editarse tras **Edit** y el nuevo valor se guarda.
**Fallo:** El campo no respeta el cambio de estado, no acepta el nuevo valor o no confirma el guardado.

### EXC-04: Eliminar las instrucciones al agregar Row 2

**Caso de la página:** StaleElementReferenceException.

**Estado inicial:** página recién abierta; el texto `Push “Add” button to add another row` está visible y **Row 2** no está visible.

1. Verificar que el texto de instrucciones está visible.
2. Seleccionar **Add**.
3. Verificar que el texto de instrucciones ya no está visible inmediatamente después de la acción; no esperar a que termine la carga de **Row 2** para comprobar su desaparición.
4. Esperar hasta 10 segundos a que **Row 2** esté visible.
5. Verificar que el texto de instrucciones continúa ausente.

**Éxito:** Las instrucciones desaparecen al agregar la fila y no vuelven a mostrarse durante el caso.
**Fallo:** Las instrucciones permanecen visibles o vuelven a aparecer.

### EXC-05: Manejar el vencimiento de una espera de 3 segundos

**Caso de la página:** TimeoutException.

**Estado inicial:** página recién abierta; **Row 2** no está visible.

1. Seleccionar **Add**.
2. Esperar como máximo 3 segundos a que el campo de **Row 2** esté visible.
3. Dado que la página documenta una demora aproximada de 5 segundos, comprobar que la espera corta vence sin que esto haga fallar el caso completo. Registrar el vencimiento como resultado esperado de esta espera, no como fallo de la prueba.
4. Tras el vencimiento, esperar a que **Row 2** esté visible, sin superar 10 segundos en total desde que se pulsó **Add**.
5. Verificar que el campo de **Row 2** está visible y habilitado.

**Éxito:** La espera de visibilidad de 3 segundos vence antes de que aparezca la fila, y la fila aparece dentro del límite total.
**Fallo:** La fila aparece antes de que venza la espera de 3 segundos, no aparece antes del límite total o el vencimiento de la espera corta termina el caso como fallo no controlado.

## Criterio global

La página debe comenzar con una única fila editable solo después de pulsar **Edit**. Al pulsar **Add**, las instrucciones desaparecen y la segunda fila aparece de forma diferida. Las acciones de guardado deben operar sobre la fila correspondiente, conservar el valor y devolver el campo a estado deshabilitado. Toda espera debe tener un límite explícito y los vencimientos esperados deben manejarse como parte del escenario, no como fallos no controlados.
