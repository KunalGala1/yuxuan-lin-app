export const responseAction = (name, method, data) => {
  const actions = {
    events: {
      post: () => {
        window.location.replace(`/dashboard/events/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace("/dashboard/events/new");
      },
    },
    works: {
      post: () => {
        window.location.replace(`/dashboard/works/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace("/dashboard/works/new");
      },
    },
    arrangements: {
      post: () => {
        window.location.replace(
          `/dashboard/arrangements/${data.newDoc._id}/edit`
        );
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace("/dashboard/arrangements/new");
      },
    },
    media: {
      post: () => {
        window.location.replace(`/dashboard/media/${data.newDoc._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-id="${data.deletedDoc._id}"]`).remove();
      },
      save_and_add_new: () => {
        window.location.replace("/dashboard/media/new");
      },
    },
  };

  if (actions[name] && actions[name][method]) {
    actions[name][method]();
  } else {
    // Default action or error handling
  }
};
