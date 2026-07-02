const isTrueValue = (value) => value === true || value === 'true' || value === '1';

export const USE_MOCKS = isTrueValue(import.meta.env.VITE_USE_MOCKS);