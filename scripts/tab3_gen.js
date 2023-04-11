import { removeAllItemsFromSidebar, getCleanText } from './setup.js'


document.addEventListener("DOMContentLoaded", () => {

  const apiKey = localStorage.getItem("apiKey");
  const apiKeyTextbox = document.getElementById("textbox-gen");
  const textInput2 = document.getElementById("tb3-text-input-2");

  //console.log(textInput2)

  if (apiKey) {
    apiKeyTextbox.value = apiKey;
    textInput2.setAttribute("data-placeholder", "Generation Appears Here");
  } else {
    textInput2.setAttribute("data-placeholder", "Generation Appears Here.\nAdd the API key in settings.");
  }

  document.querySelector("#tb3-settings-button-gen").addEventListener("click", function() {
    event.stopPropagation();
    document.getElementById("settingsModal-gen").style.display = "block";
  });

  document.getElementById("saveOptions-gen").addEventListener("click", function() {
    const apiKey = document.getElementById("textbox-gen").value;
    localStorage.setItem("apiKey", apiKey);
    document.getElementById("settingsModal-gen").style.display = "none";
  });

  document.getElementById("closeSettingsModal-gen").addEventListener("click", function() {
    document.getElementById("settingsModal-gen").style.display = "none";

  });



  // Temperature
  document.querySelector("#tb3-temperature-button").addEventListener("click", function() {
    event.stopPropagation();
    const temperatureSliderPopup = document.getElementById("tb3-temperature-slider-popup");
    temperatureSliderPopup.style.display = "block";
  });

  const temperatureSlider = document.getElementById("tb3-temperature-slider");
  const temperatureValueIcon = document.getElementById("tb3-temperature-value-icon");

  temperatureSlider.addEventListener("input", function() {
    temperatureValueIcon.textContent = parseFloat(temperatureSlider.value).toFixed(1);
  });



  // Close settingsModal-gen when clicking outside or pressing Escape
  document.addEventListener("click", function(event) {
    const temperatureSliderPopup = document.getElementById("tb3-temperature-slider-popup");
    if (!temperatureSliderPopup.contains(event.target)) {
      temperatureSliderPopup.style.display = "none";
    }
  });

  document.getElementById("settingsModal-gen").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      document.getElementById("saveOptions-gen").click();
    }
  });



  window.addEventListener("keydown", function(event) {
    const settingsModal = document.getElementById("settingsModal-gen");
    const temperatureSliderPopup = document.getElementById("tb3-temperature-slider-popup");
    if (event.key === "Escape") {
      settingsModal.style.display = "none";
      temperatureSliderPopup.style.display = "none";
    }
  });

  document.querySelector("#tb3-generate-button").addEventListener("click", function() {
    removeAllItemsFromSidebar("tb3-sidebar-content-2");
    const apiKey = localStorage.getItem("apiKey");
    const modelName = document.getElementById("tb3-dropdown-gen").value;
    const prompt = getCleanText("tb3-text-input-1");
    const temperature = document.getElementById("tb3-temperature-slider").value;
    const textInput2 = document.getElementById("tb3-text-input-2");
    const current_date = new Date().toLocaleDateString();
    let system_content;

    if (modelName === "gpt-4") {
      //system_content = "You are GPT-4, a large language model trained by OpenAI. Answer as concisely as possible";
      system_content="";
    } else {
      //system_content = "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: 2021-09-01 Current date: " + current_date;
      system_content="";
    }

    if (!apiKey) {
      alert("Please add the API key in settings.");
      return;
    }

    // Clear the tb3-text-input-2 and change the placeholder to "Loading..."
    textInput2.innerText = "";
    textInput2.setAttribute("data-placeholder", "Loading...");

    getChatCompletion(apiKey, modelName, prompt, temperature, system_content)
      .then((assistantMessage) => {
        // Revert the placeholder and display the assistant's message
        textInput2.setAttribute("data-placeholder", "Generation Appears Here.\nAdd the API key in settings.");
        textInput2.innerText = assistantMessage;
      })
      .catch((error) => {
        // Revert the placeholder and display an error message
        textInput2.setAttribute("data-placeholder", "Generation Appears Here.\nAdd the API key in settings.");
        textInput2.innerText = "Error: " + error.message;
      });
  });


});


async function getChatCompletion(apiKey, modelName, prompt, temperature, system_content) {
  const requestBody = JSON.stringify({
    model: modelName,
    messages: [{
      role: "system",
      content: system_content,
    },
    {
      role: "user",
      content: prompt,
    },
    ],
    max_tokens: 2048,
    n: 1,
    temperature: parseFloat(temperature),
  });

  console.log(
    `curl https://api.openai.com/v1/chat/completions -H "Content-Type: application/json" -H "Authorization: Bearer ${apiKey}" -d '${requestBody}'`
  );

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + apiKey,
    },
    body: requestBody,
  });

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Error details:", JSON.stringify(errorDetails, null, 2));
    throw new Error("Failed to fetch chat completion: " + response.statusText);
  }

  const jsonResponse = await response.json();

  // Extract the assistant's message from the response
  const assistantMessage = jsonResponse.choices[0].message.content;

  return assistantMessage;
};
