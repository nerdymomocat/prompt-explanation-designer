rangy.init();
import { getUniqueRandomColor } from './module_color.js'
import { wordDiff } from './module_diff.js'
import { create_viz } from './module_viz.js'

window.addEventListener('resize', () => {
  // Call create_viz to update the visualization when the screen width changes
  create_viz();
});


const visualization = document.getElementById('visualization');
const sidebar_content = document.getElementById('sidebar-content');

// Attach an event listener to the sidebar
sidebar_content.addEventListener('input', (event) => {
  // Check if the event target is an input element or one of its children
  if (event.target.matches('input, input *')) {
    // Perform your desired action
    visualization.style.display = 'none';
  }
});

function showModal(imageSrc) {
  const modal = document.getElementById('modal');
  const generatedImage = document.getElementById('generated-image');
  generatedImage.src = imageSrc;
  modal.style.display = 'block';
}

// Close the modal
function closeModal() {
  const modal = document.getElementById('modal');
  modal.style.display = 'none';
}

const hamburgerMenu = document.getElementById("hamburger-menu");
const dropdownMenu = document.getElementById("dropdown-menu");
const dropdownItems = document.querySelectorAll(".dropdown-item");
document.addEventListener("DOMContentLoaded", () => {
  const visualizeBtn = document.querySelector('.export-viz-btn');
  visualizeBtn.addEventListener("click", () => {
    visualization.style.display = 'block';
    create_viz();
  });

  const exportBtn = document.querySelector('.export-btn');
  const downloadBtn = document.getElementById('download-btn');
  const closeModalBtn = document.querySelector('.close');

  // Capture the container and show the image in the modal
  exportBtn.addEventListener('click', () => {
    const container = document.querySelector('.container');
    const desiredWidth = 1200;
    const desiredHeight = 675;
    const scaleFactor = Math.min(desiredWidth / container.offsetWidth, desiredHeight / container.offsetHeight);

    html2canvas(container, {
      scale: scaleFactor,
    }).then((canvas) => {
      const imageSrc = canvas.toDataURL('image/png');
      showModal(imageSrc);
    });
  });

  // Download the image when the download button is clicked
  downloadBtn.addEventListener('click', () => {
    const generatedImage = document.getElementById('generated-image');
    const link = document.createElement('a');
    link.href = generatedImage.src;
    link.download = 'explained-prompt.png';
    link.click();
  });

  // Close the modal when the close button or outside of the modal is clicked
  closeModalBtn.addEventListener('click', () => {
    closeModal();
  });

  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      closeModal();
    }
  });



  document.querySelector('.text-input').setAttribute('tabindex', '0');

  function editDropdownOptions() {
    const optionsModal = document.getElementById("optionsModal");

    // Show the modal.
    optionsModal.style.display = "block";

    // Load saved options or use defaults.
    let savedOptions = JSON.parse(localStorage.getItem("dropdownOptions"));
    if (!savedOptions) {
      savedOptions = ["", "Logical", "Spatial", "Material"];
    }

    // Ensure there is at least one empty option.
    if (!savedOptions.includes("")) {
      savedOptions.unshift("");
    }

    // Populate the textarea.
    const optionsTextarea = document.getElementById("optionsTextarea");
    optionsTextarea.value = savedOptions.join("\n");
  }
  document.getElementById("saveOptions").addEventListener("click", () => {
    const optionsTextarea = document.getElementById("optionsTextarea");
    const updatedOptions = optionsTextarea.value.split("\n").map(option => option.trim());

    // Save the updated options to localStorage.
    localStorage.setItem("dropdownOptions", JSON.stringify(updatedOptions));

    // Hide the modal.
    document.getElementById("optionsModal").style.display = "none";
  });

  document.getElementById("closeModal").addEventListener("click", () => {
    // Hide the modal without saving changes.
    document.getElementById("optionsModal").style.display = "none";
  });

  // Event listener for clicking outside the modal.
  document.getElementById("optionsModal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      // Trigger the saveOptions click event to save and close the modal.
      document.getElementById("saveOptions").click();
    }
  });

  // Event listener for the settings button.
  document.querySelector(".settings-button").addEventListener("click", () => {
    editDropdownOptions();
  });


  const applyColorWithRanges = (color, ranges) => {
    const className = `color-highlight-${color.replace("#", "").toLowerCase()}`;
    const style = document.createElement("style");
    style.textContent = `
    .${className} {
      background-color: ${color};
      border-radius: 3px;
      padding: 1px 1px;
    }
  `;
    document.head.appendChild(style);

    const classApplier = rangy.createClassApplier(className, { normalize: true });

    ranges.forEach((range) => {
      // Remove the temporary highlight
      tempHighlightClassApplier.undoToRange(range);

      // Apply the new color highlight
      classApplier.toggleRange(range);
    });

    // Update the sidebar with color indexes
    updateSidebar(color);
  };

  const textInput = document.querySelector(".text-input");

  let selectedRanges = [];
  let isCmdKeyDown = false;

  // Create a temporary highlight class
  const tempHighlightClassName = "temp-highlight";
  const tempHighlightStyle = document.createElement("style");
  tempHighlightStyle.textContent = `.${tempHighlightClassName} { background-color: rgba(0, 0, 0, 0.1); }`;
  document.head.appendChild(tempHighlightStyle);
  const tempHighlightClassApplier = rangy.createClassApplier(tempHighlightClassName, { normalize: true });

  const showColorPopup = (event) => {
    if (document.querySelector(".color-popup")) {
      return;
    }
    const popup = document.createElement("div");
    popup.classList.add("color-popup");
    popup.style.top = `${event.pageY}px`;
    popup.style.left = `${event.pageX}px`;

    const colorInputWrapper = document.createElement("div");
    colorInputWrapper.classList.add("color-input-wrapper");
    popup.appendChild(colorInputWrapper);

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.classList.add("color-input");
    colorInputWrapper.appendChild(colorInput);



    // Create the color options
    const colors = ["#E8DFF5", "#BED6DC", "#F3E2CE", "#F4EADE", "#D9DECB", "#FCE8E1", "#B2DCF3"];
    colors.forEach((color) => {
      const colorOption = document.createElement("button");
      colorOption.classList.add("color-option");
      colorOption.style.backgroundColor = color;
      colorOption.addEventListener("click", () => applyColor(color));
      popup.appendChild(colorOption);
    });
    const colorOptionStyle = document.createElement("style");
    colorOptionStyle.textContent = `
  .color-popup {
    display: flex;
    flex-wrap: wrap;
    gap: 5px; /* Add space between the color options */
    padding: 5px;
  }
  .color-option {
    width: 20px; /* Set the width of the color option circle */
    height: 20px; /* Set the height of the color option circle */
    border-radius: 50%; /* Make the color option a circle */
    border: none; 
    cursor: pointer; /* Change the cursor to a pointer when hovering over the color option */
    outline: none; /* Remove the default focus outline */
    margin: 5px; /* Add space between the color options */
  }
  .color-option:hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); /* Add a subtle shadow when hovering over the color option */
  }
`;
    document.head.appendChild(colorOptionStyle);

    // Add a strikethrough option
    const strikethroughOption = document.createElement("button");
    strikethroughOption.classList.add("strikethrough-option");
    strikethroughOption.addEventListener("click", () => applyStrikethrough(selectedRanges));

const strikethroughIcon = document.createElement('i');
strikethroughIcon.classList.add('fas', 'fa-strikethrough', 'icon', 'line-color','fa-2x');

strikethroughOption.appendChild(strikethroughIcon);
popup.appendChild(strikethroughOption);

    const strikethroughOptionStyle = document.createElement("style");
    strikethroughOptionStyle.textContent = `
  .strikethrough-option {
    background: none;
    border: none;
    position: relative;
    font-size: 12px;
    padding: 0;
    cursor: pointer;
  }
  .icon {
    width: 20px;
    height: 20px;
  }
    .strikethrough-option:hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1); /* Add a subtle shadow when hovering over the color option */
  }
`;

    document.head.appendChild(strikethroughOptionStyle);
    document.body.appendChild(popup);

    colorInput.addEventListener("change", () => applyColor(colorInput.value));

    const handleClose = () => {
      handleColorPopupClosing();
      document.removeEventListener("mousedown", handleClickOutside);
    };

    const handleClickOutside = (e) => {
      if (!popup.contains(e.target)) {
        handleClose();
      }
    };

    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
  };

  const applyColor = (color) => {
    const className = `color-highlight-${color.replace("#", "").toLowerCase()}`;
    const style = document.createElement("style");
    style.textContent = `
    .${className} {
      background-color: ${color};
      border-radius: 3px;
      padding: 1px 1px;
    }
  `;
    document.head.appendChild(style);

    const classApplier = rangy.createClassApplier(className, { normalize: true });

    selectedRanges.forEach((range) => {
      // Remove the temporary highlight
      tempHighlightClassApplier.undoToRange(range);

      // Apply the new color highlight
      classApplier.toggleRange(range);
    });

    // Update the sidebar with color indexes
    updateSidebar(color);

    // Clear the selectedRanges array and close the color popup
    selectedRanges = [];
    handleColorPopupClosing();
  };

  const closeColorPopup = () => {
    document.querySelectorAll(".color-popup").forEach((popup) => popup.remove());
  };

  // Add a new function to handle color popup closing
  const handleColorPopupClosing = () => {
    closeColorPopup();

    // Remove temporary highlights
    selectedRanges.forEach((range) => {
      tempHighlightClassApplier.undoToRange(range);
    });

    // Clear the selected ranges
    selectedRanges = [];
  };

  textInput.addEventListener("keydown", (event) => {
    if (event.key === "Meta" || event.key === "Control") {
      isCmdKeyDown = true;
    }
  });

  textInput.addEventListener("keyup", (event) => {
    if (event.key === "Meta" || event.key === "Control") {
      isCmdKeyDown = false;
      if (selectedRanges.length) {
        showColorPopup(event);
      }
    }
  });

  textInput.addEventListener("mouseup", (event) => {
    const selection = rangy.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        selectedRanges.push(range);
        tempHighlightClassApplier.toggleRange(range);
        selection.removeAllRanges();

        if (selectedRanges.length === 1 || isCmdKeyDown) {
          showColorPopup(event);
        }
      }
    }
  });

  const strikethroughClassName = "strikethrough";
  const strikethroughStyle = document.createElement("style");
  strikethroughStyle.textContent = `.${strikethroughClassName} { text-decoration: line-through; }`;
  document.head.appendChild(strikethroughStyle);
  const strikethroughClassApplier = rangy.createClassApplier(strikethroughClassName, { normalize: true });

});

// const addHorizontalLineButton = document.getElementById("add-horizontal-line");
// addHorizontalLineButton.addEventListener("click", addHorizontalLine);

// Function to update the sidebar with color indexes
function updateSidebar(color, isStrikethrough = false) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("item-wrapper");
  wrapper.id = `item-${Date.now()}`;
  const sidebar = document.querySelector(".sidebar");
  const colorIndexId = `color-index-${color.replace("#", "").toLowerCase()}`;

  if (!document.getElementById(colorIndexId)) {
    const colorIndexContainer = document.createElement("div");
    colorIndexContainer.id = colorIndexId;
    colorIndexContainer.classList.add("color-index-container");
    colorIndexContainer.style.display = "flex";
    colorIndexContainer.style.alignItems = "center";

    const colorBox = document.createElement("span");
    colorBox.style.backgroundColor = color;

    if (isStrikethrough) {
      colorBox.classList.add("strikethrough-color-index");
    } else {
      colorBox.classList.add("color-box");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    deleteButton.classList.add("delete-button", `delete-button-${color.replace("#", "").toLowerCase()}`);
    deleteButton.style.visibility = "hidden";
    deleteButton.onclick = () => {
      deleteColor(color, isStrikethrough);

      if (isStrikethrough) {
        const className = `strikethrough-${color.replace("#", "").toLowerCase()}`;
        const classApplier = rangy.createClassApplier(className, { normalize: true });
        removeStrikethroughStyle(className);
      }
    };

    const addButton = document.createElement("button");
    addButton.textContent = "+";
    addButton.classList.add("add-description-button");
    addButton.classList.add("button-hidden-style");
    addButton.style.visibility = "hidden";

    // Add styles for the button

    function createDescriptionInput() {
      const inputWrapper = document.createElement("div");
      inputWrapper.classList.add("input-wrapper");
      inputWrapper.style.display = "flex";
      inputWrapper.style.alignItems = "center";

      const deleteInputButton = document.createElement("button");
      deleteInputButton.textContent = "x";
      deleteInputButton.classList.add("delete-input-button");
      deleteInputButton.style.visibility = "hidden";

      deleteInputButton.onclick = () => {
        inputWrapper.remove();
        updateDeleteInputButtons();
      };

      inputWrapper.onmouseover = () => {
        if (descriptionInputsContainer.children.length > 1) {
          deleteInputButton.style.visibility = "visible";
        }
      };

      inputWrapper.onmouseout = () => {
        deleteInputButton.style.visibility = "hidden";
      };

      function initDropdown() {
        let dropdownOptions = JSON.parse(localStorage.getItem('dropdownOptions'));

        if (!dropdownOptions) {
          dropdownOptions = ["", "Logical", "Spatial", "Material"];
          localStorage.setItem('dropdownOptions', JSON.stringify(dropdownOptions));
        }

        return dropdownOptions;
      }


      function updateDropdown(dropdownOptions) {
        const dropdown = document.createElement("select");
        dropdown.classList.add("description-dropdown");

        dropdownOptions.forEach((optionText) => {
          const option = document.createElement("option");
          option.value = optionText;
          option.text = optionText;
          dropdown.add(option);
        });

        return dropdown;
      }



      const dropdownOptions = initDropdown();
      const dropdown = updateDropdown(dropdownOptions);

      // Add more options as needed

      const descriptionInputBox = document.createElement("input");
      descriptionInputBox.type = "text";
      descriptionInputBox.placeholder = "Add description";
      descriptionInputBox.classList.add("color-description-input");

      inputWrapper.appendChild(deleteInputButton);
      inputWrapper.appendChild(dropdown);
      inputWrapper.appendChild(descriptionInputBox);

      return inputWrapper;
    }


    function updateDeleteInputButtons() {
      const inputWrappers = descriptionInputsContainer.querySelectorAll(".color-description-input").length;
      const deleteButtons = descriptionInputsContainer.querySelectorAll(".delete-input-button");

      if (inputWrappers > 1) {
        deleteButtons.forEach((button) => {
          button.style.visibility = "visible";
        });
      } else {
        deleteButtons.forEach((button) => {
          button.style.visibility = "hidden";
        });
      }
    }

    function addDescriptionInput(event) {
      event.preventDefault();
      const newDescriptionInput = createDescriptionInput();
      descriptionInputsContainer.appendChild(newDescriptionInput);
    }

    addButton.addEventListener("click", addDescriptionInput);

    const descriptionInputsContainer = document.createElement("div");
    descriptionInputsContainer.classList.add("description-inputs-container");
    descriptionInputsContainer.style.display = "flex";
    descriptionInputsContainer.style.flexDirection = "column";
    descriptionInputsContainer.style.alignItems = "flex-start";

    const initialDescriptionInput = createDescriptionInput();
    descriptionInputsContainer.appendChild(initialDescriptionInput);

    updateDeleteInputButtons();

    wrapper.setAttribute("draggable", "true");
    wrapper.addEventListener("dragstart", onDragStart);
    wrapper.addEventListener("dragover", onDragOver);
    wrapper.addEventListener("drop", onDrop);



    colorIndexContainer.appendChild(colorBox);
    colorIndexContainer.appendChild(deleteButton);
    colorIndexContainer.appendChild(addButton);
    colorIndexContainer.appendChild(descriptionInputsContainer);

    wrapper.appendChild(colorIndexContainer);
    const itemContainer = document.querySelector(".item-container");
    itemContainer.appendChild(wrapper);

    function handleMouseOver() {
      deleteButton.style.visibility = "visible";
      addButton.style.visibility = "visible";

      const inputWrappers = descriptionInputsContainer.querySelectorAll(".input-wrapper");
      if (inputWrappers.length > 1) {
        inputWrappers.forEach((inputWrapper) => {
          const deleteInputButton = inputWrapper.querySelector(".delete-input-button");
          deleteInputButton.style.visibility = "visible";
        });
      }
    }

    function handleMouseOut() {
      deleteButton.style.visibility = "hidden";
      addButton.style.visibility = "hidden";

      const inputWrappers = descriptionInputsContainer.querySelectorAll(".input-wrapper");
      inputWrappers.forEach((inputWrapper) => {
        const deleteInputButton = inputWrapper.querySelector(".delete-input-button");
        deleteInputButton.style.visibility = "hidden";
      });
    }

    wrapper.addEventListener("mouseover", handleMouseOver);
    wrapper.addEventListener("mouseout", handleMouseOut);
  }
  updatePlaceholderVisibility();
}

