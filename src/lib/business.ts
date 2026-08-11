export const FOUNDING_YEAR = 1989;

// Recomputed on every build, so "37+ years" style copy never needs a manual annual bump.
export const YEARS_TRADING = new Date().getFullYear() - FOUNDING_YEAR;
