const WINDOW_CARD_SELECTOR = '[data-microapp-window]'
const WINDOW_HANDLE_SELECTOR = '[data-microapp-window-handle]'
const WINDOW_CONTROL_SELECTOR = '[data-microapp-window-action]'
const VIEWPORT_GUTTER = 12

let isWindowSystemInitialized = false
const registeredCards = new Set()
const cardStates = new WeakMap()

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const getCardState = (card) => {
    if (!cardStates.has(card)) {
        cardStates.set(card, {
            isFloating: false,
            isMinimized: false,
            isMaximized: false,
            restoreFrame: null,
            preMinimizeHeight: '',
            preMinimizeMinHeight: '',
            drag: null
        })
    }

    return cardStates.get(card)
}

const clampCardToViewport = (card) => {
    const rect = card.getBoundingClientRect()
    const minLeft = VIEWPORT_GUTTER
    const minTop = VIEWPORT_GUTTER
    const maxLeft = Math.max(minLeft, window.innerWidth - rect.width - VIEWPORT_GUTTER)
    const maxTop = Math.max(minTop, window.innerHeight - rect.height - VIEWPORT_GUTTER)

    const rawLeft = Number.parseFloat(card.style.left)
    const rawTop = Number.parseFloat(card.style.top)
    const currentLeft = Number.isFinite(rawLeft) ? rawLeft : rect.left
    const currentTop = Number.isFinite(rawTop) ? rawTop : rect.top

    card.style.left = `${Math.round(clamp(currentLeft, minLeft, maxLeft))}px`
    card.style.top = `${Math.round(clamp(currentTop, minTop, maxTop))}px`
}

const makeCardFloating = (card, state) => {
    if (state.isFloating) {
        return
    }

    const rect = card.getBoundingClientRect()

    card.style.position = 'fixed'
    card.style.left = `${Math.round(rect.left)}px`
    card.style.top = `${Math.round(rect.top)}px`
    card.style.width = `${Math.round(rect.width)}px`
    card.style.height = `${Math.round(rect.height)}px`
    card.style.margin = '0'
    card.classList.add('is-floating')

    state.isFloating = true
    clampCardToViewport(card)
}

const applyMaximizedFrame = (card) => {
    const width = Math.max(320, window.innerWidth - VIEWPORT_GUTTER * 2)
    const height = Math.max(260, window.innerHeight - VIEWPORT_GUTTER * 2)

    card.style.left = `${VIEWPORT_GUTTER}px`
    card.style.top = `${VIEWPORT_GUTTER}px`
    card.style.width = `${Math.round(width)}px`
    card.style.height = `${Math.round(height)}px`
}

const updateControls = (card, state) => {
    const minimizeButton = card.querySelector('[data-microapp-window-action="minimize"]')
    const maximizeButton = card.querySelector('[data-microapp-window-action="maximize"]')

    if (minimizeButton) {
        minimizeButton.setAttribute('aria-pressed', state.isMinimized ? 'true' : 'false')
    }

    if (maximizeButton) {
        maximizeButton.setAttribute('aria-pressed', state.isMaximized ? 'true' : 'false')
        maximizeButton.setAttribute('data-tooltip', state.isMaximized ? 'Restore window' : 'Maximize window')
    }
}

const setMinimized = (card, nextValue) => {
    const state = getCardState(card)
    if (state.isMinimized === nextValue) {
        return
    }

    if (nextValue && state.isMaximized) {
        setMaximized(card, false)
    }

    state.isMinimized = nextValue

    if (nextValue) {
        state.preMinimizeHeight = card.style.height
        state.preMinimizeMinHeight = card.style.minHeight
        card.style.height = 'auto'
        card.style.minHeight = '0'
        card.classList.add('is-minimized')
    } else {
        card.style.height = state.preMinimizeHeight
        card.style.minHeight = state.preMinimizeMinHeight
        card.classList.remove('is-minimized')
    }

    if (state.isFloating) {
        clampCardToViewport(card)
    }

    updateControls(card, state)
}

const setMaximized = (card, nextValue) => {
    const state = getCardState(card)
    if (state.isMaximized === nextValue) {
        return
    }

    if (nextValue && state.isMinimized) {
        setMinimized(card, false)
    }

    if (nextValue) {
        makeCardFloating(card, state)
        const rect = card.getBoundingClientRect()
        state.restoreFrame = {
            left: card.style.left || `${Math.round(rect.left)}px`,
            top: card.style.top || `${Math.round(rect.top)}px`,
            width: card.style.width || `${Math.round(rect.width)}px`,
            height: card.style.height || `${Math.round(rect.height)}px`
        }
        card.classList.add('is-maximized')
        applyMaximizedFrame(card)
    } else {
        card.classList.remove('is-maximized')
        if (state.restoreFrame) {
            card.style.left = state.restoreFrame.left
            card.style.top = state.restoreFrame.top
            card.style.width = state.restoreFrame.width
            card.style.height = state.restoreFrame.height
        }
        clampCardToViewport(card)
    }

    state.isMaximized = nextValue
    updateControls(card, state)
}

const closeMicroappWindow = (card) => {
    const targetHref = card.getAttribute('data-microapp-close-href') || '/'
    window.location.assign(targetHref)
}

const bindWindowCard = (card) => {
    if (registeredCards.has(card)) {
        return
    }

    registeredCards.add(card)
    const state = getCardState(card)
    updateControls(card, state)

    const handle = card.querySelector(WINDOW_HANDLE_SELECTOR)
    if (!handle) {
        return
    }

    const startDrag = (event) => {
        if (event.button !== 0) {
            return
        }

        if (event.target instanceof Element && event.target.closest(WINDOW_CONTROL_SELECTOR)) {
            return
        }

        if (state.isMaximized) {
            return
        }

        event.preventDefault()

        makeCardFloating(card, state)

        const rect = card.getBoundingClientRect()
        state.drag = {
            pointerId: event.pointerId,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        }

        document.body.classList.add('microapp-window-dragging')
        handle.setPointerCapture(event.pointerId)
    }

    const moveDrag = (event) => {
        if (!state.drag || state.drag.pointerId !== event.pointerId) {
            return
        }

        const rect = card.getBoundingClientRect()
        const minLeft = VIEWPORT_GUTTER
        const minTop = VIEWPORT_GUTTER
        const maxLeft = Math.max(minLeft, window.innerWidth - rect.width - VIEWPORT_GUTTER)
        const maxTop = Math.max(minTop, window.innerHeight - rect.height - VIEWPORT_GUTTER)

        const nextLeft = clamp(event.clientX - state.drag.offsetX, minLeft, maxLeft)
        const nextTop = clamp(event.clientY - state.drag.offsetY, minTop, maxTop)

        card.style.left = `${Math.round(nextLeft)}px`
        card.style.top = `${Math.round(nextTop)}px`
    }

    const endDrag = (event) => {
        if (!state.drag || state.drag.pointerId !== event.pointerId) {
            return
        }

        state.drag = null
        document.body.classList.remove('microapp-window-dragging')

        if (handle.hasPointerCapture(event.pointerId)) {
            handle.releasePointerCapture(event.pointerId)
        }
    }

    handle.addEventListener('pointerdown', startDrag)
    handle.addEventListener('pointermove', moveDrag)
    handle.addEventListener('pointerup', endDrag)
    handle.addEventListener('pointercancel', endDrag)

    card.addEventListener('click', (event) => {
        if (!(event.target instanceof Element)) {
            return
        }

        const control = event.target.closest(WINDOW_CONTROL_SELECTOR)
        if (!control || !card.contains(control)) {
            return
        }

        const action = control.getAttribute('data-microapp-window-action')
        if (action === 'close') {
            closeMicroappWindow(card)
            return
        }

        if (action === 'minimize') {
            setMinimized(card, !state.isMinimized)
            return
        }

        if (action === 'maximize') {
            setMaximized(card, !state.isMaximized)
        }
    })
}

export function initializeMicroappWindows() {
    if (typeof window === 'undefined') {
        return
    }

    const cards = document.querySelectorAll(WINDOW_CARD_SELECTOR)
    cards.forEach(bindWindowCard)

    if (isWindowSystemInitialized) {
        return
    }

    isWindowSystemInitialized = true

    window.addEventListener('resize', () => {
        registeredCards.forEach((card) => {
            const state = getCardState(card)
            if (state.isMaximized) {
                applyMaximizedFrame(card)
                return
            }

            if (state.isFloating) {
                clampCardToViewport(card)
            }
        })
    })
}

export default initializeMicroappWindows
