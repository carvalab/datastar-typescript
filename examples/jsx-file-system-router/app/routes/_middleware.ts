import { createRoute } from 'honox/factory'
import { compress } from 'hono/compress'
// import { compress } from '@hono/bun-compress' // for Bun you need install

export default createRoute(
    compress()
)

