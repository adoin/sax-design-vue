import type { TableChartAdapter } from './table-chart'

/** Optional, dependency-free SVG renderer. Import explicitly in chartConfig.adapter. */
export function createTableSvgChartAdapter(): TableChartAdapter {
  return {
    mount(container, { data, type, theme, signal }) {
      const ns = 'http://www.w3.org/2000/svg'
      const create = (
        tag: string,
        attrs: Record<string, string | number>,
        text?: string,
      ) => {
        const element = container.ownerDocument.createElementNS(ns, tag)
        for (const [key, value] of Object.entries(attrs))
          element.setAttribute(key, String(value))
        if (text != null) element.textContent = text
        return element
      }
      const svg = create('svg', {
        width: '100%',
        height: '100%',
        'aria-hidden': 'true',
      })
      container.append(svg)
      let disposed = false
      const draw = (width: number, height: number) => {
        if (disposed || signal.aborted) return
        svg.replaceChildren()
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        const left = Math.min(72, width * 0.22)
        const right = 16
        const top = 18
        const bottom = 42
        const plotWidth = Math.max(1, width - left - right)
        const plotHeight = Math.max(1, height - top - bottom)
        // Normalize before subtracting so opposite large finite values cannot overflow.
        let magnitude = 0
        for (const series of data.series)
          for (const value of series.values)
            if (value != null) magnitude = Math.max(magnitude, Math.abs(value))
        magnitude ||= 1
        let min = 0
        let max = 0
        for (const series of data.series)
          for (const value of series.values)
            if (value != null) {
              min = Math.min(min, value / magnitude)
              max = Math.max(max, value / magnitude)
            }
        if (min === max) max = 1
        const y = (value: number) =>
          top + ((max - value / magnitude) / (max - min)) * plotHeight
        const zero = y(0)
        const step = plotWidth / Math.max(1, data.categories.length)
        const number = (value: number) =>
          new Intl.NumberFormat(undefined, {
            maximumSignificantDigits: 4,
          }).format(value)
        for (let tick = 0; tick <= 4; tick++) {
          const normalized = min + ((max - min) * tick) / 4
          const yy = top + plotHeight * (1 - tick / 4)
          svg.append(
            create('line', {
              x1: left,
              x2: width - right,
              y1: yy,
              y2: yy,
              stroke: theme.text,
              'stroke-opacity': 0.1,
            }),
          )
          svg.append(
            create(
              'text',
              {
                x: left - 8,
                y: yy + 4,
                fill: theme.text,
                'font-size': 11,
                'text-anchor': 'end',
              },
              number(normalized * magnitude),
            ),
          )
        }
        const stride = Math.max(
          1,
          Math.ceil(
            data.categories.length / Math.max(1, Math.floor(plotWidth / 90)),
          ),
        )
        data.categories.forEach((category, index) => {
          if (index % stride !== 0) return
          const label = create(
            'text',
            {
              x: left + step * (index + 0.5),
              y: height - 17,
              fill: theme.text,
              'font-size': 11,
              'text-anchor': 'middle',
            },
            category.length > 12 ? `${category.slice(0, 11)}…` : category,
          )
          label.append(create('title', {}, category))
          svg.append(label)
        })
        data.series.forEach((series, seriesIndex) => {
          const group = create('g', {
            fill: theme.primary,
            stroke: theme.primary,
            'data-series': series.key,
          })
          // Keep all series tied to the primary token; patterns also distinguish them.
          group.style.filter = `hue-rotate(${seriesIndex * 47}deg)`
          const barWidth = (step * 0.76) / Math.max(1, data.series.length)
          let path = ''
          let connected = false
          series.values.forEach((value, index) => {
            if (value == null) {
              connected = false
              return
            }
            const xx = left + step * (index + 0.5)
            const yy = y(value)
            const title = create(
              'title',
              {},
              `${series.name} · ${data.categories[index]}: ${number(value)}`,
            )
            if (type === 'bar') {
              const bar = create('rect', {
                x: left + step * index + step * 0.12 + barWidth * seriesIndex,
                y: Math.min(zero, yy),
                width: Math.max(0, barWidth * 0.9),
                height: Math.abs(zero - yy),
                rx: Math.min(3, barWidth / 4),
                'stroke-width': 0,
                'fill-opacity': 0.8,
              })
              bar.append(title)
              group.append(bar)
            } else {
              path += `${connected ? 'L' : 'M'}${xx},${yy} `
              connected = true
              const point = create('circle', {
                cx: xx,
                cy: yy,
                r: 2.5,
                'stroke-width': 0,
              })
              point.append(title)
              group.append(point)
            }
          })
          if (type === 'line') {
            const line = create('path', {
              d: path,
              fill: 'none',
              'stroke-width': 2,
              'stroke-linejoin': 'round',
              'stroke-dasharray': ['', '6 3', '2 3', '8 3 2 3'][
                seriesIndex % 4
              ],
            })
            group.prepend(line)
          }
          svg.append(group)
        })
      }
      return {
        resize: draw,
        dispose: () => {
          disposed = true
          svg.remove()
        },
      }
    },
  }
}
