import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  join(process.cwd(), 'packages/theme-chalk/src/card.scss'),
  'utf8',
)

describe('Card visual theme', () => {
  it('uses real optical displacement with a blur fallback', () => {
    expect(source).toMatch(
      /&--liquid-glass \{[\s\S]*backdrop-filter: saturate\(180%\) blur\(14px\)[\s\S]*@supports \(backdrop-filter: url\('#s-card-liquid-glass-support'\)\)[\s\S]*backdrop-filter: var\(--sax-card-liquid-filter\)/,
    )
    expect(source).toMatch(
      /@keyframes card-liquid-caustic[\s\S]*translate3d[\s\S]*@media \(prefers-reduced-motion: reduce\)[\s\S]*&__texture--liquid-glass::after[\s\S]*animation: none/,
    )
    expect(source).toMatch(
      /&--liquid-glass \{[\s\S]*&::before[\s\S]*backdrop-filter: saturate\(180%\) brightness\(1\.08\) blur\(3px\)/,
    )
    expect(source).toMatch(
      /&\.is-texture-liquid-glass,[\s\S]*&\.is-texture-liquid-glass-2[\s\S]*color: getColor\(white, 0\.96\)[\s\S]*\.#\{\$namespace\}-card__title-text[\s\S]*color: getColor\(white, 0\.98\)/,
    )
  })

  it('keeps the second liquid glass texture but swaps the optical filter path', () => {
    expect(source).toMatch(
      /&--liquid-glass,[\s\S]*&--liquid-glass-2 \{[\s\S]*background: linear-gradient/,
    )
    expect(source).toMatch(
      /&--liquid-glass-2 \{[\s\S]*backdrop-filter: blur\(3px\);[\s\S]*filter: var\(--sax-card-liquid-filter\)/,
    )
  })

  it('draws the spotlight only in a masked border layer', () => {
    expect(source).toMatch(
      /@include m\(spotlight\)[\s\S]*radial-gradient\([\s\S]*--sax-card-spotlight-x[\s\S]*mask-composite: exclude/,
    )
    expect(source).toMatch(
      /@include when\(effect-spotlight\)[\s\S]*&:hover,[\s\S]*&:focus-visible[\s\S]*opacity: 1/,
    )
  })

  it('combines an angle-driven gradient edge with a local inner glow', () => {
    expect(source).toMatch(
      /@include m\(gradient-glow\)[\s\S]*conic-gradient\([\s\S]*--sax-card-glow-angle[\s\S]*mask-composite: exclude/,
    )
    expect(source).toMatch(
      /is-effect-gradient-glow[\s\S]*background-image: radial-gradient\([\s\S]*--sax-card-spotlight-x[\s\S]*--sax-card-spotlight-y/,
    )
    expect(source).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*&__effect--gradient-glow \{\s*transition: none/,
    )
  })

  it('inherits the outer left corners for horizontal media', () => {
    expect(source).toMatch(
      /\.#\{\$namespace\}-card-content\.is-horizontal:is\([\s\S]*\.type-default,[\s\S]*\.type-metric,[\s\S]*\.type-article[\s\S]*> \.#\{\$namespace\}-card > \.#\{\$namespace\}-card__img \{[\s\S]*border-radius: 0;\s*border-top-left-radius: inherit;\s*border-bottom-left-radius: inherit;/,
    )
    expect(source).toMatch(
      /@media \(max-width: 600px\)[\s\S]*> \.#\{\$namespace\}-card > \.#\{\$namespace\}-card__img \{[\s\S]*border-radius: inherit;/,
    )
    expect(source).not.toContain('border-radius: inherit 0 0 inherit;')
    expect(source).not.toContain('border-radius: inherit inherit 0 0;')
  })

  it('keeps every named preset usable in a horizontal layout', () => {
    expect(source).toMatch(
      /\.#\{\$namespace\}-card-content\.is-horizontal:is\([\s\S]*\.type-classic,[\s\S]*\.type-overlay,[\s\S]*\.type-split,[\s\S]*\.type-frosted,[\s\S]*\.type-reveal[\s\S]*grid-template-columns: minmax\(140px, 38%\) minmax\(0, 1fr\)/,
    )
    expect(source).toMatch(
      /\.#\{\$namespace\}-card-content\.is-horizontal\.type-profile[\s\S]*grid-template-columns: minmax\(140px, 32%\) minmax\(0, 1fr\)[\s\S]*border-radius: 50%/,
    )
    expect(source).toMatch(
      /@media \(max-width: 600px\)[\s\S]*\.type-classic,[\s\S]*\.type-reveal[\s\S]*flex-direction: column/,
    )
    expect(source).toMatch(
      /@media \(max-width: 600px\)[\s\S]*&\.type-overlay,\s*&\.type-reveal[\s\S]*width: auto;\s*margin: 0;\s*border-radius: 0;\s*transform: none;/,
    )
    expect(source).toMatch(
      /\.#\{\$namespace\}-card-content\.is-horizontal\.type-reveal[\s\S]*> \.#\{\$namespace\}-card\.is-square[\s\S]*> \.#\{\$namespace\}-card__text,[\s\S]*> \.#\{\$namespace\}-card__button \{\s*border-radius: 0;/,
    )
  })

  it('keeps preset media flush with only the touching outer corners', () => {
    expect(source).toMatch(
      /&\.type-classic,\s*&\.type-overlay,\s*&\.type-frosted[\s\S]*border-radius: 0;\s*border-top-left-radius: inherit;\s*border-top-right-radius: inherit;/,
    )
    expect(source).toMatch(
      /&\.type-split \{[\s\S]*border-radius: 0;\s*border-top-left-radius: inherit;\s*border-bottom-left-radius: inherit;/,
    )
    expect(source).toMatch(
      /&\.type-metric:not\(\.is-horizontal\) \{[\s\S]*border-radius: 0;\s*border-top-left-radius: inherit;\s*border-top-right-radius: inherit;/,
    )
    expect(source).toMatch(
      /&\.type-reveal \{[\s\S]*&:hover > \.#\{\$namespace\}-card__img \{\s*border-top-left-radius: inherit;\s*border-top-right-radius: inherit;/,
    )
    expect(source).toMatch(
      /> \.#\{\$namespace\}-card\.is-square:hover > \.#\{\$namespace\}-card__img \{\s*border-radius: 0;/,
    )
  })

  it('keeps actions with their content in both orientations', () => {
    expect(source).toMatch(
      /&\.type-classic:not\(\.is-horizontal\)[\s\S]*justify-content: flex-end;\s*padding: 0 16px 16px;/,
    )
    expect(source).toMatch(
      /&\.type-overlay:not\(\.is-horizontal\)[\s\S]*right: 14px;\s*bottom: 14px;/,
    )
    expect(source).toMatch(
      /&\.type-reveal:not\(\.is-horizontal\)[\s\S]*&\.is-texture-liquid-glass-2 > \.#\{\$namespace\}-card__text \{\s*background: getColor\(black, 0\.46\);/,
    )
    expect(source).toMatch(
      /&\.type-split\.is-vertical[\s\S]*grid-template-columns: minmax\(0, 1fr\)[\s\S]*grid-row: 3;\s*display: flex;\s*justify-content: flex-end;/,
    )
    expect(source).toMatch(
      /&\.type-article\.is-vertical[\s\S]*grid-template-columns: minmax\(0, 1fr\)/,
    )
    expect(source).toMatch(
      /> \.#\{\$namespace\}-card__button \{\s*grid-column: 2;\s*grid-row: 2;[\s\S]*justify-content: flex-start;/,
    )
  })
})
