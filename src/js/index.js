import pomodoro from './pomodoro'
import persist from '@alpinejs/persist'
import Alpine from 'alpinejs'
import '../css/index.css'

Alpine.plugin(persist)
Alpine.data('pomodoro', pomodoro)
Alpine.start()