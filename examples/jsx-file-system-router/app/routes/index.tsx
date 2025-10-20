import TypewriterExample from '@/components/TypewriterExample'
import WebComponentExample from '@/components/WebComponentExample'

export default function Home() {
  return (
    <div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-8">Datastar + HonoX Example</h1>

      {/* Web Component Example */}
      <WebComponentExample />

      {/* Typewriter Effect Example */}
      <TypewriterExample />

      {/* Documentation Links */}
      <section class="p-6 border rounded-lg bg-gray-50">
        <h2 class="text-2xl font-semibold mb-4">📚 Documentation</h2>
        <div class="flex gap-4 flex-wrap">
          <a href="https://data-star.dev/examples" target="_blank" class="text-blue-600 hover:underline">
            Datastar Examples ↗
          </a>
          <a href="https://github.com/honojs/honox" target="_blank" class="text-blue-600 hover:underline">
            HonoX GitHub ↗
          </a>
          <a href="https://hono.dev/" target="_blank" class="text-blue-600 hover:underline">
            Hono Docs ↗
          </a>
        </div>
      </section>
    </div>
  )
}
