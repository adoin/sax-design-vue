import { describe, expect, it } from 'vitest'
import { inputProps } from '../../input/src/input'
import { textareaProps } from '../../textarea/src/textarea'
import { datePickerProps } from '../../date-picker/src/date-picker'
import { timeSelectProps } from '../../time-select/src/time-select'
import { timePickerProps } from '../../time-picker/src/time-picker'
import { selectProps } from '../../select/src/select'
import { radioGroupProps } from '../../radio/src/radio-group'
import { checkboxProps } from '../../checkbox/src/checkbox'
import { checkboxGroupProps } from '../../checkbox/src/checkbox-group'
import { tableSelectProps } from '../../table-select/src/table-select'
import { cascaderProps } from '../../cascader/src/cascader'
import { rateProps } from '../../rate/src/rate'
import { sliderProps } from '../../slider/src/slider'
import { switchProps } from '../../switch/src/switch'
import { verificationCodeProps } from '../../verification-code/src/verification-code'

describe('shared renderer size contract', () => {
  it.each([
    ['input', inputProps],
    ['textarea', textareaProps],
    ['date', datePickerProps],
    ['time select', timeSelectProps],
    ['time picker', timePickerProps],
    ['select', selectProps],
    ['radio group', radioGroupProps],
    ['checkbox', checkboxProps],
    ['checkbox group', checkboxGroupProps],
    ['table select', tableSelectProps],
    ['cascader', cascaderProps],
    ['rate', rateProps],
    ['slider', sliderProps],
    ['switch', switchProps],
    ['verification code', verificationCodeProps],
  ])('%s exposes the shared three-step size prop', (_name, props) => {
    expect(props).toHaveProperty('size')
  })
})
