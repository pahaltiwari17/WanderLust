(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

window.closeModal = function () {
  document.getElementById("welcomeModal").style.display = "none";
}

window.addEventListener("load", () => {
  const modal = document.getElementById("welcomeModal");

  if (!modal) return;

  const isHomePage = 
  window.location.pathname === "/listings" && window.location.search === "";

  if (isHomePage) {
    setTimeout(() => {
      modal.style.display = "flex";
    }, 300)
  }
});