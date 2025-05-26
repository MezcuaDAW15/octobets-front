// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        colorpersonalizado: "#1A73E8",
        otrocolor: "#FF5722",
        "navbar-color": "#5A1D49",
        primary: '#c026d3',

        'primary-dark': '#3b004c',
        success: '#16a34a',
        'success-dark': '#0d542b',
        warning: '#f59e0b',
        info: '#2563eb',
        'info-dark': '#1d4ed8',
        danger: '#b91c1c',
        'danger-dark': '#991b1b',
        'surface-light': '#2a2a2a',
        surface: '#1f1f1f',
        'surface-dark': '#131313',
        border: '#3a3a3a',
        'text-primary': '#f3f4f6',
        'text-secondary': '#d1d5db',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      spacing: {
        "normal": "30px",
      },
      borderRadius: {
        card: '1.5rem',
        button: '1.25rem',
      },
      boxShadow: {
        card: '0 6px 30px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),

  ]
}
