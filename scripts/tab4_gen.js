document.addEventListener("DOMContentLoaded", () => {

  const apiKey = localStorage.getItem("apiKey");
  const apiKeyTextbox = document.getElementById("textbox-gen");
  const textInput2 = document.getElementById("tb4-text-input-2");
  const textInput3 = document.getElementById("tb4-text-input-3");

  //console.log(textInput2)

  if (apiKey) {
    apiKeyTextbox.value = apiKey;
    textInput2.setAttribute("data-placeholder", "Generation Appears Here");
    textInput3.setAttribute("data-placeholder", "Generation Appears Here");
  } else {
    textInput2.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
    textInput3.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
  }

  document.querySelector("#tb4-settings-button-gen-1").addEventListener("click", function() {
    event.stopPropagation();
    document.getElementById("settingsModal-gen").style.display = "block";
  });
    document.querySelector("#tb4-settings-button-gen-2").addEventListener("click", function() {
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
  document.querySelector("#tb4-temperature-button-1").addEventListener("click", function() {
    event.stopPropagation();
    const temperatureSliderPopup1 = document.getElementById("tb4-temperature-slider-popup-1");
    temperatureSliderPopup1.style.display = "block";
  });

  const temperatureSlider1 = document.getElementById("tb4-temperature-slider-1");
  const temperatureValueIcon1 = document.getElementById("tb4-temperature-value-icon-1");

  temperatureSlider1.addEventListener("input", function() {
    temperatureValueIcon1.textContent = parseFloat(temperatureSlider1.value).toFixed(1);
  });

    document.querySelector("#tb4-temperature-button-2").addEventListener("click", function() {
    event.stopPropagation();
    const temperatureSliderPopup2 = document.getElementById("tb4-temperature-slider-popup-2");
    temperatureSliderPopup2.style.display = "block";
  });

  const temperatureSlider2 = document.getElementById("tb4-temperature-slider-2");
  const temperatureValueIcon2 = document.getElementById("tb4-temperature-value-icon-2");

  temperatureSlider2.addEventListener("input", function() {
    temperatureValueIcon2.textContent = parseFloat(temperatureSlider2.value).toFixed(1);
  });



  // Close settingsModal-gen when clicking outside or pressing Escape
  document.addEventListener("click", function(event) {
    const temperatureSliderPopup1 = document.getElementById("tb4-temperature-slider-popup-1");
    const temperatureSliderPopup2 = document.getElementById("tb4-temperature-slider-popup-2");
    if (!temperatureSliderPopup1.contains(event.target)) {
      temperatureSliderPopup1.style.display = "none";
    }
    if (!temperatureSliderPopup2.contains(event.target)) {
      temperatureSliderPopup2.style.display = "none";
    }
  });

  document.getElementById("settingsModal-gen").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
      document.getElementById("saveOptions-gen").click();
    }
  });



  window.addEventListener("keydown", function(event) {
    const settingsModal = document.getElementById("settingsModal-gen");
    const temperatureSliderPopup1 = document.getElementById("tb4-temperature-slider-popup-1");
        const temperatureSliderPopup2 = document.getElementById("tb4-temperature-slider-popup-2");

    if (event.key === "Escape") {
      settingsModal.style.display = "none";
      temperatureSliderPopup.style.display = "none";
      temperatureSliderPopup2.style.display = "none";
    }
  });

  document.querySelector("#tb4-generate-button-1").addEventListener("click", function() {
    const apiKey = localStorage.getItem("apiKey");
    const modelName = document.getElementById("tb4-dropdown-gen-1").value;
    const prompt = document.getElementById("tb4-text-input-1").innerText;
    const temperature = document.getElementById("tb4-temperature-slider-1").value;
    const textInput2 = document.getElementById("tb4-text-input-2");
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

    // Clear the tb3-text-input-2 and change the placeholder to "Loading..."
    textInput2.innerText = "";
    textInput2.setAttribute("data-placeholder", "Loading...");

    getChatCompletion(apiKey, modelName, prompt, temperature, system_content)
      .then((assistantMessage) => {
        // Revert the placeholder and display the assistant's message
        textInput2.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
        textInput2.innerText = assistantMessage;
      })
      .catch((error) => {
        // Revert the placeholder and display an error message
        textInput2.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
        textInput2.innerText = "Error: " + error.message;
      });
  });

  document.querySelector("#tb4-generate-button-2").addEventListener("click", function() {
    const apiKey = localStorage.getItem("apiKey");
    const modelName = document.getElementById("tb4-dropdown-gen-2").value;
    const prompt = document.getElementById("tb4-text-input-1").innerText;
    const temperature = document.getElementById("tb4-temperature-slider-2").value;
    const textInput3 = document.getElementById("tb4-text-input-3");
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

    // Clear the tb3-text-input-2 and change the placeholder to "Loading..."
    textInput3.innerText = "";
    textInput3.setAttribute("data-placeholder", "Loading...");

    getChatCompletion(apiKey, modelName, prompt, temperature, system_content)
      .then((assistantMessage) => {
        // Revert the placeholder and display the assistant's message
        textInput3.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
        textInput3.innerText = assistantMessage;
      })
      .catch((error) => {
        // Revert the placeholder and display an error message
        textInput3.setAttribute("data-placeholder", "Generation Appears Here. Add the API key in settings.");
        textInput3.innerText = "Error: " + error.message;
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
