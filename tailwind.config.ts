
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        lipstick: '#E8547C',
        'lipstick-dark': '#C91E63',
        'lipstick-light': '#F5A9C1',
        
        // Secondary Colors
        'rose-gold': '#B76E79',
        'blush': '#FFB6C1',
        
        // Accent Colors
        'gold': '#D4AF37',
        'coral': '#FF7F50',
        'peach': '#FFDAB9',
        
        // Neutral Colors
        'cream': '#FFF5F7',
        'light-gray': '#F8F8F8',
        'dark-gray': '#333333',
        
        // Background
        background: '#FFF5F7',
      },
      backgroundImage: {
        'gradient-lipstick': 'linear-gradient(135deg, #E8547C 0%, #C91E63 100%)',
        'gradient-warm': 'linear-gradient(135deg, #FFB6C1 0%, #FFD700 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FFF5F7 0%, #FFE4E1 100%)',
      },
      boxShadow: {
        'soft': '0 4px 15px rgba(201, 30, 99, 0.1)',
        'medium': '0 8px 25px rgba(201, 30, 99, 0.15)',
        'strong': '0 12px 35px rgba(201, 30, 99, 0.2)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      transition: {
        'smooth': 'all 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
};
export default config;

