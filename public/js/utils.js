// convert time to 12hr format
export const convertTime = (time) => {
  let hours = time.split(":")[0];
  let minutes = time.split(":")[1];
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const formatDate = (dateString) => {
  console.log(dateString);
  // Check if dateString is a range
  const rangeMatch = dateString.match(
    /(\d{4}-\d{2}-\d{2}) — (\d{4}-\d{2}-\d{2})/
  );

  if (rangeMatch) {
    const start = formatSingleDate(rangeMatch[1]);
    const end = formatSingleDate(rangeMatch[2]);
    if (start && end) {
      return `${start} — ${end}`;
    } else {
      return dateString; // invalid range
    }
  } else {
    const singleDate = formatSingleDate(dateString);
    return singleDate || dateString; // if not valid date, return the original string
  }
};

const formatSingleDate = (singleDateString) => {
  const [year, month, day] = singleDateString.split("-");
  if (!year || !month || !day) return null; // Not a valid date string

  const date = new Date(year, month - 1, day);

  if (isNaN(date.getTime())) return null; // Not a valid date

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const convertToSlug = (inputString) => {
  return inputString
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace whitespace with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters and hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading and trailing hyphens
};

export const toastNotification = (message, type, duration = 1000) => {
  const toastNotification = document.createElement("div");
  toastNotification.classList.add(
    "toast-notification",
    "active",
    type,
    "transition",
    "shadow"
  );
  toastNotification.textContent = message;
  document.body.appendChild(toastNotification);
  setTimeout(() => {
    toastNotification.classList.remove("active");
    setTimeout(() => {
      toastNotification.remove();
    }, 250);
  }, duration);
};
