// Default application settings.
// `intervals` defines the spaced-repetition schedule as offsets (in days)
// from the day a lecture is completed. Index 0 is always the "Learn" day
// itself (offset 0) and is not editable — everything after it is a revision.
export const DEFAULT_INTERVALS = [0, 1, 3, 7, 14, 30];

export const DEFAULT_SETTINGS = {
  intervals: DEFAULT_INTERVALS,
  theme: "dark",
  notifyOverdue: true,
};

export const SETTINGS_KEY = "upsc-tracker:settings";
