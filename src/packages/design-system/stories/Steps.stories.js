import { STEPS_CLASSES, getStepState } from '../components/index.js'

const STEPS = [
  { id: 1, label: 'Paste' },
  { id: 2, label: 'Choose' },
  { id: 3, label: 'Export' }
]

function indicatorClass(state) {
  if (state === 'complete') return `${STEPS_CLASSES.indicator} ${STEPS_CLASSES.indicator_complete}`
  if (state === 'active') return `${STEPS_CLASSES.indicator} ${STEPS_CLASSES.indicator_active}`
  return `${STEPS_CLASSES.indicator} ${STEPS_CLASSES.indicator_upcoming}`
}

function labelClass(state) {
  if (state === 'complete') return `${STEPS_CLASSES.label} ${STEPS_CLASSES.label_complete}`
  if (state === 'active') return `${STEPS_CLASSES.label} ${STEPS_CLASSES.label_active}`
  return `${STEPS_CLASSES.label} ${STEPS_CLASSES.label_upcoming}`
}

function connectorClass(isComplete) {
  return `${STEPS_CLASSES.connector} ${isComplete ? STEPS_CLASSES.connector_complete : STEPS_CLASSES.connector_upcoming}`
}

export default {
  title: 'Design System/Steps',
  tags: ['autodocs'],
  argTypes: {
    currentStep: {
      control: 'select',
      options: [1, 2, 3, 4]
    }
  },
  render: ({ currentStep }) => {
    const stepItems = STEPS.map((step) => {
      const state = getStepState(currentStep, step.id)
      const indicatorText = state === 'complete' ? '✓' : String(step.id)

      return `
        <li class="${STEPS_CLASSES.item}">
          <div class="${STEPS_CLASSES.trigger} ${STEPS_CLASSES.trigger_enabled}">
            <span class="${indicatorClass(state)}">${indicatorText}</span>
            <span class="${labelClass(state)}">${step.label}</span>
          </div>
          ${step.id < STEPS.length ? `<span class="${connectorClass(step.id < currentStep)}"></span>` : ''}
        </li>
      `
    }).join('')

    const helperText = currentStep > STEPS.length
      ? 'All steps completed'
      : `Step ${currentStep} of ${STEPS.length}`

    return `
      <div style="max-width: 720px; padding: 1rem; background: #FFFCF0; border: 1px solid #CECDC3; border-radius: 10px;">
        <nav class="${STEPS_CLASSES.nav}" aria-label="Progress steps">
          <ol class="${STEPS_CLASSES.list}">
            ${stepItems}
          </ol>
        </nav>
        <p class="text-sm text-[#6F6E69]">${helperText}</p>
      </div>
    `
  }
}

export const Playground = {
  args: {
    currentStep: 2
  }
}

export const Completed = {
  args: {
    currentStep: 4
  }
}
