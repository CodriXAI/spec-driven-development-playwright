# Ejercicio 3: Refactor a estándares de proyecto

## Refactor aplicado

Se separaron las responsabilidades entre el Page Object y el test:

- `pages/LoginPage.ts` concentra los localizadores, las acciones del formulario y las verificaciones de resultado.
- `tests/login.spec.ts` conserva los diez escenarios de la spec y expresa sus flujos mediante el Page Object.
- La URL se obtiene de `process.env.BASE_URL`; el usuario y la contraseña válidos se obtienen de `process.env.TEST_USERNAME` y `process.env.TEST_PASSWORD`.
- `playwright.config.ts` ya carga `.env` antes de ejecutar las pruebas. Las variables obligatorias se validan al usarse y producen un error explícito si faltan o están vacías.
- `.env` permanece excluido del control de versiones; `.env.example` documenta los nombres de las variables requeridas.

## Aporte del agente y revisión manual

El agente permitió partir del plan y del código de login existentes para centralizar las acciones y verificaciones repetidas en `LoginPage`, adaptar los diez casos a ese POM y retirar las credenciales y la URL fijas. La revisión técnica comprobó la configuración real de carga de `.env`, mantuvo los mensajes de error esperados por la página, hizo que el mensaje de éxito corresponda al usuario configurado y validó los cambios ejecutando toda la suite de login. Las diez pruebas pasaron.

## Preguntas de reflexión final

### 1. ¿Qué conclusión sacás del uso de agentes para diseñar o acelerar pruebas?

Los agentes son útiles para convertir una spec en un primer plan y una base de pruebas con rapidez, especialmente cuando los escenarios son repetitivos. No reemplazan la revisión: la calidad depende de comprobar que los pasos reflejen el comportamiento real, que las aserciones sean observables y que el código respete las convenciones del proyecto. El mejor resultado se obtiene al usarlos como colaboradores iterativos, no como generadores de código que se acepta sin inspección.

### 2. ¿En qué situaciones los agentes aceleran el proceso y en cuáles necesitaste más intervención humana?

Aceleran el relevamiento inicial, la enumeración de escenarios negativos y límites, la generación de pasos y la repetición de patrones de interacción. Hace falta más intervención humana para aclarar requisitos ambiguos, distinguir contenido preexistente de una respuesta causada por la acción, resolver selectores inestables, establecer qué comportamientos quedan fuera de alcance y asegurar que las verificaciones no sean frágiles.

En este trabajo, la intervención manual incluyó contrastar las expectativas con la página y el código del proyecto, mover las interacciones repetidas al Page Object, sustituir las credenciales y la URL fijas por variables de entorno y añadir errores claros cuando falta configuración.

### 3. ¿Cómo podés hacer más eficiente el uso y código de los agentes?

- Dar contexto del framework, la estructura del repositorio, las convenciones de nombres y el comando de prueba.
- Proporcionar criterios de aceptación concretos, estados iniciales, datos de prueba y límites de alcance.
- Pedir primero un plan verificable y luego una implementación alineada con ese plan.
- Definir desde el comienzo patrones de Page Object, localizadores accesibles, configuración por entorno y manejo de secretos.
- Revisar el resultado contra la spec y ejecutar pruebas específicas; devolver al agente los fallos con evidencia concreta.
- Reutilizar Page Objects y helpers existentes en vez de duplicar lógica entre escenarios.

### 4. ¿Qué información o restricciones deberías dar desde el principio para acertar en el primer intento?

Conviene indicar el objetivo de cada flujo, URL y datos de prueba, comportamiento esperado ante éxito y error, estados iniciales, criterios de aceptación y exclusiones. También deben especificarse el lenguaje y versión, framework, estructura esperada (`tests/`, `pages/`), convenciones del POM, estrategia de carga de `.env`, nombres de variables, comando de validación y restricciones de seguridad, como no imprimir ni versionar secretos. Para la página de login, además, es importante señalar que el mensaje de éxito depende del usuario configurado y que cada caso debe comenzar sin estado previo.

### 5. Si tuvieras que vender un servicio como esta plataforma (Practice Test Automation), ¿cómo diseñarías la propuesta de producto utilizando Spec Driven Development desde el inicio? ¿Seguirías escribiendo código primero o empezarías definiendo specs? ¿Por qué?

Empezaría por definir specs junto con usuarios y equipo: qué problema resuelve el servicio, quién lo usa, qué flujos son críticos, cuáles son sus criterios de aceptación y qué queda fuera del alcance. Las specs servirían como acuerdo verificable entre producto, QA y desarrollo; de ellas se derivarían pruebas, implementación y criterios para revisar cambios. Luego usaría agentes para acelerar borradores de planes y pruebas, manteniendo revisión humana y ejecución en CI como controles.

La propuesta incluiría una iteración continua: explorar la experiencia existente, acordar la spec, generar y revisar pruebas, implementar cambios, validar resultados y actualizar la spec cuando cambien los requisitos. Empezar por las specs reduce ambigüedades y retrabajo, permite rastrear requisitos hasta pruebas y evita optimizar una implementación que no satisface la necesidad. El código seguiría siendo esencial, pero vendría después de acordar qué significa que el producto funcione.
