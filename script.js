document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("travelForm");
    const modal = document.getElementById("n8nModal");
    const modalBody = document.getElementById("n8nModalBody");
    const modalClose = document.getElementById("n8nModalClose");
    const submitBtn = form.querySelector(".submit-btn");

    const showModal = (content) => {
        modalBody.textContent = content;
        modal.classList.remove("hidden");
        modal.setAttribute("aria-hidden", "false");
    };

    const hideModal = () => {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
    };

    modalClose.addEventListener("click", hideModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Basic front-end validation using HTML5 required attributes
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Planning your trip...";

        try {
            const formData = new FormData(form);
            const payload = {};

            formData.forEach((value, key) => {
                payload[key] = value;
            });

            const response = await fetch(form.action, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const contentType = response.headers.get("content-type") || "";
            let text;

            if (contentType.includes("application/json")) {
                const json = await response.json();
                text = JSON.stringify(json, null, 2);
            } else {
                text = await response.text();
            }

            const display = `Status: ${response.status} ${response.statusText}\n\n${text}`;
            showModal(display);
        } catch (err) {
            showModal(`There was an error contacting the itinerary service:\n\n${err.message || err}`);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
});

