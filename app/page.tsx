import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-800 text-white p-4">
        <nav className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Anya Beauty Corner</h1>
            <div className="space-x-4">
              <Link href="/" className="hover:text-gray-300">Home</Link>
              <Link href="/products" className="hover:text-gray-300">Products</Link>
              <Link href="/order-track" className="hover:text-gray-300">Track Order</Link>
            </div>
          </div>
        </nav>
      </header>

      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Anya Beauty Corner</h2>
          <p className="text-xl mb-8">Best beauty products at best prices</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
            Shop Now
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-6 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Anya Beauty Corner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}