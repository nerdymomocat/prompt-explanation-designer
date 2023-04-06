rangy.init();

import { updatePlaceholderVisibility, wordDiff, getChatCompletion, editDropdownOptions } from './global_utilities.js';

const models = [
  { value: 'model1', label: 'Model 1' },
  { value: 'model2', label: 'Model 2' },
  // ...
];

function generateRandomColor() {
  let randomColor = '#';
  for (let i = 0; i < 6; i++) {
    randomColor += ('0' + Math.floor(Math.random() * 16).toString(16)).slice(-1);
  }
  return randomColor;
}

function getUniqueRandomColor() {
  let randomColor;
  let lightness;
  
  let lowerLightnessThreshold = 0.2;
  let upperLightnessThreshold = 0.9;
  do {
    randomColor = generateRandomColor();
    lightness = chroma(randomColor).get('hsl.l');
  } while (
    // this.isColorUsedInSidebar(randomColor) ||
    // this.isColorCloseToPredefinedColors(randomColor) ||
    lightness <= lowerLightnessThreshold ||
    lightness >= upperLightnessThreshold
  );
  return randomColor;
}

export class TextInput {
  constructor(options) {
    this.textInputWrapper = document.createElement('div');
    this.textInputWrapper.classList.add('text-input-wrapper');

    this.textInput = document.createElement('div');
    this.textInput.classList.add('text-input');
    this.textInput.id = options.textInputId;
    this.textInput.contentEditable = 'true';
    this.textInput.spellcheck = false;
    this.textInput.dataset.placeholder = 'Text Goes Here';

    this.textInputWrapper.appendChild(this.textInput);

    this.textInput.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the click event from bubbling up to the document
      this.textInput.classList.add('active');
    });

    this.textInput.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent the click event from bubbling up to the document
      this.textInput.classList.add('active');
    });

    this.textInput.addEventListener('paste', (e) => {
      e.preventDefault(); // Prevent the default paste action

      let plainText = '';

      if (e.clipboardData && e.clipboardData.getData) {
        plainText = e.clipboardData.getData('text/plain');
      } else if (window.clipboardData && window.clipboardData.getData) {
        plainText = window.clipboardData.getData('Text');
      }

      document.execCommand('insertText', false, plainText);
    });
  }
}

export class Sidebar {
  constructor(options) {
    console.log(options)
    this.container = document.getElementById(options.containerId);
       if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = options.containerId;
      this.container.classList.add('sidebar-container');
    }

    this.plusButtonContainer = document.createElement('div');
    this.plusButtonContainer.classList.add('plus-button-container');

    this.plusButton = document.createElement('button');
    this.plusButton.classList.add('plus-button');
    this.plusButton.textContent = '— + —';

    this.settingsButton = document.createElement('button');
    this.settingsButton.classList.add('settings-button');
    this.settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    this.settingsButton.addEventListener('click', () => {
      editDropdownOptions();
    });


    this.sidebarContent = document.createElement('div');
    this.sidebarContent.id = options.sidebarContentId;
    this.sidebarContent.classList.add('sidebar-content');

    this.itemContainer = document.createElement('div');
    this.itemContainer.classList.add('item-container');

    this.itemPlaceholder = document.createElement('span');
    this.itemPlaceholder.classList.add('item-placeholder');
    this.itemPlaceholder.textContent = 'Add a highlight or strikethrough to the text area to explain that text segment here.';

    this.plusButtonContainer.appendChild(this.plusButton);
    this.plusButtonContainer.appendChild(this.settingsButton);
    this.itemContainer.appendChild(this.itemPlaceholder);
    this.sidebarContent.appendChild(this.itemContainer);
    this.container.appendChild(this.plusButtonContainer);
    this.container.appendChild(this.sidebarContent);

    this.container.addEventListener("dragover", this.onDragOver);
    this.container.addEventListener("drop", this.onDrop);
    this.plusButton.addEventListener('click', () => {
      this.addHorizontalLine();
    });

    this.predefinedColors = ["#E8DFF5", "#BED6DC", "#F3E2CE", "#F4EADE", "#D9DECB", "#FCE8E1", "#B2DCF3"];
  }
  isColorCloseToPredefinedColors(color) {
    const deltaEThreshold = 5;

    for (let i = 0; i < this.predefinedColors.length; i++) {
      const deltaE = chroma.deltaE(color, this.predefinedColors[i], 2);
      if (deltaE < deltaEThreshold) {
        return true;
      }
    }

    return false;
  }
  isColorUsedInSidebar(color) {
    // Replace '.sidebar .color-item' with '.item-container .color-item'
    const colorItems = this.container.querySelectorAll('.item-container .color-item');
    let isUsed = false;
    const deltaEThreshold = 5;

    colorItems.forEach((item) => {
      const itemColor = item.style.backgroundColor;
      const deltaE = chroma.deltaE(color, itemColor, 2);
      if (deltaE < deltaEThreshold) {
        isUsed = true;
      }
    });

    return isUsed;
  }
  onDragStart(e) {
    e.dataTransfer.setData("text/plain", e.currentTarget.id);
    e.dataTransfer.effectAllowed = "move";
  }
  onDragOver(e) {
    e.preventDefault();
  }
  onDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(draggedId);
    const dropTarget = e.target.closest(".item-wrapper");

    if (dropTarget && this.container.contains(dropTarget) && draggedElement !== dropTarget) {
      const rect = dropTarget.getBoundingClientRect();
      const dropY = e.clientY;

      if (dropY < rect.top + rect.height / 2) {
        // Drop above the target element
        dropTarget.parentElement.insertBefore(draggedElement, dropTarget);
      } else {
        // Drop below the target element
        dropTarget.parentElement.insertBefore(draggedElement, dropTarget.nextSibling);
      }
    } else if (!dropTarget && this.container.contains(e.target)) {
      // Drop at the end of the sidebar
      e.target.appendChild(draggedElement);
    }
  }
  addHorizontalLine() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("item-wrapper");
    wrapper.id = `item-${Date.now()}`; // Assign a unique ID to the wrapper

    const lineContainer = document.createElement("div");
    lineContainer.classList.add("horizontal-line-container");

    // Set draggable attribute and add event listeners for drag and drop
    wrapper.setAttribute("draggable", "true");
    wrapper.setAttribute("data-type", "horizontal-line");
    wrapper.addEventListener("dragstart", this.onDragStart.bind(this));
    wrapper.addEventListener("dragover", this.onDragOver.bind(this));
    wrapper.addEventListener("drop", this.onDrop.bind(this));

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
    lineText.oninput = () => this.updateInputSize(lineText);
    lineText.onfocus = () => this.updateInputSize(lineText);

    // Add this line to update the input size initially
    this.updateInputSize(lineText);

    const extraWrapper = document.createElement("div");
    extraWrapper.style.position = "relative";

    lineContainer.appendChild(line);
    extraWrapper.appendChild(deleteButton);  // Add the delete button to the extra wrapper
    extraWrapper.appendChild(lineContainer); // Add the line container to the extra wrapper

    extraWrapper.appendChild(lineText); // Add the text box to the extra wrapper

    //extraWrapper.appendChild(createPlusButton());

    wrapper.appendChild(extraWrapper);
    // Append the horizontal line wrapper to the end of the item container
    this.itemContainer.appendChild(wrapper);

    updatePlaceholderVisibility(this.itemContainer, this.itemPlaceholder);
  }
  updateInputSize(input) {
    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.whiteSpace = "pre";
    temp.style.font = getComputedStyle(input).font;
    temp.textContent = input.value || input.placeholder;
    document.body.appendChild(temp);
    input.style.width = `${temp.getBoundingClientRect().width + 2}px`; // Add 2px for a little extra space
    document.body.removeChild(temp);
  }
}

export class TextInputGen extends TextInput {
  constructor(textInputOptions, inputComponent) {
    super(textInputOptions);

    this.inputComponent = inputComponent;

    this.generateButton = document.createElement('button');
    this.generateButton.textContent = 'Generate Output';
    this.generateButton.addEventListener('click', () => {
      // ...
    });

    this.dropdown = document.createElement('select');
    this.populateDropdown(models);

    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = 0.1;
    this.slider.max = 1.0;
    this.slider.step = 0.1;
    this.slider.value = 0.5;

    // Append elements to the container (textInputWrapper from TextInput class)
    this.textInputWrapper.appendChild(this.generateButton);
    this.textInputWrapper.appendChild(this.dropdown);
    this.textInputWrapper.appendChild(this.slider);

    this.generateButton.addEventListener('click', () => {
      this.handleGenerateButtonClick();
    });

    // Create the temperature button and value icon
    this.temperatureButton = document.createElement('button');
    this.temperatureButton.classList.add('temperature-button');
    this.temperatureButton.innerHTML = '<i class="fas fa-thermometer-half"></i>';

    this.temperatureValueIcon = document.createElement('span');
    this.temperatureValueIcon.classList.add('temperature-value');
    this.temperatureValueIcon.textContent = this.slider.value;

    this.temperatureButton.appendChild(this.temperatureValueIcon);

    // Create the temperature slider popup
    this.temperatureSliderPopup = document.createElement('div');
    this.temperatureSliderPopup.classList.add('temperature-slider-popup');
    this.temperatureSliderPopup.style.display = 'none';
    this.temperatureSliderPopup.appendChild(this.slider);

    // Append the temperature button and slider popup to the textInputWrapper
    this.textInputWrapper.appendChild(this.temperatureButton);
    this.textInputWrapper.appendChild(this.temperatureSliderPopup);

    // Initialize the temperature slider popup
    this.initializeTemperatureSliderPopup();

    // Create the settings button
    this.settingsButton = document.createElement('button');
    this.settingsButton.classList.add('settings-button-gen');
    this.settingsButton.innerHTML = '<i class="fas fa-cog"></i>';
    this.textInputWrapper.appendChild(this.settingsButton);

    // Initialize the settings modal
    this.initializeSettingsModal();
  }
  async handleGenerateButtonClick() {
    const apiKey = localStorage.getItem("apiKey");
    const modelName = this.dropdown.value;
    const prompt = this.inputComponent.textInput.innerText; // Use this.inputComponent.textInput for prompt
    const temperature = this.slider.value;
    const textInput3 = this.textInput; // Use this.textInput for textInput3
    const current_date = new Date().toLocaleDateString();
    let system_content;

    if (modelName === "gpt-4") {
      system_content = "You are GPT-4, a large language model trained by OpenAI. Answer as concisely as possible";
    } else {
      system_content = "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2021-09-01 Current date: " + current_date;
    }

    if (!apiKey) {
      alert("Please add the API key in settings.");
      return;
    }

    // Clear the text-input-3 and change the placeholder to "Loading..."
    textInput3.innerText = "";
    textInput3.setAttribute("data-placeholder", "Loading...");

    try {
      const assistantMessage = await getChatCompletion(apiKey, modelName, prompt, temperature, system_content);
      // Revert the placeholder and display the assistant's message
      textInput3.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
      textInput3.innerText = assistantMessage;
    } catch (error) {
      // Revert the placeholder and display an error message
      textInput3.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
      textInput3.innerText = "Error: " + error.message;
    }
  }
  populateDropdown(models) {
    models.forEach((model) => {
      const option = document.createElement('option');
      option.value = model.value;
      option.textContent = model.label;
      this.dropdown.appendChild(option);
    });
  }
  initializeTemperatureSliderPopup() {
    this.temperatureButton.addEventListener('click', (event) => {
      event.stopPropagation();
      this.temperatureSliderPopup.style.display = 'block';
    });

    this.slider.addEventListener('input', () => {
      this.temperatureValueIcon.textContent = this.slider.value;
    });

    document.addEventListener('click', (event) => {
      if (!this.temperatureSliderPopup.contains(event.target)) {
        this.temperatureSliderPopup.style.display = 'none';
      }
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.temperatureSliderPopup.style.display = 'none';
      }
    });
  }
  initializeSettingsModal() {
    const apiKey = localStorage.getItem("apiKey");
    const apiKeyTextbox = document.getElementById("textbox-gen");
    const textInput3 = this.textInput;

    if (apiKey) {
      apiKeyTextbox.value = apiKey;
      textInput3.setAttribute("data-placeholder", "Generation Appears Here");
    } else {
      textInput3.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
    }

    this.settingsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      document.getElementById("settingsModal-gen").style.display = "block";
    });

    document.getElementById("saveOptions-gen").addEventListener("click", () => {
      const apiKey = document.getElementById("textbox-gen").value;
      localStorage.setItem("apiKey", apiKey);
      document.getElementById("settingsModal-gen").style.display = "none";
    });

    document.getElementById("closeSettingsModal-gen").addEventListener("click", () => {
      document.getElementById("settingsModal-gen").style.display = "none";
    });

    document.getElementById("settingsModal-gen").addEventListener("click", (event) => {
      if (event.target === event.currentTarget) {
        document.getElementById("saveOptions-gen").click();
      }
    });

    window.addEventListener("keydown", (event) => {
      const settingsModal = document.getElementById("settingsModal-gen");
      if (event.key === "Escape") {
        settingsModal.style.display = "none";
      }
    });
  }
}

export class ExplainedTextInput extends TextInput {
  constructor(textInputOptions, sidebarOptions) {
    super(textInputOptions);
    console.log(sidebarOptions);
    // this.inputComponent = inputComponentOptions;
    this.sidebarComponent = new Sidebar(sidebarOptions);
    console.log(this)
    // Append elements to the container (textInputWrapper from TextInput class)
    this.textInputWrapper.appendChild(this.sidebarComponent.container);

    this.textInput.addEventListener('input', () => this.handleTextInputChange());
    this.textInput.addEventListener('mouseup', (event) => {
      const selection = rangy.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          this.applyColorPopup(event);
        }
      }
    });
  }

  handleTextInputChange() {
    //this.visualization.style.display = 'none';
    const spans = this.textInput.querySelectorAll("span");
    const foundColors = new Set();

    spans.forEach((span) => {
      if (
        (span.classList.value.startsWith("color-highlight-") ||
          span.classList.value.startsWith("strikethrough-")) &&
        !span.textContent.trim()
      ) {
        const colorCode = span.classList.value.split("-").pop();
        const deleteButton = this.textInputWrapper.querySelector(`.delete-button-${colorCode}:not(.horizontal-line-delete)`);
        if (deleteButton) {
          deleteButton.click();
        }
      } else {
        const colorCode = span.classList.value.split("-").pop();
        foundColors.add(colorCode);
      }
    });

    const allDeleteButtons = this.textInputWrapper.querySelectorAll(".delete-button:not(.horizontal-line-delete)");
    allDeleteButtons.forEach((deleteButton) => {
      const colorCode = deleteButton.classList.value.split("-").pop();
      if (!foundColors.has(colorCode)) {
        deleteButton.click();
      }
    });
    const sidebar = this.sidebarComponent.wrapper;
    const itemContainer = sidebar.querySelector(".item-container");
    const itemPlaceholder = sidebar.querySelector(".item-placeholder");
    updatePlaceholderVisibility(itemContainer, itemPlaceholder);
  }
  removeAllItemsFromSidebar() {
    const deleteButtons = this.textInputWrapper.querySelectorAll(".delete-button, .horizontal-line-delete-button");

    deleteButtons.forEach((deleteButton) => {
      deleteButton.onclick();
    });
  }
  deleteColor(color, isStrikethrough = false) {
    const prefix = isStrikethrough ? 'strikethrough' : 'color-highlight';
    const className = `${prefix}-${color.replace("#", "").toLowerCase()}`;

    const highlightedElements = this.textInput.getElementsByClassName(className);

    while (highlightedElements.length > 0) {
      const element = highlightedElements[0];
      const parent = element.parentNode;
      parent.replaceChild(document.createTextNode(element.textContent), element);
    }

    const colorIndexId = `color-index-${color.replace("#", "").toLowerCase()}`;
    const colorIndexContainer = this.sidebarComponent.wrapper.querySelector(`#${colorIndexId}`);
    if (colorIndexContainer) {
      const itemWrapper = colorIndexContainer.closest('.item-wrapper');

      if (itemWrapper) {
        itemWrapper.remove();
      } else {
        colorIndexContainer.remove();
      }
    }

    const style = Array.from(document.getElementsByTagName('style')).find(style => style.textContent.includes(`.${className}`));
    if (style) {
      style.remove();
    }
  }
  removeStrikethroughStyle(className) {
    const elements = this.textInput.querySelectorAll(`.${className}`);
    elements.forEach((element) => {
      element.classList.remove(className);
    });
  }
  applyStrikethrough(range) {
    const color = getUniqueRandomColor();
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

    // Apply the new strikethrough effect
    classApplier.toggleRange(range);

    // Update the sidebar with the new strikethrough color index
    this.updateSidebar(color, true);

    // Close the color popup
    this.handleColorPopupClosing();
  }
  updateSidebar(color, isStrikethrough = false) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("item-wrapper");
    wrapper.id = `item-${Date.now()}`;
    const sidebar = this.sidebarComponent.wrapper;
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
        this.deleteColor(color, isStrikethrough);

        if (isStrikethrough) {
          const className = `strikethrough-${color.replace("#", "").toLowerCase()}`;
          const classApplier = rangy.createClassApplier(className, { normalize: true });
          this.removeStrikethroughStyle(className);
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
      wrapper.addEventListener("dragstart", this.sidebarComponent.onDragStart);
      wrapper.addEventListener("dragover", this.sidebarComponent.onDragOver);
      wrapper.addEventListener("drop", this.sidebarComponent.onDrop);



      colorIndexContainer.appendChild(colorBox);
      colorIndexContainer.appendChild(deleteButton);
      colorIndexContainer.appendChild(addButton);
      colorIndexContainer.appendChild(descriptionInputsContainer);

      wrapper.appendChild(colorIndexContainer);
      if (sidebar) {
        const itemContainer = sidebar.querySelector(".item-container");
        itemContainer.appendChild(wrapper);
      }
      
      const handleMouseOver = () => {
        deleteButton.style.visibility = "visible";
        addButton.style.visibility = "visible";

        const inputWrappers = descriptionInputsContainer.querySelectorAll(".input-wrapper");
        if (inputWrappers.length > 1) {
          inputWrappers.forEach((inputWrapper) => {
            const deleteInputButton = inputWrapper.querySelector(".delete-input-button");
            deleteInputButton.style.visibility = "visible";
          });
        }
      };

      const handleMouseOut = () => {
        deleteButton.style.visibility = "hidden";
        addButton.style.visibility = "hidden";

        const inputWrappers = descriptionInputsContainer.querySelectorAll(".input-wrapper");
        inputWrappers.forEach((inputWrapper) => {
          const deleteInputButton = inputWrapper.querySelector(".delete-input-button");
          deleteInputButton.style.visibility = "hidden";
        });
      };

      wrapper.addEventListener("mouseover", handleMouseOver);
      wrapper.addEventListener("mouseout", handleMouseOut);
    }
    if (sidebar) {
      const itemContainer = sidebar.querySelector(".item-container");
      const itemPlaceholder = sidebar.querySelector(".item-placeholder");
      updatePlaceholderVisibility(itemContainer, itemPlaceholder);
    }
  }
  applyColorPopup(event) {
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
      colorOption.addEventListener("click", () => this.applyColorWithRanges(color));
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
    strikethroughOption.addEventListener("click", () => this.applyStrikethrough());

    const strikethroughIcon = document.createElement('i');
    strikethroughIcon.classList.add('fas', 'fa-strikethrough', 'icon', 'line-color', 'fa-2x');

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

    colorInput.addEventListener("change", () => this.applyColorWithRanges(colorInput.value));

    const handleClose = () => {
      this.handleColorPopupClosing();
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
  }
  applyColorWithRanges(color) {
    const selection = rangy.getSelection();
    const ranges = selection.getAllRanges();

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
      // Apply the new color highlight
      classApplier.toggleRange(range);
    });

    // Update the sidebar with color indexes
    this.updateSidebar(color);
  }
  applyStrikethrough() {
    const selection = rangy.getSelection();
    const ranges = selection.getAllRanges();
    const color = getUniqueRandomColor();
    console.log(color);
    const classApplier = rangy.createClassApplier(this.strikethroughClassName, { normalize: true });

    ranges.forEach((range) => {
      // Apply the strikethrough style
      classApplier.toggleRange(range);
    });

    // Update the sidebar with strikethrough indexes
    // this.updateSidebar(color, true);
  }
  handleColorPopupClosing() {
    this.closeColorPopup();
  }
  closeColorPopup() {
    document.querySelectorAll(".color-popup").forEach((popup) => popup.remove());
  }
}

export class ExplainedTextInputGen extends ExplainedTextInput {
  constructor(textInputOptions, inputComponentOptions, sidebarOptions) {
    super(textInputOptions, inputComponentOptions, sidebarOptions);

    this.generateButton = document.createElement('button');
    this.generateButton.textContent = 'Generate Output';
    this.generateButton.addEventListener('click', () => {
      // ...
    });

    this.dropdown = document.createElement('select');
    // ... (populate the dropdown)

    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = 0.1;
    this.slider.max = 1.0;
    this.slider.step = 0.1;
    this.slider.value = 0.5;

    // Append elements to the container (textInputWrapper from TextInput class)
    this.textInputWrapper.appendChild(this.generateButton);
    this.textInputWrapper.appendChild(this.dropdown);
    this.textInputWrapper.appendChild(this.slider);

    this.generateButton.addEventListener('click', () => {
      this.handleGenerateButtonClick();
    });
  }
  handleGenerateButtonClick() {
  }
}

export class TextInputsCompareNew {
  constructor(options) {
    console.log(options)
    this.container = document.createElement('div');

    this.textInput1 = new TextInput({ textInputId: options.textInput1ContainerId });
    this.textInput2 = new TextInput({ textInputId: options.textInput2ContainerId });
    this.explainedTextInput = new ExplainedTextInput({
      textInputId: options.explainedTextInputContainerId
    },
      // inputComponentOptions: options.
      {
        containerId: options.explainedTextInputSidebarContainerId,
        sidebarContentId: options.explainedTextInputSidebarContentId,
      }
    );

    this.compareButton = document.createElement('button');
    this.compareButton.textContent = 'Compare';
    this.compareButton.addEventListener('click', () => {
      console.log("components.js:943");
      const diffs = wordDiff(this.textInput1.textInput.textContent, this.textInput2.textInput.textContent);
      this.compareAndApplyDiffs(diffs);
    });

    // Append elements to the container
    this.container.appendChild(this.textInput1.textInputWrapper);
    this.container.appendChild(this.textInput2.textInputWrapper);
    this.container.appendChild(this.compareButton);
    this.container.appendChild(this.explainedTextInput.textInputWrapper);
    this.container.appendChild(this.explainedTextInput.sidebarComponent.container);
  }
  compareAndApplyDiffs(diffs) {
    this.explainedTextInput.removeAllItemsFromSidebar();

    const outputTextArea = this.explainedTextInput.textInput;
    outputTextArea.innerHTML = ''; // Clear the output text area

    diffs.forEach(([op, text]) => {
      const tempSpan = document.createElement('span');
      tempSpan.textContent = text;

      if (op === -1) {
        const selectedRange = rangy.createRange();
        selectedRange.selectNodeContents(tempSpan);
        this.explainedTextInput.applyStrikethrough([selectedRange]);
      } else if (op === 1) {
        const selectedRange = rangy.createRange();
        selectedRange.selectNodeContents(tempSpan);
        const randomColor = getUniqueRandomColor();
        this.explainedTextInput.applyColorWithRanges(randomColor, [selectedRange]);
      }

      outputTextArea.appendChild(tempSpan);
    });
  }
}

export class TextInputsCompareSelf {
  constructor(options) {
    this.container = document.createElement('div');

    this.textInput = new TextInput({ textInputId: options.textInputContainerId });
    this.explainedTextInput = new ExplainedTextInput({
      textInputId: options.explainedTextInputContainerId,
      sidebarOptions: {
        containerId: options.explainedTextInputSidebarContainerId,
        sidebarContentId: options.explainedTextInputSidebarContentId,
      },
    });

    this.compareButton = document.createElement('button');
    this.compareButton.textContent = 'Compare';
    this.compareButton.addEventListener('click', () => {
      const diffs = wordDiff(this.textInput.textInput.textContent, this.explainedTextInput.textInput.textContent);
      this.compareAndApplyDiffs(diffs);
    });

    // Append elements to the container
    this.container.appendChild(this.textInput.textInputWrapper);
    this.container.appendChild(this.compareButton);
    this.container.appendChild(this.explainedTextInput.textInputWrapper);
    this.container.appendChild(this.explainedTextInput.sidebarComponent.container);
  }
  compareAndApplyDiffs(diffs) {
    this.explainedTextInput.removeAllItemsFromSidebar();

    const outputTextArea = this.explainedTextInput.textInput;
    outputTextArea.innerHTML = ''; // Clear the output text area

    diffs.forEach(([op, text]) => {
      const tempSpan = document.createElement('span');
      tempSpan.textContent = text;

      if (op === -1) {
        const selectedRange = rangy.createRange();
        selectedRange.selectNodeContents(tempSpan);
        applyStrikethrough([selectedRange]);
      } else if (op === 1) {
        const selectedRange = rangy.createRange();
        selectedRange.selectNodeContents(tempSpan);
        const randomColor = getUniqueRandomColor();
        applyColorWithRanges(randomColor, [selectedRange]);
      }

      outputTextArea.appendChild(tempSpan);
    });
  }
}

export class PromptGen {
  constructor(options) {
    this.container = document.createElement('div');

    this.textInput = new TextInput({ textInputId: options.textInputContainerId });

    this.textInputGen = new TextInputGen({
      textInputId: options.textInputGenContainerId,
      inputComponent: this.textInput,
    });

    this.container.appendChild(this.textInput.textInputWrapper);
    this.container.appendChild(this.textInputGen.textInputWrapper);
  }
}

export class ExplainedPromptExplainedGen {
  constructor(textInputOptions, inputComponentOptions, sidebarOptions) {
    this.container = document.createElement('div');

    this.explainedTextInput = new ExplainedTextInput({
      textInputId: textInputOptions.explainedTextInputContainerId,
      sidebarOptions: {
        containerId: sidebarOptions.explainedTextInputSidebarContainerId,
        sidebarContentId: sidebarOptions.explainedTextInputSidebarContentId,
      },
    });

    this.explainedTextInputGen = new ExplainedTextInputGen(
      textInputOptions,
      this.explainedTextInput.textInput, // Pass the textInput as inputComponent
      sidebarOptions
    );

    // Append elements to the container
    this.container.appendChild(this.explainedTextInput.textInputWrapper);
    this.container.appendChild(this.explainedTextInput.sidebarComponent.container);
    this.container.appendChild(this.explainedTextInputGen.textInputWrapper);
  }
}

export class Prompt2Gen {
  constructor(options) {
    this.container = document.createElement('div');

    this.textInput = new TextInput({ textInputId: options.textInputContainerId });

    this.textInputGen1 = new TextInputGen({
      textInputId: options.textInputGen1ContainerId,
      inputComponent: this.textInput,
    });

    this.textInputGen2 = new TextInputGen({
      textInputId: options.textInputGen2ContainerId,
      inputComponent: this.textInput,
    });

    // Append elements to the container
    this.container.appendChild(this.textInput.textInputWrapper);
    this.container.appendChild(this.textInputGen1.textInputWrapper);
    this.container.appendChild(this.textInputGen2.textInputWrapper);
  }
}

export class ExplainedPromptExplained2Gen {
  constructor(options) {
    this.container = document.createElement('div');

    this.explainedTextInput = new ExplainedTextInput({
      textInputId: options.explainedTextInputId,
      sidebarOptions: options.explainedTextInputSidebarOptions,
    });

    this.explainedTextInputGen1 = new ExplainedTextInputGen({
      textInputId: options.explainedTextInputGen1Id,
      inputComponent: this.explainedTextInput.textInput,
      sidebarOptions: options.explainedTextInputGen1SidebarOptions,
    });

    this.explainedTextInputGen2 = new ExplainedTextInputGen({
      textInputId: options.explainedTextInputGen2Id,
      inputComponent: this.explainedTextInput.textInput,
      sidebarOptions: options.explainedTextInputGen2SidebarOptions,
    });

    // Append elements to the container
    this.container.appendChild(this.explainedTextInput.textInputWrapper);
    this.container.appendChild(this.explainedTextInput.sidebarComponent.container);
    this.container.appendChild(this.explainedTextInputGen1.textInputWrapper);
    this.container.appendChild(this.explainedTextInputGen1.sidebarComponent.container);
    this.container.appendChild(this.explainedTextInputGen2.textInputWrapper);
    this.container.appendChild(this.explainedTextInputGen2.sidebarComponent.container);
  }
}

export class TwoExplainedPromptGen {
  constructor(options) {
    this.container = document.createElement('div');

    this.textInputsCompareSelf = new TextInputsCompareSelf({
      textInputContainerId: options.textInputContainerId,
      explainedTextInputContainerId: options.explainedTextInputContainerId,
      explainedTextInputSidebarContainerId: options.explainedTextInputSidebarContainerId,
      explainedTextInputSidebarContentId: options.explainedTextInputSidebarContentId,
    });

    this.textInputGen1 = new TextInputGen({
      textInputId: options.textInputGen1Id,
      inputComponent: this.textInputsCompareSelf.textInput,
    });

    this.textInputGen2 = new TextInputGen({
      textInputId: options.textInputGen2Id,
      inputComponent: this.textInputsCompareSelf.explainedTextInput.textInput,
    });

    // Append elements to the container
    this.container.appendChild(this.textInputsCompareSelf.container);
    this.container.appendChild(this.textInputGen1.textInputWrapper);
    this.container.appendChild(this.textInputGen2.textInputWrapper);
  }
}

export class TwoExplainedPromptExplainedGen {
  constructor(options) {
    this.container = document.createElement('div');

    this.textInputsCompareSelf = new TextInputsCompareSelf({
      textInputContainerId: options.textInputContainerId,
      explainedTextInputContainerId: options.explainedTextInputContainerId,
      explainedTextInputSidebarContainerId: options.explainedTextInputSidebarContainerId,
      explainedTextInputSidebarContentId: options.explainedTextInputSidebarContentId,
    });

    this.explainedTextInputGen1 = new ExplainedTextInputGen({
      textInputOptions: { textInputId: options.explainedTextInputGen1Id },
      inputComponentOptions: { inputComponent: this.textInputsCompareSelf.textInput.textInput },
      sidebarOptions: options.explainedTextInputGen1SidebarOptions,
    });

    this.explainedTextInputGen2 = new ExplainedTextInputGen({
      textInputOptions: { textInputId: options.explainedTextInputGen2Id },
      inputComponentOptions: { inputComponent: this.textInputsCompareSelf.explainedTextInput.textInput },
      sidebarOptions: options.explainedTextInputGen2SidebarOptions,
    });

    // Append elements to the container
    this.container.appendChild(this.textInputsCompareSelf.container);
    this.container.appendChild(this.explainedTextInputGen1.textInputWrapper);
    this.container.appendChild(this.explainedTextInputGen1.sidebarComponent.container);
    this.container.appendChild(this.explainedTextInputGen2.textInputWrapper);
    this.container.appendChild(this.explainedTextInputGen2.sidebarComponent.container);
  }
}

export class TwoExplainedPromptExplained2Gen {
  constructor(options) {
    this.container = document.createElement('div');

    this.textInputsCompareSelf = new TextInputsCompareSelf({
      textInputContainerId: options.textInputContainerId,
      explainedTextInputContainerId: options.eTextInputContainerId,
      explainedTextInputSidebarContainerId: options.eTextInputSidebarContainerId,
      explainedTextInputSidebarContentId: options.eTextInputSidebarContentId,
    });

    this.eTextInputGen1 = new ExplainedTextInputGen({
      textInputId: options.eTextInputGen1Id,
      inputComponent: this.textInputsCompareSelf.textInput,
      sidebarOptions: options.eTextInputGen1SidebarOptions,
    });

    this.eTextInputGen2 = new ExplainedTextInputGen({
      textInputId: options.eTextInputGen2Id,
      inputComponent: this.textInputsCompareSelf.textInput,
      sidebarOptions: options.eTextInputGen2SidebarOptions,
    });

    this.eTextInputGen3 = new ExplainedTextInputGen({
      textInputId: options.eTextInputGen3Id,
      inputComponent: this.textInputsCompareSelf.explainedTextInput.textInput,
      sidebarOptions: options.eTextInputGen3SidebarOptions,
    });

    this.eTextInputGen4 = new ExplainedTextInputGen({
      textInputId: options.eTextInputGen4Id,
      inputComponent: this.textInputsCompareSelf.explainedTextInput.textInput,
      sidebarOptions: options.eTextInputGen4SidebarOptions,
    });

    // Append elements to the container
    this.container.appendChild(this.textInputsCompareSelf.container);
    this.container.appendChild(this.eTextInputGen1.textInputWrapper);
    this.container.appendChild(this.eTextInputGen1.sidebarComponent.container);
    this.container.appendChild(this.eTextInputGen2.textInputWrapper);
    this.container.appendChild(this.eTextInputGen2.sidebarComponent.container);
    this.container.appendChild(this.eTextInputGen3.textInputWrapper);
    this.container.appendChild(this.eTextInputGen3.sidebarComponent.container);
    this.container.appendChild(this.eTextInputGen4.textInputWrapper);
    this.container.appendChild(this.eTextInputGen4.sidebarComponent.container);
  }
}

export class VisualizationCanvas {
  constructor(options) {
    this.container = document.createElement('div');

    this.canvas = document.createElement('canvas');
    this.canvas.id = options.canvasId;

    this.visualizeButton = document.createElement('button');
    this.visualizeButton.textContent = 'Visualize';
    this.visualizeButton.addEventListener('click', () => {
      this.visualizeComponents();
    });

    // Instantiate other classes
    this.twoEPromptEGen = new TwoEPromptEGen(options.twoEPromptEGenOptions);
    this.twoEPromptE2Gen = new TwoEPromptE2Gen(options.twoEPromptE2GenOptions);
    this.textInputsCompareNew = new TextInputsCompareNew(options.textInputsCompareNewOptions);
    this.textInputsCompareSelf = new TextInputsCompareSelf(options.textInputsCompareSelfOptions);

    // Append elements to the container
    this.container.appendChild(this.canvas);
    this.container.appendChild(this.visualizeButton);
    this.container.appendChild(this.twoEPromptEGen.container);
    this.container.appendChild(this.twoEPromptE2Gen.container);
    this.container.appendChild(this.textInputsCompareNew.container);
    this.container.appendChild(this.textInputsCompareSelf.container);
  }

  visualizeComponents() {
    // Implement your visualization function here
    // Use this.canvas and components from the instantiated classes
  }
}
