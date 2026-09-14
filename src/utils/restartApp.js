import RNRestart from 'react-native-restart';

export const restartApp = () => {
    if (typeof window !== 'undefined' && window.location && window.location.reload) {
        window.location.reload();
        return;
    }
    if (RNRestart && RNRestart.restart) {
        RNRestart.restart();
    }
};
