import Alpine from 'alpinejs'
import pomodoro from './pomodoro'
import '../css/index.css'
Alpine.data('pomodoro', pomodoro)

Alpine.start()