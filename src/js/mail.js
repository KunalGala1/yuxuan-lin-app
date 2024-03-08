import { toastNotification } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll(".contact-form");
  const lang = document.documentElement.lang;

  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      // Made the event handler async
      e.preventDefault();

      const formData = new FormData(form);
      let formObject = {};

      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }

      const { name, email, subject } = formObject;

      // Regular expression for email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !subject) {
        toastNotification(
          `${
            lang === "zh"
              ? "所有必填字段必须填写完整"
              : "All required fields must be filled out"
          }`,
          "danger",
          5000
        );
        return false;
      } else if (!emailRegex.test(email)) {
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
      // If everything is filled out, send the POST request
      try {
        const response = await fetch("/mailsend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formObject),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        toastNotification(data.msg, "success", 5000);
        form.reset();
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        toastNotification(`Error: ${error.message}`, "danger", 5000);
      }
    });
  });
});
