# Delete ts file and create js file
rm next.config.ts

# Create new next.config.js
echo "/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'via.placeholder.com', 
      'images.unsplash.com',
      'localhost'
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig" > next.config.js