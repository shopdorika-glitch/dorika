import type { Config } from "tailwindcss";

/**
 * Dorika design system.
 *
 * The palette is driven by CSS variables (defined in globals.css) so the
 * storefront can switch between the warm paper theme and its dark counterpart
 * without duplicating colour classes. Values are raw RGB triplets to keep
 * Tailwind's `/opacity` modifiers working.
 *
 * Naming:
 *   paper      — page canvas
 *   surface    — raised panels, cards, inputs
 *   paper-2/3  — sunken / tinted areas
 *   ink        — primary text (soft/muted/faint for hierarchy)
 *   line       — hairlines and borders
 *   clay       — the terracotta thread accent from the logo
 *   deep       — fixed dark panels (never inverts, so text-on-deep stays legible)
 */
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", sm: "1.75rem", lg: "2.5rem" },
      screens: { "2xl": "1360px" },
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "rgb(var(--paper) / <alpha-value>)",
          2: "rgb(var(--paper-2) / <alpha-value>)",
          3: "rgb(var(--paper-3) / <alpha-value>)",
        },
        surface: "rgb(var(--surface) / <alpha-value>)",
        bar: "rgb(var(--bar) / <alpha-value>)",
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          soft: "rgb(var(--ink-soft) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        clay: {
          DEFAULT: "rgb(var(--clay) / <alpha-value>)",
          deep: "rgb(var(--clay-deep) / <alpha-value>)",
          tint: "rgb(var(--clay-tint) / <alpha-value>)",
          ondeep: "rgb(var(--clay-ondeep) / <alpha-value>)",
        },
        deep: "rgb(var(--deep) / <alpha-value>)",
        success: {
          DEFAULT: "rgb(var(--success) / <alpha-value>)",
          tint: "rgb(var(--success-tint) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--danger) / <alpha-value>)",
          tint: "rgb(var(--danger-tint) / <alpha-value>)",
        },
        ondeep: {
          DEFAULT: "rgb(var(--on-deep) / <alpha-value>)",
          soft: "rgb(var(--on-deep-soft) / <alpha-value>)",
        },

        // Legacy scales — kept so admin screens (which use the original
        // palette) keep rendering exactly as before. Public pages use the
        // semantic tokens above.
        charcoal: {
          DEFAULT: "#24272B",
          50: "#f5f6f7",
          100: "#e6e7e9",
          200: "#c3c6ca",
          300: "#9ea3a9",
          400: "#666c72",
          500: "#474c52",
          600: "#34383d",
          700: "#24272B",
          800: "#1b1e21",
          900: "#121416",
        },
        terracotta: {
          DEFAULT: "#9C4A2C",
          50: "#fbf1ed",
          100: "#f6ded6",
          200: "#eabfae",
          300: "#db9a80",
          400: "#c97a58",
          500: "#9C4A2C",
          600: "#853D26",
          700: "#6E3320",
          800: "#5B2C1E",
          900: "#4B261B",
        },
        cream: {
          DEFAULT: "#F8F7F4",
          100: "#FFFEFB",
          200: "#F1F0EA",
          300: "#E7E6DF",
        },
        whatsapp: "#25D366",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        micro: ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.16em" }],
        lede: ["1.125rem", { lineHeight: "1.75" }],
      },
      letterSpacing: {
        tightest: "-0.035em",
        display: "-0.028em",
      },
      maxWidth: {
        shell: "1360px",
      },
      borderRadius: {
        xs: "2px",
        sm: "3px",
      },
      boxShadow: {
        // Deliberately sparse: depth comes from hairlines and paper tones.
        hair: "0 1px 0 0 rgb(var(--line) / 1)",
        lift: "0 18px 40px -28px rgb(28 24 18 / 0.45)",
        panel: "0 30px 70px -40px rgb(28 24 18 / 0.5)",
        drawer: "0 0 80px -20px rgb(20 17 12 / 0.35)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 0.84, 0.24, 1)",
        inout: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "thread-draw": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        "sheet-in": {
          "0%": { transform: "translateX(24px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "wa-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.45)" },
          "70%": { boxShadow: "0 0 0 14px rgba(37, 211, 102, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0)" },
        },
      },
      animation: {
        rise: "rise 0.7s cubic-bezier(0.16, 0.84, 0.24, 1) both",
        fade: "fade 0.5s ease-out both",
        "sheet-in": "sheet-in 0.4s cubic-bezier(0.16, 0.84, 0.24, 1) both",
        "wa-pulse": "wa-pulse 2.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
