function invertLightness(color) {
  // Hardcoded factor
  const factor = 0.2;

  // Convert the color to HSL
  const originalColor = d3.hsl(color);

  // Decrease the lightness value by the specified factor
  originalColor.l -= factor;

  // Clamp the lightness value to the valid range [0, 1]
  originalColor.l = Math.max(0, Math.min(1, originalColor.l));

  // Convert the color back to RGB
  const darkerColor = d3.rgb(originalColor);

  // Return the darker color as a string
  return darkerColor.toString();
}

const visualization = document.getElementById('visualization');
visualization.style.display = 'none';


const clearVisualization = () => {
  const visualization = document.querySelector('#visualization');
  while (visualization.firstChild) {
    visualization.removeChild(visualization.firstChild);
  }
};

const findNonOverlappingRegion = (canvas, x, y, width, height, lineHeight) => {
  const allTextNodes = canvas.selectAll('text');
  let newY = y;

  while (true) {
    let overlap = false;
    allTextNodes.each(function () {
      const bbox = this.getBBox();
      if (x + width > bbox.x && x < bbox.x + bbox.width && newY + height > bbox.y && newY < bbox.y + bbox.height) {
        overlap = true;
      }
    });

    if (!overlap) {
      return newY;
    }

    newY += lineHeight;
  }
};

export const create_viz = () => {
  clearVisualization();
  const textInputDOM = document.querySelector('#text-input');
  const sidebarDOM = document.querySelector('#sidebar-content');
  const canvas = d3.select('#visualization')
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 600 335')
  .attr('preserveAspectRatio', 'xMidYMid meet');

  const plot = canvas.append('g');

  const textNodes = Array.from(textInputDOM.childNodes);
  const items = sidebarDOM.querySelectorAll('.item-wrapper');

  const annotations = {};

  items.forEach(item => {
    const colorIndexContainer = item.querySelector('.color-index-container');
    const color = colorIndexContainer.id.slice(-6);
    const inputs = item.querySelectorAll('.color-description-input');
    const dropdowns = item.querySelectorAll('.description-dropdown');
    const annotationText = Array.from(inputs).map((input, index) => {
      const prefix = dropdowns[index].value;
      return `${prefix} ${input.value}`.trim();
    }).join('\n');

    annotations[color] = annotationText;
  });

  console.log('Annotations:', annotations);

  let currentX = 0;
  let currentY = 20;
  const lineHeight = 20;
  const maxLineWidth = 80 * 10;
  const annotatedSpans = new Set();

  textNodes.forEach((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(' ');

      words.forEach(word => {
        const wordWidth = word.length * 10;

        if (currentX + wordWidth > maxLineWidth) {
          currentX = 0;
          currentY += lineHeight;
        }

        const text = plot.append('text')
          .attr('x', currentX)
          .attr('y', currentY)
          .text(word);

        currentX += wordWidth + 10;
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const span = node;
      const color = span.className.slice(-6);
      const isHighlight = span.className.includes('color-highlight');
      const isStrikethrough = span.className.includes('strikethrough');

      const words = span.textContent.split(' ');

      words.forEach(word => {
        const wordWidth = word.length * 10;

        if (currentX + wordWidth > maxLineWidth) {
          currentX = 0;
          currentY += lineHeight;
        }

        const text = plot.append('text')
          .attr('x', currentX)
          .attr('y', currentY)
          .attr('fill', `#${color}`)
          .text(word);

        if (isHighlight) {
          const rect = plot.insert('rect', 'text')
            .attr('x', currentX)
            .attr('y', currentY - 15)
            .attr('width', wordWidth)
            .attr('height', lineHeight)
            .attr('fill', `#${color}`);
        }

        if (isStrikethrough) {
          const line = plot.insert('line', 'text')
            .attr('x1', currentX)
            .attr('y1', currentY - 10)
            .attr('x2', currentX + wordWidth)
            .attr('y2', currentY - 10)
            .attr('stroke', `#${color}`)
            .attr('stroke-width', 2);
        }

        currentX += wordWidth + 10;
      });

      if (annotations[color] && !annotatedSpans.has(span)) {
        annotatedSpans.add(span);
        console.log('Drawing annotation for color:', color);
        const annotationText = plot.append('text')
          .attr('x', currentX - 10)
          .attr('y', currentY + 30)
          .text(annotations[color]);

        const bbox = annotationText.node().getBBox();
        const newY = findNonOverlappingRegion(plot, currentX - 10, currentY + 30, bbox.width, bbox.height, lineHeight);

        annotationText.attr('y', newY);

        const line = plot.append('line')
          .attr('x1', currentX - 10)
          .attr('y1', currentY)
          .attr('x2', currentX - 10)
          .attr('y2', newY)
          .attr('stroke', `#${color}`)
          .attr('stroke-width', 2);

        const circle = plot.append('circle')
          .attr('cx', currentX - 10)
          .attr('cy', newY)
          .attr('r', 5)
          .attr('fill', `#${color}`);
      }
    }
  });

  const plotBBox = plot.node().getBBox();
  const plotWidth = plotBBox.width;
  const plotHeight = plotBBox.height;

  // Calculate the translation needed to center the plot
  const canvasWidth = 600; // viewBox width
  const canvasHeight = 335; // viewBox height
  const translateX = (canvasWidth - plotWidth) / 2;
  const translateY = (canvasHeight - plotHeight) / 2;

  // Apply the translation to the plot
  plot.attr('transform', `translate(${translateX}, ${translateY})`);
};


function addDownloadButton(svg) {
  console.log("Adding download button...");
  const visualization = document.getElementById("visualization");
  const downloadButton = document.createElement("button");
  downloadButton.className = "download-svg-btn"; // Add the CSS class

  // Add the SVG download icon
  downloadButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path fill-rule="evenodd" d="M14 9a1 1 0 0 1 1 1v3a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-3a1 1 0 0 1 2 0v3h10v-3a1 1 0 0 1 1-1ZM8 1a1 1 0 0 1 1 1v4.586l1.293-1.293a1 1 0 1 1 1.414 1.414L8 10.414 4.293 6.707a1 1 0 0 1 1.414-1.414L7 6.586V2a1 1 0 0 1 1-1Z"/>
    </svg>
  `;

  downloadButton.onclick = () => {
    console.log("Download button clicked...");
    downloadVisualization(svg);
  };
  visualization.appendChild(downloadButton);
}

function downloadVisualization(svg) {
  console.log("Downloading visualization...");

  // Clone the original SVG element
  const clonedSVG = svg.node().cloneNode(true);

  // Include the styles in the cloned SVG
  includeStyles(clonedSVG);

  // Serialize the cloned SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSVG);
  const svgDataURL = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));

  // Create an image element and set its source to the SVG data URL
  const img = new Image();
  img.src = svgDataURL;

  // Set up a canvas and draw the image on it
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 675;
  const ctx = canvas.getContext("2d");

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a PNG data URL and download it
    const pngDataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngDataURL;
    link.download = "visualization.png";
    link.click();
    console.log("Download should have started...");
  };
}

function getAnnotationText(classNames) {
  if (!classNames) return '';

  let descriptions = [];
  for (const className of classNames) {
    if (className.startsWith('color-highlight-') || className.startsWith('strikethrough-')) {
      const colorId = className.slice(-6);
      const inputWrappers = document.querySelectorAll(`#color-index-${colorId} .input-wrapper`);

      inputWrappers.forEach(inputWrapper => {
        let descriptionParts = [];

        const dropdownElement = inputWrapper.querySelector('.description-dropdown');
        if (dropdownElement && dropdownElement.value) {
          descriptionParts.push(dropdownElement.value);
        }

        const inputElement = inputWrapper.querySelector('.color-description-input');
        if (inputElement && inputElement.value) {
          descriptionParts.push(inputElement.value);
        }

        if (descriptionParts.length > 0) {
          descriptions.push(descriptionParts.join(': '));
        }
      });
    }
  }

  return descriptions.join('\n');
}

function includeStyles(svg) {
  const styleSheets = document.styleSheets;
  const styleElement = document.createElement("style");

  let styleContent = "";

  for (const sheet of styleSheets) {
    let rules;
    try {
      rules = sheet.rules || sheet.cssRules;
    } catch (error) {
      // Access to the stylesheet might be restricted due to CORS policy
      continue;
    }

    for (const rule of rules) {
      styleContent += `${rule.cssText}\n`;
    }
  }

  styleElement.innerHTML = styleContent;
  svg.insertBefore(styleElement, svg.firstChild);
}
