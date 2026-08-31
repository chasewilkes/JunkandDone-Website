
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("estimate-form");
const result = document.getElementById("form-result");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);

    const body = [
      "JUNK & DONE ESTIMATE REQUEST",
      "",
      `Name: ${data.get("name") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `City / Area: ${data.get("area") || ""}`,
      "",
      `What needs to be removed: ${data.get("description") || ""}`,
      `Estimated amount: ${data.get("volume") || ""}`,
      `Access: ${data.get("access") || ""}`,
      `Stairs: ${data.get("stairs") || ""}`,
      `Heavy / awkward items: ${data.get("heavy") || ""}`,
      `Preferred timing: ${data.get("timing") || ""}`,
      "",
      `Additional notes: ${data.get("notes") || ""}`,
      "",
      "Photos: I will text photos separately to 404-859-7975.",
      "",
      "I understand this request is for a baseline estimate only and final pricing is confirmed on-site."
    ].join("\n");

    const subject = `Junk & Done Estimate Request - ${data.get("name") || "New Customer"}`;
    const mailto = `mailto:chasewilkes@junkanddone.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    result.hidden = false;
    result.innerHTML = `
      <strong>Your estimate request is ready.</strong><br>
      Your email app should open with the details filled in. After sending it, text your photos to
      <a href="sms:+14048597975">404-859-7975</a>.
      If nothing opens, email <a href="mailto:chasewilkes@junkanddone.com">chasewilkes@junkanddone.com</a>.
    `;

    window.location.href = mailto;
  });
}
