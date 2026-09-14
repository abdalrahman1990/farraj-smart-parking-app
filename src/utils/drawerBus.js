let isOpen = false;
const listeners = new Set();

const notify = () => listeners.forEach((l) => l());

export const drawerBus = {
    get open() {
        return isOpen;
    },
    openDrawer: () => {
        isOpen = true;
        notify();
    },
    closeDrawer: () => {
        isOpen = false;
        notify();
    },
    toggle: () => {
        isOpen = !isOpen;
        notify();
    },
    subscribe: (l) => {
        listeners.add(l);
        return () => listeners.delete(l);
    },
};
