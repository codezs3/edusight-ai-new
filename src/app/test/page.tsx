export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">✅ Server is Working!</h1>
        <p className="text-gray-600 mb-4">If you can see this page, the Next.js server is running correctly.</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Server: Next.js 14</p>
          <p className="text-sm text-gray-500">Port: 3000</p>
          <p className="text-sm text-gray-500">Status: Active</p>
        </div>
        <div className="mt-6">
          <a 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Home Page
          </a>
        </div>
      </div>
    </div>
  );
}
