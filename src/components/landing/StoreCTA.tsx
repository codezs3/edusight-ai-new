export function StoreCTA() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Discover Your Perfect Assessment
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Explore our comprehensive library of 1000+ assessments designed by experts.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/testvault"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Explore TestVault
          </a>
          <a
            href="/testvault?filter=free"
            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Try Free Tests
          </a>
        </div>
      </div>
    </section>
  );
}
