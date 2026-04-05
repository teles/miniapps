import { BUTTON_CLASSES, MODAL_CLASSES } from '../components/index.js'

export default {
  title: 'Design System/Modal',
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' }
  },
  render: ({ title, confirmLabel, cancelLabel }) => `
    <div class="${MODAL_CLASSES.container}" style="position: relative; min-height: 360px;">
      <div class="${MODAL_CLASSES.backdrop}"></div>
      <div class="${MODAL_CLASSES.panel_wrap}">
        <div class="${MODAL_CLASSES.panel}">
          <button class="${MODAL_CLASSES.close_button}" type="button">×</button>
          <div class="${MODAL_CLASSES.content}">
            <h3 class="${MODAL_CLASSES.title}">${title}</h3>
            <button class="${BUTTON_CLASSES.modal_confirm}" type="button">${confirmLabel}</button>
            <button class="${BUTTON_CLASSES.modal_cancel}" type="button">${cancelLabel}</button>
          </div>
        </div>
      </div>
    </div>
  `
}

export const Playground = {
  args: {
    title: 'Modal content',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel'
  }
}
