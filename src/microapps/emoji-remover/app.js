import {
    BUTTON_CLASSES,
    DOWNLOAD_SELECT_CLASSES,
    DOWNLOAD_FORMAT_OPTIONS,
    STEPS_CLASSES,
    getStepState,
    DESIGN_SYSTEM_ICONS
} from '../../packages/design-system/index.js'

const INPUT_STORAGE_KEY = 'emoji-remover-input'

// Matches emoji sequences: base emoji + optional skin tone/variation, ZWJ chains, and flag pairs.
function getEmojiRegex() {
    return /\p{Extended_Pictographic}(?:[\u{FE0F}\u{20E3}]|[\u{1F3FB}-\u{1F3FF}])?(?:\u{200D}\p{Extended_Pictographic}(?:[\u{FE0F}\u{20E3}]|[\u{1F3FB}-\u{1F3FF}])?)*|[\u{1F1E6}-\u{1F1FF}]{2}/gu
}

export function extractUniqueEmojis(text) {
    const matches = text.match(getEmojiRegex())
    return matches ? [...new Set(matches)] : []
}

// Smart removal: replaces each targeted emoji plus its contextual surrounding space.
// Rules per match `( ?)(emoji)([ \t]*)`:
//   - leading space + emoji + trailing space + more content → keep one space ("Hello 😀 world" → "Hello world")
//   - any other case → remove cleanly (leading space consumed too)
function smartRemove(text, shouldRemove) {
    const emojiSource = getEmojiRegex().source
    const pattern = new RegExp(`( ?)(${emojiSource})([ \\t]*)`, 'gu')
    return text.replace(pattern, (match, leadingSpace, emoji, trailingSpaces, offset, str) => {
        if (!shouldRemove(emoji)) return match
        const afterMatch = offset + match.length
        const hasTrailingContent = afterMatch < str.length && str[afterMatch] !== '\n'
        // Middle of line with spaces on both sides: preserve one separator space
        if (leadingSpace && trailingSpaces && hasTrailingContent) return ' '
        // All other cases: remove entirely (captures leading space too, so no orphan)
        return ''
    })
}

export function removeAllEmojis(text) {
    return smartRemove(text, () => true)
}

export function removeSpecificEmojis(text, emojisToRemove) {
    if (!emojisToRemove.length) return text
    const set = new Set(emojisToRemove)
    return smartRemove(text, (emoji) => set.has(emoji))
}

export function countEmojiMatches(text) {
    const matches = text.match(getEmojiRegex())
    return matches ? matches.length : 0
}

const FLOW_STEPS = [
    { id: 1, label: 'Paste' },
    { id: 2, label: 'Choose' },
    { id: 3, label: 'Export' }
]

export default function () {
    return {
        ds: {
            button: BUTTON_CLASSES,
            download: DOWNLOAD_SELECT_CLASSES,
            steps: STEPS_CLASSES,
            icons: DESIGN_SYSTEM_ICONS
        },

        steps: FLOW_STEPS,
        current_step: 1,

        input_text: '',
        mode: 'all',
        selected_emojis: [],

        output_text: '',
        removed_in_output: 0,

        download_format: 'txt',
        download_formats: DOWNLOAD_FORMAT_OPTIONS,
        copy_label: 'Copy',
        _copy_timer: null,

        init() {
            this.input_text = localStorage.getItem(INPUT_STORAGE_KEY) ?? ''
        },

        get has_text() {
            return this.input_text.length > 0
        },

        get found_emojis() {
            return extractUniqueEmojis(this.input_text)
        },

        get found_count() {
            return countEmojiMatches(this.input_text)
        },

        get is_select_mode() {
            return this.mode === 'selected'
        },

        get preview_output() {
            if (!this.input_text) return ''

            if (this.is_select_mode) {
                return removeSpecificEmojis(this.input_text, this.selected_emojis)
            }

            return removeAllEmojis(this.input_text)
        },

        get preview_removed_count() {
            if (!this.input_text) return 0
            return this.found_count - countEmojiMatches(this.preview_output)
        },

        get can_advance_step_2() {
            return this.has_text
        },

        get can_generate_output() {
            return this.preview_removed_count > 0
        },

        get has_output() {
            return this.output_text.length > 0
        },

        get mode_helper_label() {
            if (this.is_select_mode) {
                return 'Advanced mode: choose exactly which emojis should be removed.'
            }

            return 'Auto mode: remove every emoji found in the text.'
        },

        get current_step_title() {
            if (this.current_step === 1) return 'Step 1 of 3: paste text'
            if (this.current_step === 2) return 'Step 2 of 3: choose removal mode'
            return 'Step 3 of 3: review and export'
        },

        stepState(stepId) {
            return getStepState(this.current_step, stepId)
        },

        stepIndicatorClass(stepId) {
            const state = this.stepState(stepId)
            if (state === 'complete') return `${this.ds.steps.indicator} ${this.ds.steps.indicator_complete}`
            if (state === 'active') return `${this.ds.steps.indicator} ${this.ds.steps.indicator_active}`
            return `${this.ds.steps.indicator} ${this.ds.steps.indicator_upcoming}`
        },

        stepLabelClass(stepId) {
            const state = this.stepState(stepId)
            if (state === 'complete') return `${this.ds.steps.label} ${this.ds.steps.label_complete}`
            if (state === 'active') return `${this.ds.steps.label} ${this.ds.steps.label_active}`
            return `${this.ds.steps.label} ${this.ds.steps.label_upcoming}`
        },

        stepConnectorClass(stepId) {
            return `${this.ds.steps.connector} ${stepId < this.current_step ? this.ds.steps.connector_complete : this.ds.steps.connector_upcoming}`
        },

        canGoToStep(stepId) {
            if (stepId === 1) return true
            if (stepId === 2) return this.has_text
            if (stepId === 3) return this.has_output
            return false
        },

        goToStep(stepId) {
            if (!this.canGoToStep(stepId)) return
            this.current_step = stepId
            this.copy_label = 'Copy'
        },

        nextFromInput() {
            if (!this.can_advance_step_2) return
            this.current_step = 2
            this.copy_label = 'Copy'
        },

        backToInput() {
            this.current_step = 1
            this.copy_label = 'Copy'
        },

        setMode(mode) {
            if (mode !== 'all' && mode !== 'selected') return

            this.mode = mode
            if (mode === 'selected') {
                this.selected_emojis = [...this.found_emojis]
            } else {
                this.selected_emojis = []
            }

            this.copy_label = 'Copy'
        },

        on_input_change() {
            localStorage.setItem(INPUT_STORAGE_KEY, this.input_text)
            const available = new Set(this.found_emojis)
            this.selected_emojis = this.selected_emojis.filter((emoji) => available.has(emoji))

            if (this.is_select_mode && this.selected_emojis.length === 0 && this.found_emojis.length > 0) {
                this.selected_emojis = [...this.found_emojis]
            }

            this.output_text = ''
            this.removed_in_output = 0
            this.current_step = 1
            this.copy_label = 'Copy'
        },

        toggleEmoji(emoji) {
            if (this.selected_emojis.includes(emoji)) {
                this.selected_emojis = this.selected_emojis.filter((e) => e !== emoji)
            } else {
                this.selected_emojis = [...this.selected_emojis, emoji]
            }
        },

        selectAllEmojis() {
            this.selected_emojis = [...this.found_emojis]
        },

        deselectAllEmojis() {
            this.selected_emojis = []
        },

        generateOutput() {
            if (!this.can_generate_output) return

            const removedCount = this.preview_removed_count

            this.output_text = this.preview_output
            this.removed_in_output = removedCount
            this.current_step = 3
            this.copy_label = 'Copy'
        },

        clearAll() {
            this.current_step = 1
            this.input_text = ''
            localStorage.removeItem(INPUT_STORAGE_KEY)
            this.mode = 'all'
            this.selected_emojis = []
            this.output_text = ''
            this.removed_in_output = 0
            this.download_format = 'txt'
            this.copy_label = 'Copy'
        },

        async copyText() {
            const text = this.output_text
            if (!text) return

            try {
                await navigator.clipboard.writeText(text)
            } catch {
                const el = document.createElement('textarea')
                el.value = text
                document.body.appendChild(el)
                el.select()
                document.execCommand('copy')
                document.body.removeChild(el)
            }

            this.copy_label = 'Copied!'
            clearTimeout(this._copy_timer)
            this._copy_timer = setTimeout(() => {
                this.copy_label = 'Copy'
            }, 2000)
        },

        downloadOutput() {
            this.downloadAs(this.download_format)
        },

        downloadAs(ext) {
            const content = this.output_text
            if (!content) return

            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `cleaned-text.${ext}`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
        }
    }
}
