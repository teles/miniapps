import Alpine from 'alpinejs'
import '../src/packages/design-system/styles.css'
import '../src/css/index.css'

if (!window.Alpine) {
  window.Alpine = Alpine
  Alpine.start()
}

export const parameters = {
  controls: {
    expanded: true
  }
}
