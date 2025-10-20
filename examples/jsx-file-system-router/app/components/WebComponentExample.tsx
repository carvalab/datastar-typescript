export default function WebComponentExample() {
    return (
        <section class="mb-12 p-6 border rounded-lg">
            <h2 class="text-2xl font-semibold mb-4">Web Component Integration</h2>
            <p class="mb-4 text-gray-600">
                Two-way binding with a web component that reverses a string.
                <a href="https://data-star.dev/examples/web_component" target="_blank" class="text-blue-600 hover:underline ml-2">
                    View Datastar Example ↗
                </a>
            </p>

            <div class="space-y-4" data-signals='{"name": "Your Name", "reversed": ""}'>
                <div>
                    <label class="block text-sm font-medium mb-2">Input:</label>
                    <input
                        type="text"
                        data-bind="name"
                        class="border border-gray-300 p-2 rounded w-full"
                    />
                </div>

                <div class="bg-blue-50 p-4 rounded">
                    <p class="text-sm font-medium mb-1">Reversed:</p>
                    <p class="text-xl font-bold text-blue-600" data-text="$reversed"></p>
                </div>

                {/* Web Component - hidden but handles the logic */}
                <reverse-component
                    data-on-reverse="$reversed = evt.detail.value"
                    data-attr-name="$name"
                ></reverse-component>
            </div>
        </section>
    )
}

