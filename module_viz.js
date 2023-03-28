const visualization = document.getElementById('visualization');

export const create_viz = () => {
  visualization.innerHTML = "";

  // Get the computed style of the #visualization container
  const containerStyle = getComputedStyle(document.querySelector("#visualization"));

  // Use D3.js to create a new visualization
  const svg = d3
    .select("#visualization")
    .append("svg")
    // Set the viewBox attribute to maintain the aspect ratio
    .attr("viewBox", "0 0 600 335");

  // Define padding
  const padding = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  // Create a group element with padding (translation)
  const plotGroup = svg.append("g");

  // Get the innerHTML of the text input area
  const contenteditableDiv = document.querySelector(".text-input");
  const innerHTML = contenteditableDiv.innerHTML;

  // Use a DOMParser to parse the innerHTML
  const parser = new DOMParser();
  const parsedHtml = parser.parseFromString(innerHTML, "text/html");

  // Initialize coordinates for the text elements
  let y = 20;
  let x = 20;
  let maxX = 0;

  // Helper function to process text nodes
  function processTextNode(textNode, x, y, parentClassList) {
    const text = plotGroup
      .append("text")
      .attr("x", x)
      .attr("y", y)
      .classed("text-node", true)
      .text(textNode.textContent);

    if (parentClassList) {
      parentClassList.forEach((className) => {
        const textLength = text.node().getComputedTextLength();
        const padding = 3;
        const lineStartY = y - 16 - padding;
        const lineEndY = y + 2 + padding;

        if (className.startsWith("color-highlight-")) {
          const rect = plotGroup
            .insert("rect", "text")
            .attr("x", x - padding)
            .attr("y", lineStartY)
            .attr("width", textLength + 2 * padding)
            .attr("height", 16 + 2 * padding)
            .classed("color-highlight", true)
            .style("fill", `#${className.substring(16)}`);

          const annotationDirection = y > 50 ? -30 : 30;

          const line = plotGroup
            .insert("line", "text.annotation-text")
            .attr("x1", x + textLength / 2)
            .attr("y1", lineStartY + padding)
            .attr("x2", x + textLength / 2)
            .attr("y2", y + annotationDirection)
            .classed("annotation-line", true)
            .style("stroke", `#${className.substring(16)}`)
            .style("stroke-width", "2px");

          plotGroup
            .append("circle")
            .attr("cx", x + textLength / 2)
            .attr("cy", y + annotationDirection)
            .attr("r", 3)
            .classed("annotation-circle", true)
            .style("fill", `#${className.substring(16)}`);

          plotGroup
            .append("text")
            .attr("x", x + textLength / 2 + 10)
            .attr("y", y + annotationDirection + 20)
            .classed("annotation-text", true)
            .text(textNode.textContent);
        } else if (className.startsWith("strikethrough-")) {
          const line = plotGroup
            .append("line")
            .attr("x1", x)
            .attr("y1", y - 7)
            .attr("x2", x + textLength)
            .attr("y2", y - 7)
            .classed("strikethrough", true)
            .style("stroke", `#${className.substring(14)}`);

          const annotationDirection = y > 50 ? -30 : 30;

          const line2 = plotGroup
            .insert("line", "text.annotation-text")
            .attr("x1", x + textLength / 2)
            .attr("y1", y - 7 + 3) // Add 3px to the starting y-coordinate
            .attr("x2", x + textLength / 2)
            .attr("y2", y + annotationDirection - 7)
            .classed("annotation-line", true)
            .style("stroke", `#${className.substring(14)}`)
            .style("stroke-width", "2px");

          plotGroup
            .append("circle")
            .attr("cx", x + textLength / 2)
            .attr("cy", y + annotationDirection - 7)
            .attr("r", 3)
            .classed("annotation-circle", true)
            .style("fill", `#${className.substring(14)}`);

          plotGroup
            .append("text")
            .attr("x", x + textLength / 2 + 10)
            .attr("y", y + annotationDirection + 13) // Add 20 to the y-coordinate
            .classed("annotation-text", true)
            .text(textNode.textContent);
        }
      });
    }

    return text.node().getComputedTextLength();
  }

  // Iterate through the parsed HTML children
  parsedHtml.body.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      x += processTextNode(child, x, y) + 10;
    } else {
      const classNames = child.classList;
      child.childNodes.forEach((childNode) => {
        if (childNode.nodeType === Node.TEXT_NODE) {
          x += processTextNode(childNode, x, y, classNames) + 10;
        }
      });
    }
  });

  const bbox = plotGroup.node().getBBox();
  const remainingWidth = parseFloat(containerStyle.width) - bbox.width;
  const remainingHeight = parseFloat(containerStyle.height) - bbox.height;
  plotGroup.attr("transform", `translate(${padding.left}, ${padding.top})`);
  console.log('SVG contents:', svg.node().outerHTML);
console.log('Bounding box:', bbox);

  const hiddenTrigger = document.querySelector('.hidden-trigger');
  hiddenTrigger.textContent = Math.random();

};
