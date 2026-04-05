export const MODAL_CLASSES = {
    container: 'flex fixed inset-0 z-50 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full',
    backdrop: 'bg-black/70 inset-o absolute w-full h-full cursor-pointer',
    panel_wrap: 'relative w-full h-full max-w-md md:h-auto m-auto',
    panel: 'relative bg-white rounded-lg shadow',
    close_button: 'absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center',
    content: 'p-6 text-center',
    title: 'mb-5 text-lg font-normal text-gray-500'
}

const defaultModalState = {
    is_open: false,
    title: 'Modal content',
    cancel_label: 'Cancel',
    confirm_label: 'Confirm',
    on_cancel: () => {},
    on_confirm: () => {}
}

export function createModalState() {
    return {
        ...defaultModalState,
        on_cancel: () => {},
        on_confirm: () => {}
    }
}

export function createOpenedModalState(modal = {}, closeModal = () => {}) {
    const onCancel = typeof modal.on_cancel === 'function' ? modal.on_cancel : () => {}
    const onConfirm = typeof modal.on_confirm === 'function' ? modal.on_confirm : () => {}

    return {
        ...createModalState(),
        is_open: true,
        title: modal.title || defaultModalState.title,
        cancel_label: modal.cancel_label || defaultModalState.cancel_label,
        confirm_label: modal.confirm_label || defaultModalState.confirm_label,
        on_cancel: () => {
            onCancel()
            closeModal()
        },
        on_confirm: () => {
            onConfirm()
            closeModal()
        }
    }
}

export default MODAL_CLASSES
