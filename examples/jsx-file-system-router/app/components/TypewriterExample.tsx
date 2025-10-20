export default function TypewriterExample() {
    return (
        <section class="mb-12 p-6 border rounded-lg bg-gray-900">
            <h2 class="text-2xl font-semibold mb-4 text-white">Typewriter Effect</h2>
            <p class="mb-4 text-gray-300">
                See the difference by trying <span class="text-yellow-400 font-bold">zero</span> and <span class="text-green-400 font-bold">non-zero</span> intervals below.
            </p>

            <div class="space-y-4" data-signals='{"interval": 400, "message": ""}'>
                <div>
                    <label class="block text-sm font-medium mb-2 text-white">Interval in ms:</label>
                    <input
                        type="number"
                        data-bind="interval"
                        class="border border-gray-600 bg-gray-800 text-white p-2 rounded w-32"
                    />
                </div>

                <button
                    class="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 font-bold uppercase tracking-wider"
                    data-on-click="@get('/api/typewriter')"
                >
                    START
                </button>

                <h3
                    data-text="$message"
                    class="min-h-[60px] flex items-center"
                    style="background: linear-gradient(to right, rgb(255, 0, 0), rgb(255, 165, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 127, 255), rgb(75, 0, 130), rgb(238, 130, 238)); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3rem; font-weight: bold; letter-spacing: 0.1em;"
                ></h3>
            </div>
        </section>
    )
}

