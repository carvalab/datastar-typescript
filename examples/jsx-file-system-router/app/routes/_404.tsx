import type { NotFoundHandler } from 'hono'

const handler: NotFoundHandler = (c) => {
  // Because the compression middleware is applied, we need to return a 200 status code
  c.status(200)
  return c.render('404 Not Found')
}

export default handler
