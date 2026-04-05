export const TOOLTIP_CLASSES = {
    anchor: 'ds-tooltip'
}

let isTooltipInitialized = false
let tooltipElement = null
let activeAnchor = null

const findTooltipAnchor = (target) => {
    if (!(target instanceof Element)) {
        return null
    }

    return target.closest(`.${TOOLTIP_CLASSES.anchor}[data-tooltip]`)
}

const hideTooltip = () => {
    if (!tooltipElement) {
        return
    }

    tooltipElement.classList.remove('is-visible')
    tooltipElement.setAttribute('aria-hidden', 'true')
    activeAnchor = null
}

const positionTooltip = (anchor) => {
    if (!tooltipElement || !anchor) {
        return
    }

    const text = (anchor.getAttribute('data-tooltip') || '').trim()
    if (!text) {
        hideTooltip()
        return
    }

    tooltipElement.textContent = text
    tooltipElement.setAttribute('aria-hidden', 'false')
    tooltipElement.classList.add('is-visible')

    const anchorRect = anchor.getBoundingClientRect()
    const tooltipRect = tooltipElement.getBoundingClientRect()
    const viewportPadding = 8
    const offset = 10

    let left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2
    left = Math.max(
        viewportPadding,
        Math.min(left, window.innerWidth - tooltipRect.width - viewportPadding)
    )

    let top = anchorRect.top - tooltipRect.height - offset
    let placement = 'top'

    if (top < viewportPadding) {
        top = anchorRect.bottom + offset
        placement = 'bottom'
    }

    tooltipElement.style.left = `${Math.round(left)}px`
    tooltipElement.style.top = `${Math.round(top)}px`
    tooltipElement.setAttribute('data-placement', placement)
}

const showTooltip = (anchor) => {
    activeAnchor = anchor
    positionTooltip(anchor)
}

export function initializeTooltips() {
    if (typeof window === 'undefined' || isTooltipInitialized) {
        return
    }

    isTooltipInitialized = true

    tooltipElement = document.createElement('div')
    tooltipElement.className = 'ds-tooltip-floating'
    tooltipElement.setAttribute('role', 'tooltip')
    tooltipElement.setAttribute('aria-hidden', 'true')
    tooltipElement.setAttribute('data-placement', 'top')
    document.body.appendChild(tooltipElement)

    document.addEventListener('mouseover', (event) => {
        const anchor = findTooltipAnchor(event.target)
        if (!anchor) {
            return
        }

        if (activeAnchor !== anchor) {
            showTooltip(anchor)
            return
        }

        positionTooltip(anchor)
    })

    document.addEventListener('mouseout', (event) => {
        if (!activeAnchor) {
            return
        }

        const related = event.relatedTarget
        if (related instanceof Element && activeAnchor.contains(related)) {
            return
        }

        hideTooltip()
    })

    document.addEventListener('focusin', (event) => {
        const anchor = findTooltipAnchor(event.target)
        if (!anchor) {
            return
        }

        showTooltip(anchor)
    })

    document.addEventListener('focusout', (event) => {
        if (!activeAnchor) {
            return
        }

        const related = event.relatedTarget
        if (related instanceof Element && activeAnchor.contains(related)) {
            return
        }

        hideTooltip()
    })

    window.addEventListener('resize', () => {
        if (activeAnchor) {
            positionTooltip(activeAnchor)
        }
    })

    window.addEventListener(
        'scroll',
        () => {
            if (activeAnchor) {
                positionTooltip(activeAnchor)
            }
        },
        true
    )
}

export default TOOLTIP_CLASSES
