rangy.init();
import { getUniqueRandomColor, predefinedColors } from './module_color.js'
import { wordDiff } from './module_diff.js'
import { tab_create_viz } from './module_viz.js'
import { hideVisWhenSidebarIsUpdated, internalCompareButtonClick, convertInputToSidebar, getParentId,removeAllItemsFromSidebar} from './setup.js'

const savedOptionsCateg = ["", "Hypothetical", "Mathematics", "Causation"];


const activeTabNumber = () => {
  const accordionContents = document.querySelectorAll(".accordion-content");
  let activeAccordionContent;

  accordionContents.forEach((content) => {
    if (content.classList.contains("active")) {
      activeAccordionContent = content;
    }
  });
  let activeAccordionContentid = activeAccordionContent.getAttribute("id");
  const tabNumber = activeAccordionContentid.replace("tab", "");
  return tabNumber;
}

window.addEventListener('resize', () => {
  const tabNumber = activeTabNumber();
  const vizElementId = `tb${tabNumber}-visualization`;
  const visualization = document.getElementById(vizElementId);

  if (visualization.style.display !== 'none') {
    tab_create_viz(vizElementId, "tab" + tabNumber);
  }
});

function updatePlaceholderVisibility(containerid) {
  const sidebarcontainer = document.querySelector("#" + containerid)
  const itemContainer = sidebarcontainer.querySelector(".item-container");
  const placeholder = sidebarcontainer.querySelector(".item-placeholder");

  // Check if the item container has any child elements other than the placeholder
  const hasItems = Array.from(itemContainer.children).some(child => {
    return child !== placeholder && (child.querySelector(".color-index-container") || child.querySelector(".horizontal-line-container"));
  });

  // Show or hide the placeholder based on the presence of items
  placeholder.style.display = hasItems ? "none" : "block";
}


// Remove the active class when clicking outside the text input


function showModal(imageSrc) {
  const modal = document.getElementById('modalImg');
  const generatedImage = document.getElementById('generated-image');
  generatedImage.src = imageSrc;
  modal.style.display = 'block';
}

// Close the modal
function closeModal() {
  const modal = document.getElementById('modalImg');
  modal.style.display = 'none';
}

const hamburgerMenu = document.getElementById("hamburger-menu");
const dropdownMenu = document.getElementById("dropdown-menu");
document.addEventListener("DOMContentLoaded", () => {

  const sidebars = document.querySelectorAll(".sidebar");

  sidebars.forEach(sidebar => {
    sidebar.addEventListener("dragover", onDragOver);
    sidebar.addEventListener("drop", onDrop);
  });


  hideVisWhenSidebarIsUpdated();

  internalCompareButtonClick();


  function addVisualizeBtnListener(btnClass, vizId, tabName) {
    //console.log(btnClass, vizId, tabName);
    const visualizeBtn = document.querySelector(btnClass);
    visualizeBtn.addEventListener("click", () => {
      const visualization = document.getElementById(vizId);
      visualization.style.display = 'block';
      tab_create_viz(vizId, tabName);
    });
  }

  const visualizeBtnData = [
    { btnClass: '#tb2-export-viz-btn', vizId: 'tb2-visualization', tabName: 'tab2' },
    { btnClass: '#tb3-export-viz-btn', vizId: 'tb3-visualization', tabName: 'tab3' },
    { btnClass: '#tb4-export-viz-btn', vizId: 'tb4-visualization', tabName: 'tab4' },
  ];

  visualizeBtnData.forEach(data => addVisualizeBtnListener(data.btnClass, data.vizId, data.tabName));



  window.addEventListener("click", (event) => {
    const comparisonModal = document.querySelector("#comparisonModal");
    if (event.target === comparisonModal) {
      comparisonModal.style.display = "none";
    }
  });

  window.addEventListener("keydown", (event) => {
    const comparisonModal = document.querySelector("#comparisonModal");
    if (event.key === "Escape") {
      comparisonModal.style.display = "none";
    }
  });

  //HERE1

  const downloadBtn = document.getElementById('download-btn');
  const closeModalBtn = document.querySelector('.close');

  function setupExportButton(exportBtnSelector, containerSelector, desiredHeightFactor, elementsToHideSelectors) {
    const exportBtn = document.querySelector(exportBtnSelector);

    // Function to show or hide elements
    const setElementsVisibility = (selectors, visibility) => {
      selectors.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
          element.style.visibility = visibility;
        }
      });
    };

    // Capture the container and show the image in the modal
    exportBtn.addEventListener('click', () => {
      const container = document.querySelector(containerSelector);
      //console.log(container.getBoundingClientRect());
      const desiredWidth = 1200;
      const desiredHeight = 675 * desiredHeightFactor;
      const scaleFactor = Math.min(desiredWidth / container.offsetWidth, desiredHeight / container.offsetHeight);
      //console.log(container.offsetWidth, container.offsetHeight, scaleFactor);

      // Hide elements before capturing
      setElementsVisibility(elementsToHideSelectors, 'hidden');

      html2canvas(container, {
        scale: scaleFactor,
      }).then((canvas) => {
        const imageSrc = canvas.toDataURL('image/png');

        // Show elements again after capturing
        setElementsVisibility(elementsToHideSelectors, 'visible');

        showModal(imageSrc);
      });
    });
  }


  setupExportButton('#tb2-export-btn', '.tb2-container', 1, [['#tb2-compare-btn']]);
  setupExportButton('#tb3-export-btn', '.tb3-container', 2, ['#tb3-compare-btn', '#tb3-settings-button-gen', '#tb3-generate-button']);
  setupExportButton('#tb4-export-btn', '.tb4-container', 3, ['#tb4-compare-btn', '#tb4-settings-button-gen-1', '#tb4-generate-button-1', '#tb4-settings-button-gen-2', '#tb4-generate-button-2']);

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
    const modal = document.getElementById('modalImg');
    const comparisonModal = document.querySelector("#comparisonModal");
    // console.log(event, event.target, event.currentTarget);
    if (event.target === modal) {
      closeModal();
    }
    else if (event.target === comparisonModal) {
      comparisonModal.style.display = "none";
    }

  });




  function editDropdownOptions() {
    const optionsModal = document.getElementById("optionsModal");

    // Show the modal.
    optionsModal.style.display = "block";

    // Load saved options or use defaults.
    let savedOptions = JSON.parse(localStorage.getItem("dropdownOptions"));
    if (!savedOptions) {
      savedOptions = savedOptionsCateg;
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
  document.querySelectorAll(".settings-button").forEach(button => {
    button.addEventListener("click", () => {
      editDropdownOptions();
    });
  });


  function compareTextAreas() {
    //console.log('compareTextAreas called'); // Debugging line

    const textArea1 = document.getElementById('tb1-text-area-1');
    const textArea2 = document.getElementById('tb1-text-area-2');
    const diffResults = document.getElementById('tb1-diff-results');

    const diffs = wordDiff(textArea1.value, textArea2.value);

    //console.log('Diffs:', diffs); // Debugging line

    const diffHTML = diffs
      .map(([op, text]) => {
        if (op === -1) return `<del>${text}</del>`;
        if (op === 1) return `<ins>${text}</ins>`;
        return text;
      })
      .join(' ');

    diffResults.innerHTML = diffHTML;
  }

  const applyColorWithRanges = (color, ranges, sidebarcontainerid) => {
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
    updateSidebar(color, sidebarcontainerid);
  };


  const copyToDesignerBtn = document.querySelector("#tb1-copy-to-designer-btn");

  copyToDesignerBtn.addEventListener("click", copyToDesigner);


  function copyToDesigner() {
    //console.log('copyToDesigner called');
    const comparisonModal = document.querySelector("#comparisonModal");
    removeAllItemsFromSidebar(comparisonModal.dataset.sidebarContainerId);
    console.log(comparisonModal.dataset.sidebarContainerId);

    // Get the input text
    const diffResults = document.getElementById('tb1-diff-results');
    if (diffResults.textContent.trim() === '') {
      diffResults.setAttribute('data-placeholder', 'Comparison Output Will Appear Here');
    }
    const inputText = diffResults.innerHTML;

    // Create a temporary DOM element to parse the input text
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = inputText;

    // Handle <del> elements
    const delElements = tempDiv.querySelectorAll("del");
    delElements.forEach((delElement) => {
      const selectedRange = rangy.createRange();
      selectedRange.selectNodeContents(delElement);
      applyStrikethrough([selectedRange], comparisonModal.dataset.sidebarContainerId);
    });

    // Handle <ins> elements
    const insElements = tempDiv.querySelectorAll("ins");
    insElements.forEach((insElement) => {
      const selectedRange = rangy.createRange();
      selectedRange.selectNodeContents(insElement);
      const randomColor = getUniqueRandomColor(comparisonModal.dataset.sidebarContainerId);
      applyColorWithRanges(randomColor, [selectedRange], comparisonModal.dataset.sidebarContainerId);
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
    const outputTextArea = document.querySelector("#" + comparisonModal.dataset.relatedTextInput);
    outputTextArea.innerHTML = tempDiv.innerHTML;
    comparisonModal.style.display = "none";
  }

  const compareButton = document.querySelector("#tb1-compare-btn");
  compareButton.addEventListener("click", compareTextAreas);


  const textInputs = document.querySelectorAll('.text-input');

  textInputs.forEach(textInput => {
    textInput.addEventListener('click', (event) => {
      event.stopPropagation();
      textInput.classList.add('active');
    });

    textInput.addEventListener("mouseup", (event) => {
      //console.log("mouseup event here!")
      const selection = rangy.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          selectedRanges.push(range);
          tempHighlightClassApplier.toggleRange(range);
          selection.removeAllRanges();

          if (selectedRanges.length === 1) {
            showColorPopup(event, convertInputToSidebar(textInput.getAttribute("id")));
          }
        }
      }
    });
    
    textInput.addEventListener("touchend", (event) => {
      //console.log("mouseup event here!")
      const selection = rangy.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          selectedRanges.push(range);
          tempHighlightClassApplier.toggleRange(range);
          selection.removeAllRanges();

          if (selectedRanges.length === 1) {
            showColorPopup(event, convertInputToSidebar(textInput.getAttribute("id")));
          }
        }
      }
    });
  });

  document.addEventListener('click', (event) => {
    textInputs.forEach(textInput => {
      if (!textInput.contains(event.target) && textInput.classList.contains('active')) {
        textInput.classList.remove('active');
      }
    });
    if (!hamburgerMenu.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.style.display = "none";
    }
  });

  textInputs.forEach(textInput => {
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
  });

  let selectedRanges = [];
  //let isCmdKeyDown = false;

  // Create a temporary highlight class
  const tempHighlightClassName = "temp-highlight";
  const tempHighlightStyle = document.createElement("style");
  tempHighlightStyle.textContent = `.${tempHighlightClassName} { background-color: rgba(0, 0, 0, 0.1); }`;
  document.head.appendChild(tempHighlightStyle);
  const tempHighlightClassApplier = rangy.createClassApplier(tempHighlightClassName, { normalize: true });

  const showColorPopup = (event, sidebarid) => {
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

    predefinedColors.forEach((color) => {
      const colorOption = document.createElement("button");
      colorOption.classList.add("color-option");
      colorOption.style.backgroundColor = color;
      colorOption.addEventListener("click", () => applyColor(color, sidebarid));
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
    strikethroughOption.addEventListener("click", () => applyStrikethrough(selectedRanges, sidebarid));

    const strikethroughIcon = document.createElement('i');
    strikethroughIcon.classList.add('fas', 'fa-strikethrough', 'icon', 'line-color', 'fa-lg');

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
      display: flex;
  align-items: center;
  justify-content: center;
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

const collapseOption = document.createElement("button");
collapseOption.classList.add("collapse-option");
collapseOption.addEventListener("click", () => collapseSelectedText());
    const collapseOptionIcon = document.createElement('i');
    collapseOptionIcon.classList.add('fas', 'fa-ellipsis-h', 'icon', 'line-color', 'fa-lg');

    collapseOption.appendChild(collapseOptionIcon);

    const collapseOptionStyle = document.createElement("style");
collapseOptionStyle.textContent = `
  .collapse-option {
    background: none;
    border: none;
    position: relative;
    font-size: 12px;
    padding: 0;
    cursor: pointer;
  }
  .collapse-option:hover {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }
`;
document.head.appendChild(collapseOptionStyle);

    popup.appendChild(collapseOption);
    document.body.appendChild(popup);

    colorInput.addEventListener("change", () => applyColor(colorInput.value, sidebarid));

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

  const applyColor = (color, sidebarcontainerid) => {
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
    updateSidebar(color, sidebarcontainerid);

    // Clear the selectedRanges array and close the color popup
    selectedRanges = [];
    handleColorPopupClosing();
  };

const collapseSelectedText = () => {
  // 1. Decide a class name for collapsed content
  const collapsedContentClassName = "collapsed-content";
  const collapsibleContentClassName = "collapsible-content";

  // 2. Create a rangy class applier for the new class name
  const collapsedContentClassApplier = rangy.createClassApplier(collapsedContentClassName, { normalize: true });
  const collapsibleContentClassApplier = rangy.createClassApplier(collapsibleContentClassName, { normalize: true });

  // 3. Iterate through the selectedRanges array
  selectedRanges.forEach((range) => {
    // a. Remove the temporary highlight
    tempHighlightClassApplier.undoToRange(range);

    // b. Collapse the content into ellipses using the class applier
    const collapsedContent = document.createElement("span");
    collapsedContent.textContent = "...";
    collapsedContent.setAttribute("data-original-text", range.toString());
    collapsedContent.classList.add(collapsedContentClassName);
    collapsedContent.style.cursor = "pointer"; // Add hand pointer on hover

    // c. Apply a click event to the ellipses
    collapsedContent.addEventListener("click", function () {
      // Remove the applied class completely
      collapsedContentClassApplier.undoToRange(range);
      collapsibleContentClassApplier.undoToRange(range);

      // Fill the normal text in that class previously back into the text input
      range.deleteContents();
      range.insertNode(document.createTextNode(collapsedContent.getAttribute("data-original-text")));

      // Remove the collapsed content span including the ellipses
      collapsedContent.remove();
    });

    // Insert the collapsed content into the range
    range.deleteContents();
    range.insertNode(collapsedContent);
  });

  // 4. Clear the selectedRanges array and close the color popup
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




  const strikethroughClassName = "strikethrough";
  const strikethroughStyle = document.createElement("style");
  strikethroughStyle.textContent = `.${strikethroughClassName} { text-decoration: line-through; }`;
  document.head.appendChild(strikethroughStyle);
  const strikethroughClassApplier = rangy.createClassApplier(strikethroughClassName, { normalize: true });

  const applyStrikethrough = (selectedRanges, sidebarcontainerid) => {
    // Generate a unique random color for the strikethrough line
    const color = getUniqueRandomColor(sidebarcontainerid);

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
    updateSidebar(color, sidebarcontainerid, true);

    // Clear the selectedRanges array and close the color popup
    selectedRanges = [];
    handleColorPopupClosing();
  };
  function addButtonClickListener(buttonSelector, targetSidebar) {
    document.querySelector(buttonSelector).addEventListener('click', () => {
      addHorizontalLine(targetSidebar);
    });
  }

  addButtonClickListener('#tb2-plus-button', 'tb2-sidebar');
  addButtonClickListener('#tb3-plus-button-1', 'tb3-sidebar-1');
  addButtonClickListener('#tb3-plus-button-2', 'tb3-sidebar-2');
  addButtonClickListener('#tb4-plus-button-1', 'tb4-sidebar-1');
  addButtonClickListener('#tb4-plus-button-2', 'tb4-sidebar-2');
  addButtonClickListener('#tb4-plus-button-3', 'tb4-sidebar-3');


  function addInputEventListener(inputId, sidebarId, visualizationId) {
    document.getElementById(inputId).addEventListener("input", () => handleTextInputChange(inputId, sidebarId, visualizationId));
  }

  const inputElements = [
    { inputId: "tb2-text-input", sidebarId: "tb2-sidebar", visualizationId: "tb2-visualization" },
    { inputId: "tb3-text-input-1", sidebarId: "tb3-sidebar-1", visualizationId: "tb3-visualization" },
    { inputId: "tb3-text-input-2", sidebarId: "tb3-sidebar-2", visualizationId: "tb3-visualization" },
    { inputId: "tb4-text-input-1", sidebarId: "tb4-sidebar-1", visualizationId: "tb4-visualization" },
    { inputId: "tb4-text-input-2", sidebarId: "tb4-sidebar-2", visualizationId: "tb4-visualization" },
    { inputId: "tb4-text-input-3", sidebarId: "tb4-sidebar-3", visualizationId: "tb4-visualization" },
  ];

  inputElements.forEach(({ inputId, sidebarId, visualizationId }) => {
    addInputEventListener(inputId, sidebarId, visualizationId);
  });


});

const addHorizontalLine = (sidebarcontainerid) => {
  const sidebarcontainer = document.getElementById(sidebarcontainerid);
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
  const itemContainer = sidebarcontainer.querySelector('.item-container');
  itemContainer.appendChild(wrapper);

  updatePlaceholderVisibility(sidebarcontainerid);

};


// const addHorizontalLineButton = document.getElementById("add-horizontal-line");
// addHorizontalLineButton.addEventListener("click", addHorizontalLine);





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

function handleTextInputChange(textinputid, sidebarid, visualizationid) {
  //console.log(textinputid, sidebarid, visualizationid);
  const visualization = document.getElementById(visualizationid);
  visualization.style.display = 'none';

  const sidebar = document.getElementById(sidebarid);

  const textInput = document.getElementById(textinputid);
  const spans = textInput.querySelectorAll("span");
  //console.log(spans);
  const foundColors = new Set();

  spans.forEach((span) => {
    if (
      (span.classList.value.startsWith("color-highlight-") ||
        span.classList.value.startsWith("strikethrough-")) &&
      !span.textContent.trim()
    ) {
      const colorCode = span.classList.value.split("-").pop();
      const deleteButton = sidebar.querySelector(`.delete-button-${colorCode}:not(.horizontal-line-delete)`);
      if (deleteButton) {
        deleteButton.click();
      }
    } else {
      const colorCode = span.classList.value.split("-").pop();
      foundColors.add(colorCode);
    }
  });

  const allDeleteButtons = sidebar.querySelectorAll(".delete-button:not(.horizontal-line-delete)");
  allDeleteButtons.forEach((deleteButton) => {
    const colorCode = deleteButton.classList.value.split("-").pop();
    if (!foundColors.has(colorCode)) {
      deleteButton.click();
    }
  });
  updatePlaceholderVisibility(sidebarid);
  if (textInput.innerHTML === '<br>') {
    textInput.innerHTML = '';
  }
}

// Function to update the sidebar with color indexes
function updateSidebar(color, sidebarcontainerid, isStrikethrough = false) {
  const wrapper = document.createElement("div");
  const sidebarcontainer = document.getElementById(sidebarcontainerid);
  //console.log(sidebarcontainer);
  wrapper.classList.add("item-wrapper");
  wrapper.id = `item-${Date.now()}`;
  const colorIndexId = `color-index-${color.replace("#", "").toLowerCase()}`;

  if (!sidebarcontainer.querySelector("#" + colorIndexId)) {
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
      const pid = getParentId(sidebarcontainerid);
      deleteColor(color, pid, isStrikethrough);

      if (isStrikethrough) {
        const className = `strikethrough-${color.replace("#", "").toLowerCase()}`;
        const classApplier = rangy.createClassApplier(className, { normalize: true });
        removeStrikethroughStyle(className, pid);
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
    const itemContainer = sidebarcontainer.querySelector(".item-container");
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
  updatePlaceholderVisibility(sidebarcontainerid);
}

//LEAVING AT 4AM HERE!
function removeStrikethroughStyle(className, textinputsidebarid) {
  const textinputsidebaridcont = document.getElementById(textinputsidebarid);

  const elements = textinputsidebaridcont.querySelectorAll(`.${className}`);
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
  const sidebar = e.target.closest(".sidebar-content");

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


const deleteColor = (color, textinputsidebarid, isStrikethrough = false) => {

  const textinputsidebaridcont = document.getElementById(textinputsidebarid);


  const prefix = isStrikethrough ? 'strikethrough' : 'color-highlight';
  const className = `${prefix}-${color.replace("#", "").toLowerCase()}`;

  // Remove the colored highlights or strikethroughs from the text
  let highlightedElements = textinputsidebaridcont.querySelectorAll("." + className);

  //console.log(highlightedElements);

  while (highlightedElements.length > 0) {
    const element = highlightedElements[0];
    const parent = element.parentNode;
    // console.log("ELEMENT:",element);
    // console.log("PARENT:",parent);

    // Replace the highlighted element with its original content
    parent.replaceChild(document.createTextNode(element.textContent), element);
    highlightedElements = textinputsidebaridcont.querySelectorAll("." + className);
  }

  // Remove the color index container from the sidebar
  const colorIndexId = `color-index-${color.replace("#", "").toLowerCase()}`;
  const colorIndexContainer = textinputsidebaridcont.querySelector("#" + colorIndexId);
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


  //explain it
  //   This code is written in JavaScript and is used to remove a specific style element from the HTML document based on a given class name.

  // Here's a step-by-step explanation of the code:

  // 1. `document.getElementsByTagName('style')`: This line selects all the `<style>` elements in the HTML document.

  // 2. `Array.from(...)`: This line converts the collection of `<style>` elements into an array, which allows the use of array methods like `find()`.

  // 3. `.find(style => style.textContent.includes(`.${className}`))`: This line uses the `find()` method to search for a `<style>` element that contains the given `className` in its text content. The `.${className}` syntax is used to search for a class selector in the CSS code (e.g., `.my-class`). If a matching `<style>` element is found, it is assigned to the `style` variable; otherwise, `style` will be `undefined`.

  // 4. `if (style) { ... }`: This conditional statement checks if a matching `<style>` element was found.

  // 5. `style.remove();`: If a matching `<style>` element was found, this line removes it from the HTML document.

  // In summary, this code snippet searches for a `<style>` element containing a specific class name and removes it from the HTML document if found.
  const style = Array.from(textinputsidebaridcont.getElementsByTagName('style')).find(style => style.textContent.includes(`.${className}`));
  if (style) {
    style.remove();
  }
};
