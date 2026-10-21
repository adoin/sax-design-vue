import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/vite', 'src/api'],
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
