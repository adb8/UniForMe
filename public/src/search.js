const input = document.querySelector(".college-search-input");
const save_button = document.querySelector(".college-save-button");
const remove_button = document.querySelector(".college-remove-button");

save_button.onclick = () => {
  if (window.waiting_for_response) {
    console.log("Rate limited");
    return;
  }
  window.waiting_for_response = true;
  const college_query = input.value.toLowerCase();
  fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      college_query: college_query,
    }),
  })
    .then((response) => response.json())
    .then((success) => {
      window.waiting_for_response = false;
      if (success) {
        input.value = "";
        message("College was saved to your list");
      } else {
        message("College not found, please check your spelling");
      }
    });
};

remove_button.onclick = () => {
  if (window.waiting_for_response) {
    console.log("Rate limited");
    return;
  }
  window.waiting_for_response = true;
  const college_query = input.value.toLowerCase();
  fetch("/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      college_query: college_query,
    }),
  })
    .then((response) => response.json())
    .then((success) => {
      window.waiting_for_response = false;
      if (success) {
        input.value = "";
        message("College was removed from your list");
      } else {
        message("College is not saved to your list");
      }
    });
};
