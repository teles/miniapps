export const STEPS_CLASSES = {
    nav: 'mb-4',
    list: 'flex items-start',
    item: 'relative flex-1 min-w-0',
    trigger: 'w-full flex flex-col items-center gap-1 text-center rounded-md py-1 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4385BE]',
    trigger_enabled: 'cursor-pointer',
    trigger_disabled: 'cursor-not-allowed opacity-50',
    indicator: 'z-10 h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all',
    indicator_active: 'bg-[#205EA6] border-[#205EA6] text-[#FFFCF0] shadow',
    indicator_complete: 'bg-[#66800B] border-[#66800B] text-[#FFFCF0] shadow',
    indicator_upcoming: 'bg-[#FFFCF0] border-[#B7B5AC] text-[#6F6E69]',
    label: 'text-[11px] font-semibold uppercase tracking-wide transition-colors',
    label_active: 'text-[#205EA6]',
    label_complete: 'text-[#66800B]',
    label_upcoming: 'text-[#6F6E69]',
    connector: 'absolute left-1/2 right-[-50%] top-5 h-0.5',
    connector_complete: 'bg-[#879A39]',
    connector_upcoming: 'bg-[#CECDC3]'
}

export function getStepState(currentStep, stepId) {
    if (stepId < currentStep) return 'complete'
    if (stepId === currentStep) return 'active'
    return 'upcoming'
}

export default STEPS_CLASSES
