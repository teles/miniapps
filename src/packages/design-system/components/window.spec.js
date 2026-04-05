import { beforeEach, describe, expect, it, vi } from 'vitest'

class FakeClassList {
    constructor() {
        this._tokens = new Set()
    }

    add(...tokens) {
        tokens.forEach((token) => {
            if (token) this._tokens.add(token)
        })
    }

    remove(...tokens) {
        tokens.forEach((token) => this._tokens.delete(token))
    }

    contains(token) {
        return this._tokens.has(token)
    }

    setFromString(value = '') {
        this._tokens = new Set(value.split(/\s+/).filter(Boolean))
    }

    toString() {
        return [...this._tokens].join(' ')
    }
}

class FakeElement {
    constructor(tagName = 'div') {
        this.tagName = String(tagName).toUpperCase()
        this.parentNode = null
        this.children = []
        this.attributes = {}
        this.style = {}
        this.classList = new FakeClassList()
        this._listeners = new Map()
        this._pointerCaptures = new Set()
        this._rect = { left: 0, top: 0, width: 0, height: 0 }
    }

    appendChild(child) {
        child.parentNode = this
        this.children.push(child)
        return child
    }

    setAttribute(name, value) {
        this.attributes[name] = String(value)
        if (name === 'class') {
            this.classList.setFromString(String(value))
        }
    }

    getAttribute(name) {
        return Object.hasOwn(this.attributes, name) ? this.attributes[name] : null
    }

    addEventListener(type, handler) {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, [])
        }

        this._listeners.get(type).push(handler)
    }

    dispatchEvent(event) {
        const listeners = this._listeners.get(event.type) || []
        const enrichedEvent = {
            target: this,
            currentTarget: this,
            ...event
        }

        listeners.forEach((handler) => handler(enrichedEvent))
        return true
    }

    setPointerCapture(pointerId) {
        this._pointerCaptures.add(pointerId)
    }

    hasPointerCapture(pointerId) {
        return this._pointerCaptures.has(pointerId)
    }

    releasePointerCapture(pointerId) {
        this._pointerCaptures.delete(pointerId)
    }

    matches(selector) {
        if (!selector) return false

        if (selector.startsWith('.')) {
            return this.classList.contains(selector.slice(1))
        }

        const attrMatch = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/)
        if (!attrMatch) return false

        const [, attrName, attrValue] = attrMatch
        if (!Object.hasOwn(this.attributes, attrName)) return false
        if (attrValue === undefined) return true
        return this.attributes[attrName] === attrValue
    }

    closest(selector) {
        let current = this
        while (current) {
            if (current.matches(selector)) {
                return current
            }

            current = current.parentNode instanceof FakeElement ? current.parentNode : null
        }

        return null
    }

    contains(node) {
        let current = node
        while (current) {
            if (current === this) {
                return true
            }

            current = current.parentNode instanceof FakeElement ? current.parentNode : null
        }

        return false
    }

    querySelectorAll(selector) {
        const results = []

        const walk = (node) => {
            node.children.forEach((child) => {
                if (child.matches(selector)) {
                    results.push(child)
                }

                walk(child)
            })
        }

        walk(this)
        return results
    }

    querySelector(selector) {
        return this.querySelectorAll(selector)[0] || null
    }

    setRect({ left, top, width, height }) {
        this._rect = { left, top, width, height }
    }

    getBoundingClientRect() {
        const parseStyle = (key, fallback) => {
            const parsed = Number.parseFloat(this.style[key])
            return Number.isFinite(parsed) ? parsed : fallback
        }

        const left = parseStyle('left', this._rect.left)
        const top = parseStyle('top', this._rect.top)
        const width = parseStyle('width', this._rect.width)
        const height = parseStyle('height', this._rect.height)

        return {
            left,
            top,
            width,
            height,
            right: left + width,
            bottom: top + height
        }
    }
}

class FakeDocument {
    constructor() {
        this.body = new FakeElement('body')
        this._listeners = new Map()
    }

    createElement(tagName) {
        return new FakeElement(tagName)
    }

    querySelectorAll(selector) {
        const ownMatch = this.body.matches(selector) ? [this.body] : []
        return [...ownMatch, ...this.body.querySelectorAll(selector)]
    }

    addEventListener(type, handler) {
        if (!this._listeners.has(type)) {
            this._listeners.set(type, [])
        }

        this._listeners.get(type).push(handler)
    }
}

const createWindowMock = ({ innerWidth = 900, innerHeight = 700 } = {}) => {
    const listeners = new Map()
    const locationAssign = vi.fn()

    return {
        innerWidth,
        innerHeight,
        location: {
            assign: locationAssign
        },
        addEventListener(type, handler) {
            if (!listeners.has(type)) {
                listeners.set(type, [])
            }

            listeners.get(type).push(handler)
        },
        dispatch(type, event = {}) {
            const handlers = listeners.get(type) || []
            handlers.forEach((handler) => handler({ type, ...event }))
        },
        locationAssign
    }
}

const buildWindowCard = (document, { closeHref = '/' } = {}) => {
    const card = new FakeElement('main')
    card.setAttribute('data-microapp-window', '')
    card.setAttribute('data-microapp-close-href', closeHref)
    card.setRect({ left: 120, top: 80, width: 450, height: 500 })

    const bar = new FakeElement('div')
    bar.setAttribute('data-microapp-window-handle', '')

    const controls = new FakeElement('div')

    const closeButton = new FakeElement('button')
    closeButton.setAttribute('data-microapp-window-action', 'close')

    const minimizeButton = new FakeElement('button')
    minimizeButton.setAttribute('data-microapp-window-action', 'minimize')

    const maximizeButton = new FakeElement('button')
    maximizeButton.setAttribute('data-microapp-window-action', 'maximize')

    controls.appendChild(closeButton)
    controls.appendChild(minimizeButton)
    controls.appendChild(maximizeButton)
    bar.appendChild(controls)

    const content = new FakeElement('section')
    card.appendChild(bar)
    card.appendChild(content)
    document.body.appendChild(card)

    return {
        card,
        bar,
        closeButton,
        minimizeButton,
        maximizeButton
    }
}

const loadWindowModule = async () => {
    vi.resetModules()
    return import('./window.js')
}

describe('initializeMicroappWindows', () => {
    beforeEach(() => {
        vi.unstubAllGlobals()
    })

    it('drags cards and keeps them inside viewport bounds', async () => {
        const document = new FakeDocument()
        const windowMock = createWindowMock({ innerWidth: 900, innerHeight: 700 })
        const { card, bar } = buildWindowCard(document)

        vi.stubGlobal('document', document)
        vi.stubGlobal('window', windowMock)
        vi.stubGlobal('Element', FakeElement)

        const { initializeMicroappWindows } = await loadWindowModule()
        initializeMicroappWindows()

        bar.dispatchEvent({
            type: 'pointerdown',
            button: 0,
            pointerId: 1,
            clientX: 210,
            clientY: 150,
            target: bar,
            preventDefault: vi.fn()
        })

        bar.dispatchEvent({
            type: 'pointermove',
            pointerId: 1,
            clientX: 5000,
            clientY: 5000,
            target: bar
        })

        expect(card.classList.contains('is-floating')).toBe(true)
        expect(card.style.left).toBe('438px')
        expect(card.style.top).toBe('188px')
        expect(document.body.classList.contains('microapp-window-dragging')).toBe(true)

        bar.dispatchEvent({
            type: 'pointerup',
            pointerId: 1,
            target: bar
        })

        expect(document.body.classList.contains('microapp-window-dragging')).toBe(false)
    })

    it('toggles minimized state through yellow control', async () => {
        const document = new FakeDocument()
        const windowMock = createWindowMock()
        const { card, minimizeButton } = buildWindowCard(document)

        vi.stubGlobal('document', document)
        vi.stubGlobal('window', windowMock)
        vi.stubGlobal('Element', FakeElement)

        const { initializeMicroappWindows } = await loadWindowModule()
        initializeMicroappWindows()

        card.dispatchEvent({ type: 'click', target: minimizeButton })
        expect(card.classList.contains('is-minimized')).toBe(true)
        expect(minimizeButton.getAttribute('aria-pressed')).toBe('true')

        card.dispatchEvent({ type: 'click', target: minimizeButton })
        expect(card.classList.contains('is-minimized')).toBe(false)
        expect(minimizeButton.getAttribute('aria-pressed')).toBe('false')
    })

    it('maximizes, reacts to resize, and restores through green control', async () => {
        const document = new FakeDocument()
        const windowMock = createWindowMock({ innerWidth: 900, innerHeight: 700 })
        const { card, maximizeButton } = buildWindowCard(document)

        vi.stubGlobal('document', document)
        vi.stubGlobal('window', windowMock)
        vi.stubGlobal('Element', FakeElement)

        const { initializeMicroappWindows } = await loadWindowModule()
        initializeMicroappWindows()

        card.dispatchEvent({ type: 'click', target: maximizeButton })
        expect(card.classList.contains('is-maximized')).toBe(true)
        expect(maximizeButton.getAttribute('aria-pressed')).toBe('true')
        expect(maximizeButton.getAttribute('data-tooltip')).toBe('Restore window')
        expect(card.style.left).toBe('12px')
        expect(card.style.top).toBe('12px')
        expect(card.style.width).toBe('876px')
        expect(card.style.height).toBe('676px')

        windowMock.innerWidth = 800
        windowMock.innerHeight = 600
        windowMock.dispatch('resize')
        expect(card.style.width).toBe('776px')
        expect(card.style.height).toBe('576px')

        card.dispatchEvent({ type: 'click', target: maximizeButton })
        expect(card.classList.contains('is-maximized')).toBe(false)
        expect(maximizeButton.getAttribute('aria-pressed')).toBe('false')
        expect(maximizeButton.getAttribute('data-tooltip')).toBe('Maximize window')
        expect(card.style.left).toBe('120px')
        expect(card.style.top).toBe('80px')
        expect(card.style.width).toBe('450px')
        expect(card.style.height).toBe('500px')
    })

    it('navigates to close target through red control', async () => {
        const document = new FakeDocument()
        const windowMock = createWindowMock()
        const { card, closeButton } = buildWindowCard(document, { closeHref: '/launcher' })

        vi.stubGlobal('document', document)
        vi.stubGlobal('window', windowMock)
        vi.stubGlobal('Element', FakeElement)

        const { initializeMicroappWindows } = await loadWindowModule()
        initializeMicroappWindows()

        card.dispatchEvent({ type: 'click', target: closeButton })
        expect(windowMock.locationAssign).toHaveBeenCalledWith('/launcher')
    })
})
