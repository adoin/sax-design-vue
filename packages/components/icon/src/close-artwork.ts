import type { SaxIconData } from './icon'

export const closePath =
  'M12 8.8C10.3 8.8 9.4 4 6.4 4C3.2 4 3.2 7.1 5.3 9C6.9 10.4 8.8 10.8 8.8 12C8.8 13.2 6.9 13.6 5.3 15C3.2 16.9 3.2 20 6.4 20C9.4 20 10.3 15.2 12 15.2C13.7 15.2 14.6 20 17.6 20C20.8 20 20.8 16.9 18.7 15C17.1 13.6 15.2 13.2 15.2 12C15.2 10.8 17.1 10.4 18.7 9C20.8 7.1 20.8 4 17.6 4C14.6 4 13.7 8.8 12 8.8Z'
export const closeIconData: SaxIconData = {
  body: `<path fill="currentColor" d="${closePath}"/>`,
  attributes: { viewBox: '0 0 24 24', width: '1em', height: '1em' },
}
