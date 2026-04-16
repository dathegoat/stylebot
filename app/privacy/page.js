export default function Privacy() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center p-6">
      <div className="w-full max-w-md py-12">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

        <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="font-medium text-gray-900 mb-2">What we collect</h2>
            <p>Stylebot does not require you to create an account. We do not collect or store any personal information. The occasion, style, and budget preferences you select are sent to our AI provider to generate outfit recommendations and are not stored.</p>
          </section>

          <section>
            <h2 className="font-medium text-gray-900 mb-2">Affiliate links</h2>
            <p>Some links on Stylebot are affiliate links. If you click a link and make a purchase, we may earn a small commission at no extra cost to you. This helps us keep the app free.</p>
          </section>

          <section>
            <h2 className="font-medium text-gray-900 mb-2">Third party services</h2>
            <p>We use OpenAI to generate outfit recommendations. Your selections are sent to OpenAI's API to produce results. Please review OpenAI's privacy policy at openai.com for more information.</p>
          </section>

          <section>
            <h2 className="font-medium text-gray-900 mb-2">Cookies</h2>
            <p>Stylebot uses PostHog analytics which may set cookies to help us understand how users interact with the app. We do not use advertising cookies or sell any data to third parties. You can disable cookies in your browser settings at any time.</p>
          </section>

          <section>
            <h2 className="font-medium text-gray-900 mb-2">Contact</h2>
            <p>If you have any questions about this policy, email us at stylebot6800@gmail.com</p>
          </section>
        </div>

        <a href="/" className="inline-block mt-10 text-sm text-gray-400 underline hover:text-gray-600">
          Back to Stylebot
        </a>
      </div>
    </main>
  );
}