document.addEventListener("DOMContentLoaded", () => {


  const accordionHeadings = document.querySelectorAll(".accordion-heading");
  const accordionContents = document.querySelectorAll(".accordion-content");

  accordionHeadings.forEach((heading) => {
    heading.addEventListener("click", () => {
      const target = heading.getAttribute("id").replace("-header", "");

      accordionHeadings.forEach((otherHeading) => {
        if (otherHeading === heading) {
          otherHeading.classList.add("active");
        } else {
          otherHeading.classList.remove("active");
        }
      });

      accordionContents.forEach((content) => {
        if (content.getAttribute("id") === target) {
          content.classList.add("active");
          content.classList.add("visible"); // Add the 'visible' class
        } else {
          content.classList.remove("active");
          content.classList.remove("visible"); // Remove the 'visible' class
        }
      });
    });
  });


  const hamburgerMenu = document.getElementById("hamburger-menu");
  const dropdownMenu = document.getElementById("dropdown-menu");
  const dropdownItems = document.querySelectorAll(".dropdown-item");

  hamburgerMenu.addEventListener("click", () => {
    dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
  });

  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      event.stopPropagation();
      const target = item.getAttribute("data-target");

      // Remove the 'active' class from all dropdown items
      dropdownItems.forEach((i) => i.classList.remove('current'));

      // Add the 'active' class to the clicked item
      item.classList.add('current');

      document.getElementById(target).click();
      dropdownMenu.style.display = "none";
    });
  });


  // Add an event listener for the keydown event on the document
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdownMenu.style.display = "none";
    }
  });
});