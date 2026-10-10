# Plan de pruebas: Inicio de sesión

## Objetivo

Validar el acceso exitoso y el rechazo de credenciales inválidas, vacías o en los límites en la página de práctica.

## Datos de prueba

- URL: https://practicetestautomation.com/practice-test-login/
- Credenciales válidas publicadas en la página: usuario `student`, contraseña `Password123`.
- Destino esperado tras el acceso: `/logged-in-successfully/`.
- Mensajes de error publicados por la página: `Your username is invalid!` y `Your password is invalid!`.

## Preparación

- Ejecutar cada escenario de forma independiente, comenzando en la URL de login, con ambos campos vacíos y sin sesión previa.
- La página mostró `Your username is invalid!` antes de enviar el formulario durante la exploración. En casos negativos, comprobar que el intento no navega al destino exitoso y que el formulario sigue disponible; no considerar suficiente que el texto de error ya esté visible.
- Registrar cualquier diferencia respecto de los criterios esperados como incidencia. No probar bloqueo por intentos, recuperación de contraseña ni creación de usuarios: están fuera del alcance.

## Escenarios

### LOGIN-01: Acceso exitoso con credenciales válidas

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir `student` en **Username**.
2. Escribir `Password123` en **Password**.
3. Seleccionar **Submit**.
4. Verificar que la URL contiene `/logged-in-successfully/`.
5. Verificar que aparece `Congratulations student. You successfully logged in!`.
6. Verificar que el enlace **Log out** está visible.

**Éxito:** Coinciden la URL, el mensaje de confirmación y el enlace de salida.
**Fallo:** Se rechaza el acceso o falta cualquiera de los resultados esperados.

### LOGIN-02: Usuario inválido

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir `incorrectUser` en **Username**.
2. Escribir `Password123` en **Password**.
3. Seleccionar **Submit**.
4. Verificar `Your username is invalid!` después del envío.
5. Verificar que el formulario continúa visible y no se inició sesión.

**Éxito:** Se rechaza el acceso con el error de usuario esperado.
**Fallo:** Se inicia sesión o el rechazo no se indica correctamente.

### LOGIN-03: Contraseña inválida

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir `student` en **Username**.
2. Escribir `incorrectPassword` en **Password**.
3. Seleccionar **Submit**.
4. Verificar `Your password is invalid!` después del envío.
5. Verificar que el formulario continúa visible y no se inició sesión.

**Éxito:** Se rechaza el acceso con el error de contraseña esperado.
**Fallo:** Se inicia sesión o el rechazo no se indica correctamente.

### LOGIN-04: Ambos campos vacíos

**Estado inicial:** URL de login abierta; ambos campos vacíos.

1. Confirmar que **Username** y **Password** están vacíos.
2. Seleccionar **Submit**.
3. Verificar que se mantiene el formulario y no se navega a la página de éxito.
4. Verificar el mensaje de validación resultante, distinguiéndolo del contenido que ya aparecía antes del envío.

**Éxito:** No se inicia sesión y el formulario da una respuesta de validación.
**Fallo:** Se concede acceso o no se puede observar una respuesta verificable.

### LOGIN-05: Usuario vacío y contraseña válida

**Estado inicial:** URL de login abierta; campos vacíos.

1. Dejar **Username** vacío.
2. Escribir `Password123` en **Password**.
3. Seleccionar **Submit**.
4. Verificar que no se inicia sesión, que el formulario sigue visible y que se muestra un error asociado al usuario.

**Éxito:** Se rechaza el intento y se indica el error de usuario.
**Fallo:** Se concede acceso o no se informa el rechazo.

### LOGIN-06: Contraseña vacía y usuario válido

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir `student` en **Username**.
2. Dejar **Password** vacío.
3. Seleccionar **Submit**.
4. Verificar que no se inicia sesión, que el formulario sigue visible y que se muestra un error asociado a la contraseña.

**Éxito:** Se rechaza el intento y se indica el error de contraseña.
**Fallo:** Se concede acceso o no se informa el rechazo.

### LOGIN-07: Campos con solo espacios

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir tres espacios en **Username**.
2. Escribir tres espacios en **Password**.
3. Seleccionar **Submit**.
4. Verificar que no se inicia sesión, el formulario permanece visible y hay una respuesta de validación.

**Éxito:** Los valores de espacios se rechazan.
**Fallo:** Los espacios autentican o no se indica el rechazo.

### LOGIN-08: Credenciales válidas con espacios adicionales

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir ` student ` (espacio inicial y final) en **Username**.
2. Escribir `Password123 ` (espacio final) en **Password**.
3. Seleccionar **Submit**.
4. Verificar que no se inicia sesión, el formulario permanece visible y se muestra un error.

**Éxito:** No se autentican valores distintos de las credenciales exactas publicadas.
**Fallo:** Los espacios adicionales conceden acceso inesperadamente.

### LOGIN-09: Credenciales con capitalización diferente

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir `Student` en **Username**.
2. Escribir `password123` en **Password**.
3. Seleccionar **Submit**.
4. Verificar que no se inicia sesión, el formulario permanece visible y se muestra un error.

**Éxito:** La variante de capitalización no autentica credenciales diferentes de las publicadas.
**Fallo:** Se inicia sesión inesperadamente o no se presenta el rechazo.

### LOGIN-10: Recuperación después de un intento rechazado

**Estado inicial:** URL de login abierta; campos vacíos.

1. Escribir `incorrectUser` en **Username** y `Password123` en **Password**.
2. Seleccionar **Submit** y verificar el rechazo sin salir de la página.
3. Reemplazar los valores por `student` y `Password123`.
4. Seleccionar **Submit** nuevamente.
5. Verificar la URL, el mensaje de acceso exitoso y el enlace **Log out** descritos en LOGIN-01.

**Éxito:** El error previo no impide el acceso posterior con credenciales válidas.
**Fallo:** El formulario queda bloqueado o el intento válido no completa el login.

## Criterio global

Los intentos válidos deben alcanzar la página de éxito con el mensaje y el enlace esperados. Los intentos inválidos o incompletos deben permanecer en el formulario sin iniciar sesión y presentar una respuesta de rechazo verificable.