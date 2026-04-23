// NPR locale formatting — consistent everywhere in the app

export const fmtNPR = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '—';
  return Number(value).toLocaleString('en-NP', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const fmtInt = (value) =>
  Number(value).toLocaleString('en-NP');

export const fmtPct = (value, decimals = 2) =>
  `${value >= 0 ? '+' : ''}${Number(value).toFixed(decimals)}%`;

export const today = () => new Date().toISOString().slice(0, 10);