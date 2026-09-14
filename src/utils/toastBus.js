let listeners = new Set();
let seq = 0;

const emit = (action) => listeners.forEach((l) => l(action));

export const toast = {
    show: (message, type = 'info', duration = 3000) => {
        const item = { id: ++seq, message, type, duration };
        emit({ type: 'add', item });
        if (duration > 0) {
            setTimeout(() => emit({ type: 'remove', id: item.id }), duration);
        }
        return item.id;
    },
    success: (message, duration) => toast.show(message, 'success', duration),
    error: (message, duration) => toast.show(message, 'error', duration),
    info: (message, duration) => toast.show(message, 'info', duration),
    dismiss: (id) => emit({ type: 'remove', id }),
    subscribe: (l) => {
        listeners.add(l);
        return () => listeners.delete(l);
    },
};
