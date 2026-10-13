import type { Register, SessionContextUsage, SessionCost, TurnUsage } from 'claude-code'

export const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}k` : `${n}`

export const usd = (n: number) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`

export const statusText = (ctx: SessionContextUsage, cost?: SessionCost) =>
  `ctx ${fmt(ctx.tokens ?? 0)} / ${fmt(ctx.window)} (${ctx.percent ?? 0}%)` +
  (cost ? ` · API ${usd(cost.usd)}` : '')

export const toastText = (u: TurnUsage, costUsd?: number) => {
  const input = u.input_tokens + u.cache_read_input_tokens + u.cache_creation_input_tokens
  return (
    `Respuesta: ${fmt(input + u.output_tokens)} tokens · ↑${fmt(input)} entrada (${fmt(u.cache_read_input_tokens)} caché) · ↓${fmt(u.output_tokens)} salida` +
    (costUsd === undefined ? '' : ` · ${usd(costUsd)}`)
  )
}

export const register: Register = on => {
  // Costo acumulado al cerrar la respuesta anterior, para sacar el de cada respuesta por diferencia.
  let lastCost: number | undefined

  on('session.start', async ($, e, next) => {
    const r = await next(e)
    const { context, cost } = await $.session.usage()
    lastCost = cost?.usd
    $.ui.status(statusText(context, cost))
    return r
  })

  on('session.measure', ($, e, next) => {
    $.ui.status(statusText(e.context, e.cost))
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId !== undefined) return r
    const { context, cost } = await $.session.usage()
    const delta = cost && lastCost !== undefined ? Math.max(0, cost.usd - lastCost) : undefined
    lastCost = cost?.usd
    $.ui.status(statusText(context, cost))
    if (e.usage) $.ui.toast(toastText(e.usage, delta), { timeoutMs: 6000 })
    return r
  })
}
