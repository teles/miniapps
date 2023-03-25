import Alpine from 'alpinejs'
import pomodoro from './pomodoro'
// import persist from '@alpinejs/persist'
import '../css/index.css'

Alpine.data('pomodoro', pomodoro)
// Alpine.plugin(persist)
Alpine.start()