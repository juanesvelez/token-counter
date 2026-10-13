# token-counter

Mod para Claude Code que muestra cuánto llevas gastado en la sesión.

- **Barra de estado:** contexto usado y costo acumulado de la sesión a precio de API.
  `ctx 45.0k / 200.0k (23%) · API $1.50`
- **Toast al terminar cada respuesta:** tokens y costo de solo esa respuesta.
  `Respuesta: 42.2k tokens · ↑41.0k entrada (40.0k caché) · ↓1.2k salida · $0.083`

## Instalación

En una sesión de Claude Code en la terminal:

```
/plugin install token-counter --marketplace juanesvelez/token-counter
```

Responde `y` para agregar el marketplace y elige el scope de usuario para que cargue en todas tus sesiones.

## Notas

- El costo de la sesión es el mismo que reporta `/cost`, ya con los descuentos del caché de prompts.
- El costo de cada respuesta es la diferencia del costo acumulado antes y después de ella, así que incluye lo que gastaron sus subagentes. La primera respuesta después de cargar el mod sale sin costo.
- El total de entrada del toast suma todas las llamadas al modelo de esa respuesta; con varias herramientas, el contexto se cuenta una vez por llamada.

## Desarrollo

```
claude plugin validate .
claude plugin test .
```
