import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import { initializeTooltips } from '../../packages/design-system/index.js'
import emojiRemoverApp from './app.js'
import '../../packages/design-system/styles.css'
import '../../css/index.css'

function emojiRemover() {
    return emojiRemoverApp()
}

window.emojiRemover = emojiRemover
Alpine.data('emojiRemover', emojiRemover)
Alpine.plugin(persist)
Alpine.start()
initializeTooltips()
