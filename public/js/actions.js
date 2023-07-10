export const responseAction = (name, method, data) => {
  const actions = {
    event: {
      post: () => {
        window.location.replace(`/dashboard/events/${data.newEvent._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-event-id="${data.deletedEvent._id}"]`).remove();
      },
    },
    work: {
      post: () => {
        window.location.replace(`/dashboard/works/${data.newWork._id}/edit`);
      },
      delete: () => {
        document.querySelector(`[data-work-id="${data.deletedWork._id}"]`).remove();
      },
    },
  };

  if (actions[name] && actions[name][method]) {
    actions[name][method]();
  } else {
    // Default action or error handling
  }
};
