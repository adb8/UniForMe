function message(text) {
    const element_html = `<div class="alert-cont"><div>${text}</div></div>`;
    const container = document.querySelector(".cont");
    container.insertAdjacentHTML("afterbegin", element_html);
    setTimeout(function () {
        const alert_elements = container.querySelectorAll(".alert-cont");
        const remove_alert = alert_elements[alert_elements.length - 1]
        if (remove_alert) {
            remove_alert.remove();
        }
    }, 4000);
}

window.message = message;
