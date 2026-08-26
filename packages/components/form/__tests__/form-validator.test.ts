import { describe, expect, it, vi } from 'vitest'
import { createFormValidator } from '../src/form-validator'

describe('createFormValidator', () => {
  it('validates schema fields without mounting a form', async () => {
    const model = { profile: { name: '' }, hidden: '' }
    const validator = createFormValidator(model, {
      items: [
        {
          title: 'Profile',
          children: [
            {
              field: 'profile.name',
              title: 'Name',
              rules: { required: true, message: 'Enter a name' },
            },
            {
              field: 'hidden',
              visible: false,
              rules: { required: true, message: 'Hidden is required' },
            },
          ],
        },
      ],
    })

    await expect(validator.validate()).resolves.toEqual({
      valid: false,
      errors: { 'profile.name': 'Enter a name' },
    })

    model.profile.name = 'Ada'
    await expect(validator.validate()).resolves.toEqual({
      valid: true,
      errors: {},
    })
  })

  it('supports global rules, selected fields, and async validators', async () => {
    const validateCode = vi.fn(async (value: unknown) =>
      value === 'SAX' ? true : 'Invalid code',
    )
    const model = { name: '', code: 'wrong' }
    const validator = createFormValidator(model, {
      rules: {
        name: { required: true, message: 'Name is required' },
        code: { validator: validateCode },
      },
    })

    await expect(validator.validate(['code'])).resolves.toEqual({
      valid: false,
      errors: { code: 'Invalid code' },
    })
    expect(validateCode).toHaveBeenCalledWith('wrong', model)

    model.code = 'SAX'
    await expect(validator.validateField('code')).resolves.toMatchObject({
      valid: true,
      message: '',
    })
  })
})
