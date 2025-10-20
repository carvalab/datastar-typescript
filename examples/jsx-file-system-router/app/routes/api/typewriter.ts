import { createRoute } from 'honox/factory'
import { ServerSentEventGenerator as SSE } from '@starfederation/datastar-sdk/web'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const GET = createRoute(async (c) => {
    const message = "HELLO WORLD!"

    const reader = await SSE.readSignals(c.req.raw)
    const interval = reader.success && reader.signals?.interval !== undefined
        ? Number(reader.signals.interval)
        : 400

    return SSE.stream(async (stream) => {
        if (interval <= 0) {
            stream.patchSignals(JSON.stringify({ message }))
        } else {
            for (let i = 1; i <= message.length; i++) {
                stream.patchSignals(JSON.stringify({ message: message.substring(0, i) }))
                await sleep(interval)
            }
        }
    })
})

