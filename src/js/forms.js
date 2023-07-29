import { convertToSlug } from "./utils.js";
import { toastNotification } from "./utils.js";
import { responseAction } from "./actions.js";

const forms = document.querySelectorAll("form.handle-form-submission");

forms.forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Metadata
    const method = form.dataset.method.toLowerCase();
    const name = form.name;
    const action = form.action;
    const notification = form.dataset.notification;

    /* ====================================================== */

    /* "Middleware" */

    // Update textarea values with TinyMCE content
    updateTextareaValues(form);

    // Update slugs
    updateSlugs(form);

    /* ====================================================== */

    // Create form object
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const promises = [];

    handleFileUploads(form, method, action, name, formObject, promises);

    Promise.all(promises)
      .then(async () => {
        const body = JSON.stringify(formObject);
        const res = await fetch(action, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body,
        });
        const data = await res.json();
        console.log(data);

        /* ====================================================== */

        /* Responses */

        if (data.success) {
          // Flash Message
          const methodMessages = {
            post: "created",
            put: "updated",
            delete: "deleted",
          };

          toastNotification(
            `${notification} ${
              methodMessages[method.toLowerCase()]
            } successfully`,
            "success"
          );

          responseAction(
            name,
            e.submitter.dataset.responseAction || method,
            data
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

// Update textarea values with TinyMCE content
const updateTextareaValues = (form) => {
  const textareas = form.querySelectorAll("textarea");
  textareas.forEach((textarea) => {
    const editor = tinymce.get(textarea.id);
    if (editor) {
      textarea.value = editor.getContent();
    }
  });
};

// Convert titles to slugs and update slug values
const updateSlugs = (form) => {
  const slug = form.querySelector('input[name="slug"]');
  if (slug) {
    const title = form.querySelector(
      'input[role="slug-source"], input[name="title"], textarea[role="slug-source"], textarea[name="title"]'
    );
    slug.value = convertToSlug(title.value);
  }
};

// File upload
const uploadFile = async (fileInput, formObject, alt) => {
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/upload", {
    method: "post",
    body: formData,
  });
  const data = await res.json();
  formObject.file = data.file;
  formObject.file.alt = alt.value;
};

const persistFile = async (endpoint, formObject, nestedProperty, alt) => {
  const res = await fetch(endpoint, {
    method: "GET",
  });
  const data = await res.json();
  const body = JSON.parse(accessNestedProperty(data, nestedProperty));
  formObject.file = body.file;
  formObject.file.alt = alt.value;
};

const handleFileUploads = (
  form,
  method,
  action,
  name,
  formObject,
  promises
) => {
  const fileInputs = form.querySelectorAll('input[type="file"]');

  for (const fileInput of fileInputs) {
    const alt = document.querySelector(`[name="${fileInput.name}-alt"]`);
    if (method == "post") {
      // upload file
      if (fileInput.files.length > 0) {
        promises.push(uploadFile(fileInput, formObject, alt));
      } else {
        alert("Please upload a file");
        return;
      }
    } else if (method == "put") {
      if (fileInput.files.length > 0) {
        promises.push(uploadFile(fileInput, formObject, alt));
      } else {
        // No changes were made to the file input
        promises.push(persistFile(action, formObject, ["doc", "body"], alt));
      }
    }
  }
};

function accessNestedProperty(object, keys) {
  return keys.reduce((nestedObj, key) => {
    if (nestedObj && nestedObj.hasOwnProperty(key)) {
      return nestedObj[key];
    }
    return undefined;
  }, object);
}
