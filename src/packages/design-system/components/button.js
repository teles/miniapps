const base = 'rounded-md px-3 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1'

export const BUTTON_CLASSES = {
    // Filled variants
    primary: `${base} shadow bg-[#205EA6] hover:bg-[#4385BE] text-[#FFFCF0] focus:ring-[#4385BE]`,
    danger:  `${base} shadow bg-[#AF3029] hover:bg-[#D14D41] text-[#FFFCF0] focus:ring-[#D14D41]`,
    success: `${base} shadow bg-[#66800B] hover:bg-[#879A39] text-[#FFFCF0] focus:ring-[#879A39]`,
    sky:     `${base} shadow bg-[#24837B] hover:bg-[#3AA99F] text-[#FFFCF0] focus:ring-[#3AA99F]`,
    violet:  `${base} shadow bg-[#5E409D] hover:bg-[#8B7EC8] text-[#FFFCF0] focus:ring-[#8B7EC8]`,
    // Outline variant
    outline: `${base} border-2 border-[#4385BE] text-[#205EA6] bg-[#FFFCF0] hover:bg-[#F2F0E5] focus:ring-[#4385BE]`,
    // State helpers
    disabled: 'opacity-50 cursor-not-allowed',
    // Legacy / component-specific
    timer_action: 'my-1 px-3 py-2 text-white cursor-pointer shadow rounded-l-md shadow-sm',
    timer_display: 'my-1 px-3 py-2 shadow flex rounded-r-md shadow-sm min-w-[70px]',
    icon_action: 'm-1 rounded-md px-3 py-2 text-white shadow flex',
    modal_confirm: 'text-[#FFFCF0] bg-[#AF3029] hover:bg-[#D14D41] focus:ring-4 focus:outline-none focus:ring-[#D14D41] font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2',
    modal_cancel: 'text-[#6F6E69] bg-[#FFFCF0] hover:bg-[#F2F0E5] focus:ring-4 focus:outline-none focus:ring-[#CECDC3] rounded-lg border border-[#CECDC3] text-sm font-medium px-5 py-2.5 hover:text-[#100F0F] focus:z-10'
}

export default BUTTON_CLASSES
