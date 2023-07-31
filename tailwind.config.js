import plugin from 'tailwindcss'
// Once these are fixed, we can use the plugin:
// import groupModifierPlugin from "tailwindcss-group-modifier-plugin";

export default {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    // Make grouping variants work
    // E.g.: [&>.active]:x-[border-b,border-b-purple-600]
    // groupModifierPlugin()
    // https://github.com/tailwindlabs/tailwindcss/discussions/11701#discussioncomment-6569866
    plugin(({ matchUtilities }) => {
      matchUtilities({
        x: (value) => ({
          [`@apply ${value.replaceAll(',', ' ')}`]: {}
        })
      })
    })
  ]
}
