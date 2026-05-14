@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { box-sizing: border-box; }
  
  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Jost', sans-serif;
    background-color: #09090b;
    color: #f4f4f5;
    overflow-x: hidden;
  }

  h1, h2, h3, h4 {
    font-family: 'Cormorant Garamond', serif;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #09090b; }
  ::-webkit-scrollbar-thumb { background: #d4831a; border-radius: 3px; }
}

@layer components {
  .btn-primary {
    @apply bg-brand-500 hover:bg-brand-400 text-dark-900 font-body font-500 px-6 py-3 transition-all duration-200 tracking-widest uppercase text-xs;
  }

  .btn-outline {
    @apply border border-brand-500 text-brand-500 hover:bg-brand-500 hover:text-dark-900 font-body px-6 py-3 transition-all duration-200 tracking-widest uppercase text-xs;
  }

  .btn-ghost {
    @apply text-dark-200 hover:text-brand-400 font-body px-4 py-2 transition-colors duration-200;
  }

  .input-field {
    @apply w-full bg-dark-700 border border-dark-500 text-dark-50 placeholder-dark-300 px-4 py-3 focus:outline-none focus:border-brand-500 transition-colors duration-200 font-body text-sm;
  }

  .card {
    @apply bg-dark-800 border border-dark-600;
  }

  .gold-text {
    @apply text-brand-400;
  }

  .section-title {
    @apply font-display text-4xl md:text-5xl font-light text-dark-50 leading-tight;
  }

  .nav-link {
    @apply text-dark-200 hover:text-brand-400 tracking-widest uppercase text-xs transition-colors duration-200 font-body font-500;
  }

  .badge {
    @apply text-xs px-2 py-0.5 font-body font-500 tracking-wider uppercase;
  }

  .divider {
    @apply border-dark-600;
  }
}

/* Grain texture overlay */
body::before {
  content: '';
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  opacity: 0.015;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  z-index: 9999;
}

/* Shimmer loading effect */
.shimmer {
  background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Page transitions */
.page-enter {
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Gold line accent */
.gold-line {
  position: relative;
}
.gold-line::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 40px;
  height: 1px;
  background: #d4831a;
}

/* Custom checkbox */
input[type="checkbox"] {
  accent-color: #d4831a;
}

/* Toast customizations */
.toast-dark {
  background: #18181b !important;
  color: #f4f4f5 !important;
  border: 1px solid #27272a !important;
}
