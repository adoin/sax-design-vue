export const componentShapes = ['rounded', 'square'] as const

export type ComponentShape = (typeof componentShapes)[number]
