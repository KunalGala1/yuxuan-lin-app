// convert time to 12hr format
export function formatTime(timeString, lang) {
  const [hours, minutes] = timeString.split(":");
  let formattedTime;

  if (lang === "en") {
    const twelveHourFormat = (parseInt(hours) % 12 || 12).toString();
    formattedTime = `${twelveHourFormat}:${minutes} ${
      parseInt(hours) >= 12 ? "PM" : "AM"
    }`;
  } else if (lang === "zh") {
    const isPM = parseInt(hours) >= 12;
    const hourInChinese = (parseInt(hours) % 12 || 12).toString();
    formattedTime = `下午${hourInChinese}点${minutes}分`;
  } else {
    // Default to English if the provided language is not supported
    const twelveHourFormat = (parseInt(hours) % 12 || 12).toString();
    formattedTime = `${twelveHourFormat}:${minutes} ${
      parseInt(hours) >= 12 ? "PM" : "AM"
    }`;
  }

  return formattedTime;
}

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
  toastNotification.classList.add("toast-notification", "active", type);
  toastNotification.textContent = message;
  document.body.appendChild(toastNotification);
  setTimeout(() => {
    toastNotification.classList.remove("active");
    setTimeout(() => {
      toastNotification.remove();
    }, 250);
  }, duration);
};
