import { defineSaxIconConfig } from 'sax-design-vue-iconify'

export default defineSaxIconConfig({
  collections: {
    cb: 'carbon',
    bx: 'bx',
    bxs: 'bxs',
    bxl: 'bxl',
  },
  // Dynamic names cannot be discovered from templates. Keep this list small:
  // every entry becomes one SVG record in the application bundle.
  safelist: [
    'cb:notification',
    'cb:warning',
    'bx:book',
    'bxl:github',
  ],
})
