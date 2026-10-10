# Comparativa de Modelos (Copilot Auto vs. Claude 5.5 Sonnet Web)

| Criterio | Ejercicio 1 (Copilot Auto / GPT) | Ejercicio 2 (Claude 5.5 Sonnet Web) |
| :--- | :--- | :--- |
| **Modelo Utilizado** | Copilot Auto (VS Code) | Claude 3.5 Sonnet (Web) |
| **Calidad Inicial** | Alta, generó la estructura POM limpia al primer intento.  | Buena, aunque con bloqueos del entorno/MCP. |
| **Iteraciones (Healer)** | 0 iteraciones en el test final. | 0 iteraciones en el test final. |
| **Manejo de Esperas** | Asunciones estándar. | Uso correcto de aserciones web-first (`toBeVisible()`). |
| **Intervención Manual** | Alta (para resolver problemas de entorno/plugin). | Baja (copiar y pegar el prompt). |
| **Costo** | Incluido en suscripción Copilot. | $0 (Plan gratuito de Claude.ai). |

## Conclusión
El uso de Claude 5.5 Sonnet en la web generó fricción por falta de la extensión de VS Code y el servidor MCP, entregando código con excelente soporte para elementos dinámicos y esperas asíncronas.