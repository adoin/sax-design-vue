import type { TaskFunction } from 'gulp'

const done = (err?: unknown) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
}

const resolveTask = (mod: Record<string, unknown>) => {
  const candidate = mod.default ?? mod
  if (typeof candidate === 'function') return candidate
  if (
    candidate &&
    typeof candidate === 'object' &&
    typeof (candidate as { default?: unknown }).default === 'function'
  ) {
    return (candidate as { default: TaskFunction }).default
  }
  throw new Error('Invalid build task export')
}

const runExport = async (task: unknown) => {
  const resolved =
    typeof task === 'function' ? task : resolveTask({ default: task })

  if (resolved.length >= 1) {
    await new Promise<void>((resolve, reject) => {
      ;(resolved as TaskFunction)((err) => {
        if (err) reject(err)
        else resolve()
      })
    })
    return
  }

  await (resolved as () => Promise<void>)()
}

async function main() {
  const taskName = process.argv[2]

  if (taskName) {
    const tasks = await import('./src/tasks')
    const task = (tasks as Record<string, unknown>)[taskName]
    if (!task) {
      console.error(`Unknown task: ${taskName}`)
      process.exit(1)
    }
    await runExport(task)
    return
  }

  const gulpMod = await import('./gulpfile')
  await runExport(resolveTask(gulpMod))
}

main()
  .then(() => done())
  .catch(done)
