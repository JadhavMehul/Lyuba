export type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds: number;
};

export type CreatedAt = FirestoreTimestamp | string;

// Convert to JS Date
const toDate = (createdAt: CreatedAt) => {
  return typeof createdAt === "string"
    ? new Date(createdAt)
    : new Date(createdAt._seconds * 1000);
};

// Get time like 02:45 PM
export const getTime = (createdAt: CreatedAt) => {
  return toDate(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Check today
export const isToday = (createdAt: CreatedAt) => {
  const date = toDate(createdAt);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Check same day
export const isSameDay = (a: CreatedAt, b?: CreatedAt) => {
  if (!b) return false;

  const dateA = toDate(a);
  const dateB = toDate(b);

  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
};

// Full date label
export const getFullDate = (createdAt: CreatedAt) => {
  return toDate(createdAt).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
