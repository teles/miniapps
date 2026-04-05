import { BUTTON_CLASSES } from '../components/index.js'

const variants = {
  primary: BUTTON_CLASSES.primary,
  icon_action: BUTTON_CLASSES.icon_action,
  modal_confirm: BUTTON_CLASSES.modal_confirm,
  modal_cancel: BUTTON_CLASSES.modal_cancel
}

export default {
  title: 'Design System/Button',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: Object.keys(variants)
    },
    disabled: { control: 'boolean' }
  },
  render: ({ label, variant, disabled }) => {
    const variantClass = variants[variant]
    const disabledClass = disabled && variant === 'primary' ? ` ${BUTTON_CLASSES.disabled}` : ''
    const disabledAttr = disabled ? 'disabled' : ''
    return `<button class="${variantClass}${disabledClass}" ${disabledAttr}>${label}</button>`
  }
}

export const Playground = {
  args: {
    label: 'Add',
    variant: 'primary',
    disabled: false
  }
}
