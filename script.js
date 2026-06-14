// Année dynamique dans le pied de page
document.getElementById("year").textContent = new Date().getFullYear();

// Menu mobile
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("nav-menu");

toggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

// Fermer le menu mobile après un clic sur un lien
menu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

// Formulaire de demande de maquette (démo front-end)
const form = document.getElementById("contact-form");
const message = document.getElementById("form-message");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  message.className = "form-message";

  const name = form.elements.name.value.trim();
  const email = form.elements.email.value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailValid) {
    message.textContent = "Merci d'indiquer le nom de votre commerce et un e-mail valide.";
    message.classList.add("error");
    return;
  }

  message.textContent = `Merci ${name} ! On prépare votre maquette et on vous écrit à ${email}.`;
  message.classList.add("success");
  form.reset();
});
