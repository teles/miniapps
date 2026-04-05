import { SPLIT_SELECT_BUTTON_CLASSES, DOWNLOAD_FORMAT_OPTIONS } from '../components/index.js'
import { DESIGN_SYSTEM_ICONS } from '../index.js'

export default {
  title: 'Design System/Split Select Button',
  tags: ['autodocs'],
  argTypes: {
    format: {
      control: 'select',
      options: DOWNLOAD_FORMAT_OPTIONS.map((item) => item.value)
    },
    disabled: {
      control: 'boolean'
    }
  },
  render: ({ format, disabled }) => {
    const optionsMarkup = DOWNLOAD_FORMAT_OPTIONS
      .map((item) => `<option value="${item.value}" ${item.value === format ? 'selected' : ''}>${item.label}</option>`)
      .join('')

    const disabledAttr = disabled ? 'disabled' : ''
    const disabledClass = disabled ? ` ${SPLIT_SELECT_BUTTON_CLASSES.button_disabled}` : ''

    return `
      <div style="padding: 1rem; border: 1px solid #CECDC3; border-radius: 10px; background: #FFFCF0; max-width: 420px;">
        <div class="${SPLIT_SELECT_BUTTON_CLASSES.container}">
          <button class="${SPLIT_SELECT_BUTTON_CLASSES.button}${disabledClass}" ${disabledAttr}>Download</button>
          <div class="${SPLIT_SELECT_BUTTON_CLASSES.select_wrap}">
            <select class="${SPLIT_SELECT_BUTTON_CLASSES.select}" ${disabledAttr}>
              ${optionsMarkup}
            </select>
            <svg class="${SPLIT_SELECT_BUTTON_CLASSES.chevron}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="${DESIGN_SYSTEM_ICONS.chevron_down}" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
      </div>
    `
  }
}

export const Playground = {
  args: {
    format: 'txt',
    disabled: false
  }
}

export const Disabled = {
  args: {
    format: 'md',
    disabled: true
  }
}
