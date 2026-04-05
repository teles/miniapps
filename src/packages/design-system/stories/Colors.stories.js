import { DESIGN_SYSTEM_COLORS, DESIGN_SYSTEM_PALETTE } from '../colors.js'

export default {
  title: 'Design System/Colors',
  tags: ['autodocs']
}

function swatch({ name, token, value }) {
  const lightTokens = new Set(['surface', 'border', 'muted_bg', 'warning_light'])
  const isLight = lightTokens.has(token)
  return `
    <div style="display:flex; flex-direction:column; gap:6px;">
      <div style="
        width: 88px; height: 64px; border-radius: 10px;
        background: ${value};
        border: 1px solid rgba(0,0,0,${isLight ? '0.12' : '0.06'});
        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
      "></div>
      <div style="font-size:12px; font-weight:600; color:#100F0F; line-height:1.3;">${name}</div>
      <div style="font-size:11px; color:#6F6E69; font-family:ui-monospace,monospace;">${value}</div>
      <div style="font-size:10px; color:#878580; font-family:ui-monospace,monospace;">${token}</div>
    </div>
  `
}

function group(label, items) {
  return `
    <div style="margin-bottom: 36px;">
      <h3 style="
        font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
        text-transform: uppercase; color: #6F6E69; margin: 0 0 16px;
      ">${label}</h3>
      <div style="display: flex; gap: 20px; flex-wrap: wrap;">
        ${items.map(swatch).join('')}
      </div>
    </div>
  `
}

export const Palette = {
  render: () => {
    const groups = [...new Set(DESIGN_SYSTEM_PALETTE.map(c => c.group))]
    const gradientValue = `linear-gradient(135deg, ${DESIGN_SYSTEM_COLORS.bg_start} 0%, ${DESIGN_SYSTEM_COLORS.bg_end} 100%)`
    return `
      <div style="
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        padding: 40px; background: #F2F0E5; min-height: 100vh;
      ">
        <h1 style="font-size: 1.5rem; font-weight: 700; color: #100F0F; margin: 0 0 4px;">Colors</h1>
        <p style="font-size: 0.875rem; color: #6F6E69; margin: 0 0 40px;">
          Design system color tokens — use these in components and utilities.
        </p>

        ${groups.map(g =>
          group(g, DESIGN_SYSTEM_PALETTE.filter(c => c.group === g))
        ).join('')}

        <div style="margin-top: 8px;">
          <h3 style="
            font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
            text-transform: uppercase; color: #6F6E69; margin: 0 0 16px;
          ">App Gradient Preview</h3>
          <div style="
            width: 100%; max-width: 320px; height: 72px; border-radius: 12px;
            background: ${gradientValue};
            box-shadow: 0 4px 14px rgba(67,133,190,0.35);
          "></div>
        </div>
      </div>
    `
  }
}
