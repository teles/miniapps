import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import { initializeMicroappWindows, initializeTooltips } from '../../packages/design-system/index.js'
import pomodoroApp from './app.js'
import '../../packages/design-system/styles.css'
import '../../css/index.css'

function pomodoro() {
    return pomodoroApp(Alpine)
}

window.pomodoro = pomodoro
Alpine.data('pomodoro', pomodoro)
Alpine.plugin(persist)
Alpine.start()
initializeMicroappWindows()
initializeTooltips()
