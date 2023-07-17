export const responseAction = (name, method, data) => {
  const actions = {
    event: {
      post: () => {
        window.location.replace(`/dashboard/events/${data.newDocument._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-event-id="${data.deletedDocument._id}"]`).remove();
      },
    },
    work: {
      post: () => {
        window.location.replace(`/dashboard/works/${data.newDocument._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-work-id="${data.deletedDocument._id}"]`).remove();
      },
    },
  };

  if (actions[name] && actions[name][method]) {
    actions[name][method]();
  } else {
    // Default action or error handling
  }
};
