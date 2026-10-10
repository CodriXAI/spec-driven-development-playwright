# Spec-Driven Development con Playwright

Proyecto de práctica de automatización end-to-end que explora un flujo **Spec-Driven Development (SDD)**: documentar el comportamiento esperado, convertirlo en escenarios, automatizarlos con Playwright y revisar los resultados. El repositorio usa las páginas públicas de Practice Test Automation como sistema bajo prueba; no implementa una aplicación web propia.

## Índice

1. [Acerca del proyecto](#1-acerca-del-proyecto)
2. [Tecnologías](#2-tecnologías)
3. [Requisitos previos](#3-requisitos-previos)
4. [Configuración del entorno](#4-configuración-del-entorno)
5. [Cómo instalar y ejecutar](#5-cómo-instalar-y-ejecutar)
6. [Specs y cobertura](#6-specs-y-cobertura)
7. [Estructura del proyecto](#7-estructura-del-proyecto)
8. [Conclusiones](#8-conclusiones)

## 1. Acerca del proyecto

El repositorio reúne planes de prueba, Page Objects y pruebas E2E de dos páginas de práctica:

- **Login:** acceso exitoso, rechazo de credenciales incorrectas o incompletas, entradas límite y recuperación luego de un intento rechazado.
- **Exceptions:** carga diferida de una fila, edición y guardado de campos, selección de controles homónimos y esperas con tiempo límite.

Las specs en `specs/` describen estados iniciales, pasos y resultados esperados. Las suites en `tests/` implementan esos escenarios y delegan las interacciones y verificaciones de página a los Page Objects de `pages/`.

## 2. Tecnologías

- **Node.js** (versión 20 o superior) y **npm** para ejecutar el proyecto y administrar dependencias.
- **TypeScript** para las pruebas, Page Objects y configuración.
- **Playwright Test** para automatización del navegador, aserciones web-first y ejecución de la suite.
- **dotenv** para cargar variables locales desde `.env`.
- **GitHub Copilot agents** configurados en `.github/agents/` para apoyar la planificación, generación y reparación de pruebas.

Las dependencias de desarrollo y sus versiones están declaradas en `package.json` y `package-lock.json`. La configuración actual no declara proyectos de navegador; Playwright ejecuta su navegador por defecto, Chromium.

## 3. Requisitos previos

- Node.js 20 o superior y npm.
- Acceso a Internet para instalar dependencias y visitar las páginas públicas de práctica.
- El navegador de Playwright instalado localmente.
- Credenciales válidas de la página de login configuradas localmente para ejecutar los casos de autenticación.

## 4. Configuración del entorno

1. Crear el archivo local `.env` a partir de la plantilla:

   ```bash
   cp .env.example .env
   ```

2. Completar las variables:

   ```dotenv
   BASE_URL=https://practicetestautomation.com/practice-test-login/
   EXCEPTIONS_URL=https://practicetestautomation.com/practice-test-exceptions/
   TEST_USERNAME=<usuario-de-prueba>
   TEST_PASSWORD=<contraseña-de-prueba>
   ```

   `BASE_URL` se utiliza como URL de navegación del login y también como `use.baseURL` de Playwright. `TEST_USERNAME` y `TEST_PASSWORD` proporcionan las credenciales válidas de los escenarios de login. El mensaje de éxito esperado se construye con `TEST_USERNAME`.

   `EXCEPTIONS_URL` está documentada en la plantilla, pero el Page Object de excepciones actualmente define su URL en el código; modificar solo esa variable no cambia la URL visitada.

3. No compartir ni versionar `.env`: está excluido en `.gitignore`. Usar `.env.example` para documentar nombres de variables sin secretos.

## 5. Cómo instalar y ejecutar

Instalar las dependencias:

```bash
npm ci
```

Instalar Chromium para Playwright:

```bash
npx playwright install chromium
```

Ejecutar todas las pruebas:

```bash
npx playwright test
```

Ejecutar una suite específica:

```bash
npx playwright test tests/login.spec.ts
npx playwright test tests/exceptions.spec.ts
```

Abrir el reporte HTML generado por Playwright:

```bash
npx playwright test --reporter=html
npx playwright show-report
```

El script `npm test` en `package.json` todavía es el placeholder inicial de npm y no ejecuta Playwright; por eso se recomienda usar los comandos `npx playwright` anteriores.

## 6. Specs y cobertura

| Spec | Suite automatizada | Cobertura principal |
| --- | --- | --- |
| `specs/login.md` | `tests/login.spec.ts` | Éxito, credenciales inválidas, campos vacíos, espacios, capitalización y recuperación tras rechazo. |
| `specs/exceptions.md` | `tests/exceptions.spec.ts` | Aparición diferida de Row 2, guardado por fila, edición de Row 1, desaparición de instrucciones y vencimiento controlado de espera. |

Las pruebas son E2E contra un sitio externo y requieren disponibilidad de red y de la página. Los resultados pueden verse afectados por cambios o indisponibilidad del sitio de práctica.

## 7. Estructura del proyecto

```text
.
├── .env.example
├── .github/
│   ├── agents/
│   │   ├── playwright-test-generator.agent.md
│   │   ├── playwright-test-healer.agent.md
│   │   └── playwright-test-planner.agent.md
│   └── workflows/
│       └── copilot-setup-steps.yml
├── .vscode/
│   └── mcp.json
├── docs/
│   ├── challenge_endava.pdf
│   ├── exercise_3.md
│   └── model-comparison.md
├── pages/
│   ├── ExceptionsPage.ts
│   └── LoginPage.ts
├── specs/
│   ├── README.md
│   ├── exceptions.md
│   └── login.md
├── tests/
│   ├── exceptions.spec.ts
│   └── login.spec.ts
├── seed.spec.ts
├── playwright.config.ts
├── package.json
├── package-lock.json
├── .gitignore
└── LICENSE
```

- **`specs/`**: planes funcionales y criterios de aceptación.
- **`pages/`**: Page Objects con localizadores, acciones y aserciones reutilizables.
- **`tests/`**: escenarios de Playwright trazables a las specs.
- **`seed.spec.ts`**: escenario semilla disponible para preparar los agentes generadores.
- **`.github/agents/`**: definiciones de agentes de planificación, generación y reparación.
- **`docs/`**: material del desafío y reflexiones/comparativas del trabajo.
- **`playwright.config.ts`**: configuración de Playwright y carga de `.env`.

Los directorios generados como `node_modules/` y `test-results/`, y el archivo `.env`, no forman parte del árbol fuente versionado.

## 8. Conclusiones

El proyecto muestra el valor de usar una spec como referencia común para planificar y automatizar pruebas: los escenarios quedan explícitos y las suites se pueden contrastar con criterios observables. Los Page Objects reducen duplicación y separan el detalle de la interfaz de la intención de cada caso.

Los agentes aceleran la creación inicial de planes y código, pero el resultado requiere revisión humana: hay que comprobar el comportamiento real del sitio, las esperas, los selectores, los datos de prueba y la mantenibilidad. La suite debe ejecutarse como validación y no asumir que un artefacto generado es correcto por sí mismo.

Como siguiente mejora del repositorio, convendría reemplazar el placeholder `npm test` por scripts explícitos de Playwright y hacer que la URL de excepciones también se configure por entorno. Esos puntos se documentan aquí como estado actual y no cambian el comportamiento existente.
