import { toastNotification } from "./utils.js";

// Get the URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Check if the 'lang' parameter exists
let lang = urlParams.get("lang");

// If 'lang' is not present or is null, set it to 'en'
if (!lang) {
  lang = "en";
}

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const contactFormData = new FormData(event.target);

      // Form Validation
      let contactFormObject = {}; // convert to object
      for (let [key, value] of contactFormData.entries()) {
        contactFormObject[key] = value;
      }

      // Check if any field is empty
      const { name, email, subject } = contactFormObject;
      if (!name || !email || !subject) {
        toastNotification(
          `${lang === "zh" ? "请填写所有字段" : "Please fill in all fields"}`,
          "danger",
          5000
        );
        return false;
      }

      // Check validity of email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
      if (!emailRegex.test(email)) {
        toastNotification(
          `${
            lang === "zh"
              ? "请输入一个有效的电子邮件地址"
              : "Please enter a valid email address"
          }`,
          "danger",
          5000
        );
        return false;
      }

      // Check if Cloudflare turnstile was completed
      const cfTurnstileResponse = document.querySelector(
        "[name=cf-turnstile-response]"
      );
      if (!cfTurnstileResponse.value) {
        toastNotification(
          `${
            lang === "zh"
              ? "请完成 Cloudflare 验证"
              : "Please complete the Cloudflare verification"
          }`,
          "danger",
          5000
        );
        return false;
      }

      // Hit siteverify endpoint to consume turnstile token and check validity
      const response = await fetch("/verify-turnstile-token", {
        method: "POST",
        body: contactFormData,
      });
      const result = await response.json();
      if (!response.ok) {
        toastNotification(
          "There was an error sending your email. Please try again later.",
          "danger",
          5000
        );
      } else {
        toastNotification("Your email was sucessfully sent!", "success", 5000);
        contactForm.reset();
      }
    });
  }
});
