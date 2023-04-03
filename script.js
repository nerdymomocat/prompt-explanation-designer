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


const textInput = document.querySelector('.text-input');


function updatePlaceholderVisibility() {
  const itemContainer = document.querySelector(".item-container");
  const placeholder = document.querySelector(".item-placeholder");

  // Check if the item container has any child elements other than the placeholder
  const hasItems = Array.from(itemContainer.children).some(child => child !== placeholder);

  // Show or hide the placeholder based on the presence of items
  placeholder.style.display = hasItems ? "none" : "block";
}

textInput.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevent the click event from bubbling up to the document
  textInput.classList.add('active');
});

// Remove the active class when clicking outside the text input

document.querySelector("#text-input").addEventListener("input", handleTextInputChange);


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
      const target = item.getAttribute("data-target");
      document.getElementById(target).click();
      dropdownMenu.style.display = "none";
    });
  });



  document.addEventListener('click', (event) => {
    if (!textInput.contains(event.target) && textInput.classList.contains('active')) {
      textInput.classList.remove('active');
    }
    if (!hamburgerMenu.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  // Add an event listener for the keydown event on the document
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      dropdownMenu.style.display = "none";
    }
  });

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

  function compareTextAreas() {
    console.log('compareTextAreas called'); // Debugging line

    const textArea1 = document.getElementById('text-area-1');
    const textArea2 = document.getElementById('text-area-2');
    const diffResults = document.getElementById('diff-results');
    const resultsContainer = document.getElementById('results-container'); // Add this line

    const diffs = wordDiff(textArea1.value, textArea2.value);

    console.log('Diffs:', diffs); // Debugging line

    const diffHTML = diffs
      .map(([op, text]) => {
        if (op === -1) return `<del>${text}</del>`;
        if (op === 1) return `<ins>${text}</ins>`;
        return text;
      })
      .join(' ');

    diffResults.innerHTML = diffHTML;
  }

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

  function removeAllItemsFromSidebar() {
    const deleteButtons = document.querySelectorAll(".delete-button, .horizontal-line-delete-button");

    deleteButtons.forEach((deleteButton) => {
      deleteButton.onclick();
    });
  }

  const copyToDesignerBtn = document.querySelector(".copy-to-designer-btn");

  copyToDesignerBtn.addEventListener("click", copyToDesigner);


  function copyToDesigner() {
    console.log('copyToDesigner called');
    removeAllItemsFromSidebar();

    // Get the input text
    const diffResults = document.getElementById('diff-results');
    const inputText = diffResults.innerHTML;

    // Create a temporary DOM element to parse the input text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = inputText;

    // Handle <del> elements
    const delElements = tempDiv.querySelectorAll("del");
    delElements.forEach((delElement) => {
      const selectedRange = rangy.createRange();
      selectedRange.selectNodeContents(delElement);
      applyStrikethrough([selectedRange]);
    });

    // Handle <ins> elements
    const insElements = tempDiv.querySelectorAll("ins");
    insElements.forEach((insElement) => {
      const selectedRange = rangy.createRange();
      selectedRange.selectNodeContents(insElement);
      const randomColor = getUniqueRandomColor();
      applyColorWithRanges(randomColor, [selectedRange]);
    });

    // Unwrap <del> elements
    delElements.forEach((delElement) => {
      const parent = delElement.parentNode;
      while (delElement.firstChild) {
        parent.insertBefore(delElement.firstChild, delElement);
      }
      parent.removeChild(delElement);
    });

    // Unwrap <ins> elements
    insElements.forEach((insElement) => {
      const parent = insElement.parentNode;
      while (insElement.firstChild) {
        parent.insertBefore(insElement.firstChild, insElement);
      }
      parent.removeChild(insElement);
    });

    // Add the formatted text to the text-input area in the next collapsible
    const outputTextArea = document.querySelector(".text-input");
    outputTextArea.innerHTML = tempDiv.innerHTML;
  }

  const compareButton = document.querySelector(".compare-btn");
  compareButton.addEventListener("click", compareTextAreas);


  const textInput = document.querySelector(".text-input");

  textInput.addEventListener('paste', function(e) {
    e.preventDefault(); // Prevent the default paste action

    var plainText = '';

    if (e.clipboardData && e.clipboardData.getData) {
      plainText = e.clipboardData.getData('text/plain');
    } else if (window.clipboardData && window.clipboardData.getData) {
      plainText = window.clipboardData.getData('Text');
    }

    document.execCommand('insertText', false, plainText);
  });

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

    const strikethroughIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    strikethroughIcon.classList.add("icon", "line-color");
    strikethroughIcon.setAttribute("width", "24");
    strikethroughIcon.setAttribute("height", "24");
    strikethroughIcon.setAttribute("viewBox", "0 0 24 24");
    strikethroughIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const sPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    sPath.setAttribute("d", "M18 7.5A4.49 4.49 0 0 0 13.5 3h-3.43A4.07 4.07 0 0 0 6 7.07h0a4.08 4.08 0 0 0 2.78 3.86l6.44 2.14A4.08 4.08 0 0 1 18 16.93h0A4.07 4.07 0 0 1 13.93 21H10.5A4.49 4.49 0 0 1 6 16.5");
    sPath.setAttribute("style", "fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:2");

    const linePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    linePath.setAttribute("d", "M3 12h18");
    linePath.setAttribute("style", "fill:none;stroke:#2ca9bc;stroke-linecap:round;stroke-linejoin:round;stroke-width:2");

    strikethroughIcon.appendChild(sPath);
    strikethroughIcon.appendChild(linePath);
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

  const applyStrikethrough = (selectedRanges) => {
    // Generate a unique random color for the strikethrough line
    const color = getUniqueRandomColor();

    // Create a new CSS class for the strikethrough effect
    const className = `strikethrough-${color.replace('#', '').toLowerCase()}`;
    const style = document.createElement('style');
    style.textContent = `
    .${className} {
      color: lightgrey;
      font-style: italic;
      text-decoration: line-through ${color} solid;
    }
  `;
    document.head.appendChild(style);

    const classApplier = rangy.createClassApplier(className, { normalize: true });

    selectedRanges.forEach((range) => {
      // Remove the temporary highlight
      tempHighlightClassApplier.undoToRange(range);

      // Apply the new strikethrough effect
      classApplier.toggleRange(range);
    });

    // Update the sidebar with the new strikethrough color index
    updateSidebar(color, true);

    // Clear the selectedRanges array and close the color popup
    selectedRanges = [];
    handleColorPopupClosing();
  };


});

const addHorizontalLine = () => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("item-wrapper");
  wrapper.id = `item-${Date.now()}`; // Assign a unique ID to the wrapper

  const lineContainer = document.createElement("div");
  lineContainer.classList.add("horizontal-line-container");

  // Set draggable attribute and add event listeners for drag and drop
  wrapper.setAttribute("draggable", "true");
  wrapper.setAttribute("data-type", "horizontal-line");
  wrapper.addEventListener("dragstart", onDragStart);
  wrapper.addEventListener("dragover", onDragOver);
  wrapper.addEventListener("drop", onDrop);

  const line = document.createElement("hr");
  line.classList.add("horizontal-line");

  // Add a delete button for the horizontal line
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "X";
  deleteButton.classList.add("delete-button", "horizontal-line-delete");
  deleteButton.style.visibility = 'hidden';
  deleteButton.onclick = () => wrapper.remove();

  // Assuming `wrapper` is the element that wraps the content and the delete button
  wrapper.addEventListener('mouseover', () => {
    deleteButton.style.visibility = 'visible';
  });

  wrapper.addEventListener('mouseout', () => {
    deleteButton.style.visibility = 'hidden';
  });


  const lineText = document.createElement("input");
  lineText.type = "text";
  lineText.placeholder = "Text";
  lineText.classList.add("horizontal-line-text");
  lineText.oninput = () => updateInputSize(lineText);
  lineText.onfocus = () => updateInputSize(lineText);

  // Add this line to update the input size initially
  updateInputSize(lineText);

  const extraWrapper = document.createElement("div");
  extraWrapper.style.position = "relative";

  lineContainer.appendChild(line);
  extraWrapper.appendChild(deleteButton);  // Add the delete button to the extra wrapper
  extraWrapper.appendChild(lineContainer); // Add the line container to the extra wrapper

  extraWrapper.appendChild(lineText); // Add the text box to the extra wrapper

  //extraWrapper.appendChild(createPlusButton());

  wrapper.appendChild(extraWrapper);
  // Append the horizontal line wrapper to the end of the item container
  const itemContainer = document.querySelector('.item-container');
  itemContainer.appendChild(wrapper);

};


// const addHorizontalLineButton = document.getElementById("add-horizontal-line");
// addHorizontalLineButton.addEventListener("click", addHorizontalLine);

document.querySelector('.plus-button').addEventListener('click', () => {
  addHorizontalLine();
});




const updateInputSize = (input) => {
  const temp = document.createElement("span");
  temp.style.visibility = "hidden";
  temp.style.whiteSpace = "pre";
  temp.style.font = getComputedStyle(input).font;
  temp.textContent = input.value || input.placeholder;
  document.body.appendChild(temp);
  input.style.width = `${temp.getBoundingClientRect().width + 2}px`; // Add 2px for a little extra space
  document.body.removeChild(temp);
};

function handleTextInputChange() {
  visualization.style.display = 'none';
  const textInput = document.querySelector("#text-input");
  const spans = textInput.querySelectorAll("span");
  const foundColors = new Set();

  spans.forEach((span) => {
    if (
      (span.classList.value.startsWith("color-highlight-") ||
        span.classList.value.startsWith("strikethrough-")) &&
      !span.textContent.trim()
    ) {
      const colorCode = span.classList.value.split("-").pop();
      const deleteButton = document.querySelector(`.delete-button-${colorCode}`);
      if (deleteButton) {
        deleteButton.click();
      }
    } else {
      const colorCode = span.classList.value.split("-").pop();
      foundColors.add(colorCode);
    }
  });

  const allDeleteButtons = document.querySelectorAll(".delete-button");
  allDeleteButtons.forEach((deleteButton) => {
    const colorCode = deleteButton.classList.value.split("-").pop();
    if (!foundColors.has(colorCode)) {
      deleteButton.click();
    }
  });
  updatePlaceholderVisibility();
}



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


function removeStrikethroughStyle(className) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((element) => {
    element.classList.remove(className);
  });
}

let draggedElement = null;

const onDragStart = (e) => {
  e.dataTransfer.setData("text/plain", e.currentTarget.id);
  e.dataTransfer.effectAllowed = "move";
};

const onDragOver = (e) => {
  e.preventDefault();
};

const onDrop = (e) => {
  e.preventDefault();
  const draggedId = e.dataTransfer.getData("text/plain");
  draggedElement = document.getElementById(draggedId);
  const dropTarget = e.target.closest(".item-wrapper");

  if (dropTarget && sidebar.contains(dropTarget) && draggedElement !== dropTarget) {
    const rect = dropTarget.getBoundingClientRect();
    const dropY = e.clientY;

    if (dropY < rect.top + rect.height / 2) {
      // Drop above the target element
      dropTarget.parentElement.insertBefore(draggedElement, dropTarget);
    } else {
      // Drop below the target element
      dropTarget.parentElement.insertBefore(draggedElement, dropTarget.nextSibling);
    }
  } else if (!dropTarget && sidebar.contains(e.target)) {
    // Drop at the end of the sidebar
    e.target.appendChild(draggedElement);
  }
};


const deleteColor = (color, isStrikethrough = false) => {
  const prefix = isStrikethrough ? 'strikethrough' : 'color-highlight';
  const className = `${prefix}-${color.replace("#", "").toLowerCase()}`;

  // Remove the colored highlights or strikethroughs from the text
  const highlightedElements = document.getElementsByClassName(className);

  while (highlightedElements.length > 0) {
    const element = highlightedElements[0];
    const parent = element.parentNode;

    // Replace the highlighted element with its original content
    parent.replaceChild(document.createTextNode(element.textContent), element);
  }

  // Remove the color index container from the sidebar
  const colorIndexId = `color-index-${color.replace("#", "").toLowerCase()}`;
  const colorIndexContainer = document.getElementById(colorIndexId);
  if (colorIndexContainer) {
    const itemWrapper = colorIndexContainer.closest('.item-wrapper');

    // Remove the item-wrapper div if it exists
    if (itemWrapper) {
      itemWrapper.remove();
    } else {
      // If the item-wrapper is not found, remove the color index container directly
      colorIndexContainer.remove();
    }
  }

  // Remove the CSS class from the document
  const style = Array.from(document.getElementsByTagName('style')).find(style => style.textContent.includes(`.${className}`));
  if (style) {
    style.remove();
  }
};

const sidebar = document.querySelector(".sidebar");
sidebar.addEventListener("dragover", onDragOver);
sidebar.addEventListener("drop", onDrop);
