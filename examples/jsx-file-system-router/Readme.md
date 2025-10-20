# Datastar + HonoX Example

A working example of [Datastar](https://data-star.dev/) (reactive hypermedia) integrated with [HonoX](https://github.com/honojs/honox) (Hono meta-framework with file-based routing, a la NextJS)

## Quick Start

```bash
npm install

# Development
npm run dev
# Visit http://localhost:5173

# Production (build + start in one command)
npm run prod
# Visit http://localhost:3000

# Or run separately:
npm run build  # Build first
npm start      # Then start server

# Note: 'npm start' uses 'node -C dist index.js'
# The -C flag changes working directory to dist/ before running
```

## Step-by-Step Setup

### 1. Create HonoX Project

```bash
npm create hono@latest
# Choose: x-basic (use arrow keys to select)
```

The **x-basic** template includes:
- ✅ **Tailwind CSS** pre-configured (no extra setup needed!)
- ✅ **Cloudflare Workers** adapter (can be changed to Node.js/Bun)
- ✅ **HonoX** with file-based routing

> **Note**: If you need to configure Tailwind CSS manually or want to learn more, see the [HonoX Tailwind CSS documentation](https://github.com/honojs/honox?tab=readme-ov-file#tailwind-css).

If you want to use **Node.js** or **Bun** instead of Cloudflare, follow the next steps.

### 2. Remove Cloudflare Dependencies (Optional)

If you're **not deploying to Cloudflare**, remove these packages:

```bash
# Using npm
npm remove @cloudflare/workers-types wrangler

```

Then remove these scripts from `package.json`:
```json
{
  "scripts": {
    "preview": "wrangler dev",    // ❌ Remove this
    "deploy": "bun run build && wrangler deploy"  // ❌ Remove this
  }
}
```

Delete the Cloudflare configuration file:
```bash
rm wrangler.jsonc
```

And remove the Cloudflare types from `tsconfig.json`:
```json
{
  "types": [
    "vite/client",
    "@cloudflare/workers-types/2023-07-01"  // ❌ Remove this line
  ]
}
```
### 3. Configure Vite Adapter

Edit `vite.config.ts` to use **Node.js** or **Bun** adapter:

**For Node.js (default recommendation):**
```ts
// vite.config.ts
import build from '@hono/vite-build/node-server'  // Node.js build
import adapter from '@hono/vite-dev-server/node'   // Node.js adapter
//import build from '@hono/vite-build/bun'           // Change to Bun
//import adapter from '@hono/vite-dev-server/bun'    // Change to Bun
import tailwindcss from '@tailwindcss/vite'
import honox from 'honox/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    honox({
      devServer: { adapter },
      client: { input: ['/app/client.ts', '/app/style.css'] }
    }),
    tailwindcss(),
    build()
  ]
})
```

### 4. Add Datastar CDN

Edit `app/routes/_renderer.tsx`:

```tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, Script } from 'honox/server'

export default jsxRenderer(({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <Link href="/app/style.css" rel="stylesheet" />
        
        {/* Add Datastar CDN */}
        <script 
          type="module" 
          src="https://cdn.jsdelivr.net/gh/starfederation/datastar@main/bundles/datastar.js"
        ></script>
        
        <Script src="/app/client.ts" async />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

### 5. Three Ways to Create Routes in HonoX

HonoX supports three patterns for creating routes:

**1. Using `createRoute()` (Recommended)**
```tsx
import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(<h1>Hello!</h1>)
})
```

**2. Direct Function Export (Simplified)**
```tsx
import { Context } from 'hono'

export default function Home(_c: Context) {
  return <h1>Welcome!</h1>
}
```

**3. Hono Instance (For API routes with sub-routes)**
```tsx
import { Hono } from 'hono'

const app = new Hono()

app.get('/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

export default app
```

**Which method to use?**

- **For pages** (e.g., `app/routes/datastar-demo.tsx`): Use **method 2** (direct function export) - cleaner for pages
- **For API endpoints** (e.g., `app/routes/api/*.ts`): Use **method 1** (`createRoute`) with named exports (`GET`, `POST`) to specify HTTP verbs

Example:
```tsx
// Page: app/routes/about.tsx
export default function About() {
  return <h1>About page</h1>
}

// API: app/routes/api/users.ts
export const GET = createRoute((c) => c.json({ users: [] }))
export const POST = createRoute((c) => c.json({ created: true }))
```

### 6. Web Components with Datastar

This example includes a [Web Component that reverses strings](https://data-star.dev/examples/web_component), demonstrating Datastar's integration with custom elements.

**First, simplify `app/client.ts` by removing HonoX's client framework:**

By default, HonoX scaffolds include `createClient()` for islands support. Since we're using **web components only** (not islands), remove it:

```ts
// app/client.ts 
import { createClient } from 'honox/client'❌ Remove this 
import '@/web-components/ReverseComponent'

createClient()  // ❌ Remove this - only needed for islands

```

**Usage in pages:**

```tsx
{/* Web Component with two-way binding */}
<section data-signals-name="Your Name" data-signals-reversed="">
  <input type="text" data-bind="name" />
  <p>Reversed: <span data-text="$reversed"></span></p>
  
  <reverse-component
    data-on-reverse="$reversed = evt.detail.value"
    data-attr-name="$name"
  ></reverse-component>
</section>
```

See `app/web-components/ReverseComponent.ts` for the full implementation.

### 7. Install Datastar SDK 

The [Datastar TypeScript SDK](https://github.com/starfederation/datastar-typescript) is a **backend helper library** that simplifies sending Server-Sent Events (SSE) to the Datastar frontend. It provides a clean API to:

- **Update signals** on the client (`patchSignals`)
- **Patch HTML elements** into the DOM (`patchElements`)
- **Remove elements** or signals
- **Execute JavaScript** on the client


```bash
npm install @starfederation/datastar-sdk
```

**Import paths by runtime:**
- **Bun/Web**: `@starfederation/datastar-sdk/web`
- **Node.js**: `@starfederation/datastar-sdk/node`

### 8. Create API Endpoint

Create `app/routes/api/hello.ts`:

```ts
import { createRoute } from 'honox/factory'
// For Node, use:
import { ServerSentEventGenerator as SSE } from '@starfederation/datastar-sdk/node'
// For Bun/Deno/Web use:
//import { ServerSentEventGenerator as SSE } from '@starfederation/datastar-sdk/web'

export const GET = createRoute(async (c) => {
  return SSE.stream(async (stream) => {
    // Update signals on the client
    const message = `Hello from server at ${new Date().toLocaleTimeString()}!`
    stream.patchSignals(JSON.stringify({ message }))
  })
})
```

**Using JSX components in API responses:**

You can also render JSX components to HTML strings:

```tsx
// tsx file
import { createRoute } from 'honox/factory'
import { ServerSentEventGenerator as SSE } from '@starfederation/datastar-sdk/node'
//import { ServerSentEventGenerator as SSE } from '@starfederation/datastar-sdk/web'
import { renderToString } from 'hono/jsx/dom/server'

export const GET = createRoute(async (c) => {
  return SSE.stream(async (stream) => {
    // Render JSX component to HTML string, you can import a JSX component
    const html = renderToString(
      <div id="message" class="p-4 bg-blue-50 rounded">
        <p>Hello from server at {new Date().toLocaleTimeString()}!</p>
      </div>
    )
    stream.patchElements(html)
  })
})
```

### 9. Add Middleware (Optional)

You can add global middleware using `app/routes/_middleware.ts`. This file applies middleware to all routes.

**Example: Add Compression Middleware**

Create `app/routes/_middleware.ts`:

```ts
import { createRoute } from 'honox/factory'
import { compress } from 'hono/compress'

export default createRoute(
  compress() // Compresses responses (gzip, deflate)
)
```

**Add Multiple Middleware:**

```ts
import { createRoute } from 'honox/factory'
import { compress } from 'hono/compress'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

export default createRoute(
  logger(),         // Logs requests
  secureHeaders(),  // Adds security headers
  compress()        // Compresses responses
)
```

### 10. Path Alias Configuration

The project uses `@` as an alias for the `app/` directory. This makes imports cleaner and easier to manage.

**Already configured in `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./app/*"]
    }
  }
}
```

**Already configured in `vite.config.ts`:**
```ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app')
    }
  }
})
```

**Usage example:**
```ts
// Instead of:
import { MyComponent } from '../../../components/MyComponent'

// Use:
import { MyComponent } from '@/components/MyComponent'
```

## Project Structure

```
jsx-file-system-router/
├── app/
│   ├── routes/
│   │   ├── _renderer.tsx          # Layout with Datastar CDN + Script
│   │   ├── _middleware.ts         # Global middleware (compression)
│   │   ├── _404.tsx               # Custom 404 handler
│   │   ├── index.tsx              # Home page (imports components)
│   │   └── api/
│   │       └── typewriter.ts      # SSE endpoint for typewriter effect
│   ├── components/                # Reusable UI components
│   │   ├── TypewriterExample.tsx  # Typewriter demo component
│   │   └── WebComponentExample.tsx # Web component demo
│   ├── web-components/
│   │   └── ReverseComponent.ts    # Custom element: string reverser
│   ├── client.ts                  # Client entry (loads web components)
│   ├── server.ts                  # Server entry (Hono app)
│   └── style.css                  # Global styles (Tailwind)
├── dist/                          # Built output (after npm run build)
│   ├── static/
│   │   ├── client-*.js            # Bundled client code
│   │   └── style-*.css            # Bundled styles
│   ├── index.js                   # Server bundle
│   └── favicon.ico                # Static assets
├── vite.config.ts                 # Vite + HonoX configuration
├── tsconfig.json                  # TypeScript config (with @ alias)
└── package.json                   # Dependencies and scripts
```

## Datastar Key Patterns

```tsx
{/* Debounce input - use spread syntax because of dot (.) in "300ms" */}
<input {...{ 'data-on-input__debounce.300ms': "@get('/api/search')" }} />

{/* Prevent default - normal syntax works (no special characters) */}
<form data-on-submit__prevent="@post('/api/submit')">
```

**Note**: Use spread syntax `{...{ 'attribute': 'value' }}` only when the attribute contains a dot (`.`) or other special characters. Otherwise, use normal JSX syntax.

## Development Scripts

```bash
# Development (Vite)
npm run dev      # or: bun run dev

# Build
npm run build    # or: bun run build

# Start production server (requires build first)
npm start        # or: node -C dist index.js

# Build + Start (one command)
npm run prod     # Builds and starts production server
```

## Documentation

- **HonoX**: https://github.com/honojs/honox
- **Datastar**: https://data-star.dev/
- **Hono**: https://hono.dev/

**Made with ❤️ using HonoX + Datastar**

