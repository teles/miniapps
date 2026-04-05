export const DESIGN_SYSTEM_COLORS = {
    // Flexoki accents (official)
    bg_start: '#4385BE', // blue-400
    bg_end: '#8B7EC8',   // purple-400
    // Flexoki base (official)
    surface: '#FFFCF0',   // paper
    border: '#CECDC3',    // base-200
    muted_bg: '#F2F0E5',  // base-50
    // Flexoki text (official)
    text_primary: '#100F0F', // black
    text_muted: '#6F6E69',   // base-600
    // Flexoki action mapping (official)
    primary: '#205EA6',      // blue-600
    danger: '#AF3029',       // red-600
    success: '#66800B',      // green-600
    sky: '#24837B',          // cyan-600
    violet: '#5E409D',       // purple-600
    warning: '#BC5215',      // orange-600
    warning_light: '#F6E2A0' // yellow-100
}

export const DESIGN_SYSTEM_PALETTE = [
    { name: 'Primary',       token: 'primary',       value: '#205EA6', group: 'Actions' },
    { name: 'Danger',        token: 'danger',        value: '#AF3029', group: 'Actions' },
    { name: 'Success',       token: 'success',       value: '#66800B', group: 'Actions' },
    { name: 'Sky',           token: 'sky',           value: '#24837B', group: 'Actions' },
    { name: 'Violet',        token: 'violet',        value: '#5E409D', group: 'Actions' },
    { name: 'Warning',       token: 'warning',       value: '#BC5215', group: 'Actions' },
    { name: 'Warning Light', token: 'warning_light', value: '#F6E2A0', group: 'Actions' },
    { name: 'BG Start',      token: 'bg_start',      value: '#4385BE', group: 'Gradient' },
    { name: 'BG End',        token: 'bg_end',        value: '#8B7EC8', group: 'Gradient' },
    { name: 'Surface',       token: 'surface',       value: '#FFFCF0', group: 'Surface' },
    { name: 'Border',        token: 'border',        value: '#CECDC3', group: 'Surface' },
    { name: 'Muted BG',      token: 'muted_bg',      value: '#F2F0E5', group: 'Surface' },
    { name: 'Text Primary',  token: 'text_primary',  value: '#100F0F', group: 'Text' },
    { name: 'Text Muted',    token: 'text_muted',    value: '#6F6E69', group: 'Text' }
]

export default DESIGN_SYSTEM_COLORS
