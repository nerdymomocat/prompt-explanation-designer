import { TextInputsCompareNew, ExplainedTextInput, ExplainedPromptExplainedGen} from './components.js';

document.addEventListener("DOMContentLoaded", () => {

  const textInputsCompareNewInstance = new TextInputsCompareNew({
    textInput1ContainerId: 't1-text-input-1',
    textInput2ContainerId: 't1-text-input-2',
    explainedTextInputContainerId: 't1-explained-text-input',
    explainedTextInputSidebarContainerId: 't1-explained-text-input-sidebar',
    explainedTextInputSidebarContentId: 't1-explained-text-input-sidebar-content',
  });

  const explainedTextInputInstance = new ExplainedTextInput(
    {textInputId: 't2-explained-text-input'},
                                                            
                                                              {containerId: 't2-explained-text-input-sidebar',
      sidebarContentId: 't2-explained-text-input-sidebar-content'
    });

    const explainedTextInputInstance2b1 = new ExplainedTextInput(
    {textInputId: 't2b-explained-text-input-1'},
                                                            
                                                              {containerId: 't2b-explained-text-input-sidebar-1',
      sidebarContentId: 't2b-explained-text-input-sidebar-content-1'
    });

    const explainedTextInputInstance2b2 = new ExplainedTextInput(
    {textInputId: 't2b-explained-text-input-2'},
                                                            
                                                              {containerId: 't2b-explained-text-input-sidebar-2',
      sidebarContentId: 't2b-explained-text-input-sidebar-content-2'
    });

  // const explainedPromptExplainedGenInstance31 = new ExplainedPromptExplainedGen(
  //   {textInputId: 't3-explained-text-input-1'},
                                                            
  //                                                             {containerId: 't3-explained-text-input-sidebar-1',
  //     sidebarContentId: 't3-explained-text-input-sidebar-content-1'
  //   });

    document.getElementById('t1-text-inputs-compare-new-container').appendChild(textInputsCompareNewInstance.container);
  document.getElementById('t2-explained-text-input-container').appendChild(explainedTextInputInstance.textInputWrapper);

    document.getElementById('t2b-explained-text-input-container-1').appendChild(explainedTextInputInstance2b1.textInputWrapper);

      document.getElementById('t2b-explained-text-input-container-2').appendChild(explainedTextInputInstance2b2.textInputWrapper);

        // document.getElementById('t3-explained-prompt-explained-gen').appendChild(explainedPromptExplainedGenInstance31.textInputWrapper);




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


  // Set the first heading and content as active
  accordionHeadings[0].classList.add("active");
  accordionContents[0].classList.add("active");

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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdownMenu.style.display = "none";
    }
  });


  document.addEventListener('click', (event) => {
    if (!hamburgerMenu.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });


});
