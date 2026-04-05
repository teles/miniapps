export const DOWNLOAD_FORMAT_OPTIONS = [
    { value: 'txt', label: '.txt' },
    { value: 'md', label: '.md' }
]

export const SPLIT_SELECT_BUTTON_CLASSES = {
    container: 'inline-flex items-stretch rounded-md overflow-hidden shadow border border-[#4385BE]',
    select_wrap: 'relative',
    select: 'h-10 min-w-[96px] border-0 border-l border-[#4385BE] bg-[#FFFCF0] pl-3 pr-8 text-sm font-semibold text-[#205EA6] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4385BE] appearance-none',
    chevron: 'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#205EA6]',
    button: 'h-10 px-4 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4385BE] bg-[#205EA6] hover:bg-[#4385BE] text-[#FFFCF0]',
    button_disabled: 'opacity-50 cursor-not-allowed'
}

export const DOWNLOAD_SELECT_CLASSES = SPLIT_SELECT_BUTTON_CLASSES

export default SPLIT_SELECT_BUTTON_CLASSES
