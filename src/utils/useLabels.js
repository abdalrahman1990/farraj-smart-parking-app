import { useSelector } from 'react-redux';

export const useLabels = () => useSelector((state) => state.app.trans);

export const useLang = () => (useSelector((state) => state.app.isRTL) ? 'ar' : 'en');

export const useIsRTL = () => useSelector((state) => state.app.isRTL);
