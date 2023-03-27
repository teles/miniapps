import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import pomodoroCore from './pomodoro-core'
import '../css/index.css'

function pomodoro() {
    return pomodoroCore(Alpine.$persist);
}

window.pomodoro = pomodoro
Alpine.data('pomodoro', pomodoro)
Alpine.plugin(persist)
Alpine.start()