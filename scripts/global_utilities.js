export function updatePlaceholderVisibility(itemContainer, itemPlaceholder) {
  const items = Array.from(itemContainer.children).some(child => {
    return child !== itemPlaceholder && (child.querySelector(".color-index-container") || child.querySelector(".horizontal-line-container"));
  });

  // Show or hide the placeholder based on the presence of items
  itemPlaceholder.style.display = items ? "none" : "block";
}

function findLongestCommonSubsequence(tokens1, tokens2) {
  const lengths = Array(tokens1.length + 1)
    .fill(0)
    .map(() => Array(tokens2.length + 1).fill(0));

  for (let i = 0; i < tokens1.length; i++) {
    for (let j = 0; j < tokens2.length; j++) {
      if (tokens1[i] === tokens2[j]) {
        lengths[i + 1][j + 1] = lengths[i][j] + 1;
      } else {
        lengths[i + 1][j + 1] = Math.max(lengths[i + 1][j], lengths[i][j + 1]);
      }
    }
  }

  let result = [];
  let i = tokens1.length,
    j = tokens2.length;
  while (i > 0 && j > 0) {
    if (lengths[i][j] === lengths[i - 1][j]) {
      i--;
    } else if (lengths[i][j] === lengths[i][j - 1]) {
      j--;
    } else {
      result.unshift(tokens1[i - 1]);
      i--;
      j--;
    }
  }

  return result;
}

export function wordDiff(text1, text2) {
  const tokens1 = text1.split(/\s+/);
  const tokens2 = text2.split(/\s+/);
  const lcs = findLongestCommonSubsequence(tokens1, tokens2);

  const diffs = [];
  let i1 = 0,
    i2 = 0,
    iLcs = 0;
  let deletions = [];
  let additions = [];

  while (i1 < tokens1.length || i2 < tokens2.length) {
    let token1 = i1 < tokens1.length ? tokens1[i1] : null;
    let token2 = i2 < tokens2.length ? tokens2[i2] : null;
    let lcsToken = iLcs < lcs.length ? lcs[iLcs] : null;

    if (token1 === lcsToken && token2 === lcsToken) {
      if (deletions.length > 0) {
        diffs.push([-1, deletions.join(' ')]);
        deletions = [];
      }
      if (additions.length > 0) {
        diffs.push([1, additions.join(' ')]);
        additions = [];
      }
      diffs.push([0, token1]);
      i1++;
      i2++;
      iLcs++;
    } else {
      if (token1 !== lcsToken) {
        deletions.push(token1);
        i1++;
      }
      if (token2 !== lcsToken) {
        additions.push(token2);
        i2++;
      }
    }
  }

  if (deletions.length > 0) {
    diffs.push([-1, deletions.join(' ')]);
  }
  if (additions.length > 0) {
    diffs.push([1, additions.join(' ')]);
  }

  return diffs;
}

export async function getChatCompletion(apiKey, modelName, prompt, temperature, system_content) {
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
    throw new Error("Failed to fetch chat completion: " + response.statusText);
  }

  const jsonResponse = await response.json();

  // Extract the assistant's message from the response
  const assistantMessage = jsonResponse.choices[0].message.content;

  return assistantMessage;
}

export function editDropdownOptions() {
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
