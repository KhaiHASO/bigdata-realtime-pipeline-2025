/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // iOS 26 – Frosted Glass Neo-Minimalistic Apple Interface
        border: "rgba(180,190,210,0.4)",
        input: "rgba(180,190,210,0.4)",
        ring: "#0A84FF",
        background: "#F8FAFF",
        foreground: "#0A0A0A",
        primary: {
          DEFAULT: "#0A84FF",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#7D5FFF",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#FF3B30",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.65)",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "rgba(255,255,255,0.3)",
          foreground: "#0A0A0A",
        },
        popover: {
          DEFAULT: "rgba(255,255,255,0.65)",
          foreground: "#0A0A0A",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.65)",
          foreground: "#0A0A0A",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.06)',
        'glass-lg': '0 12px 40px rgba(0,0,0,0.08)',
        'md': '0 4px 24px rgba(0,0,0,0.05)',
        'lg': '0 6px 28px rgba(0,0,0,0.07)',
        'xl': '0 8px 32px rgba(0,0,0,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fadein": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadein": "fadein 0.25s ease",
        "shimmer": "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
