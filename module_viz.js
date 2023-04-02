function darkenColor(color) {
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

function getPaddedBBox(node, padding) {
  const bbox = node.getBBox();
  return {
    x: bbox.x - padding,
    y: bbox.y - padding,
    width: bbox.width + 2 * padding,
    height: bbox.height + 2 * padding,
  };
}

const findNonOverlappingRegion = (canvas, x, y, width, height, lineHeight, padding, excludeElement) => {
  const minHeight = lineHeight * 3.5;
  const allTextNodes = canvas.selectAll('text').filter(function() { return this !== excludeElement; });
  let newY1 = y + minHeight;
  let newY2 = y - minHeight;
  let newX = (x - 6) - width / 2;

  const checkOverlap = (newY) => {
    let overlapCount = 0;
    allTextNodes.each(function() {
      const bbox = getPaddedBBox(this, padding);
      if (newX + width > bbox.x && newX < bbox.x + bbox.width &&
        ((newY + height > bbox.y && newY < bbox.y + bbox.height) || (newY - height > bbox.y && newY - height < bbox.y + bbox.height))) {
        overlapCount++;
      }
    });
    return overlapCount;
  };

  const overlapCount1 = checkOverlap(newY1);
  const overlapCount2 = checkOverlap(newY2);

  console.log('Overlap count for newY1:', overlapCount1);
  console.log('Overlap count for newY2:', overlapCount2);

  const newY = (overlapCount1 === overlapCount2) ? (Math.random() < 0.5 ? newY1 : newY2) : (overlapCount1 < overlapCount2 ? newY1 : newY2);

  return { x: newX, y: newY };
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

  // Add a new array to store the x positions of the words
  const wordXPositions = [];
  const annotationData = [];

  textNodes.forEach((node, index) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.split(' ');

      words.forEach(word => {
        // Create a temporary text node to calculate the word width
        const tempText = plot.append('text')
          .attr('x', -9999) // Place the temporary text node off-screen
          .attr('y', -9999)
          .text(word);

        const wordWidth = tempText.node().getComputedTextLength(); // Use getComputedTextLength() method
        tempText.remove(); // Remove the temporary text node
        const spaceBetweenWords = 5;

        if (currentX + wordWidth > maxLineWidth) {
          currentX = 0;
          currentY += lineHeight + 15;
        }

        const text = plot.append('text')
          .attr('x', currentX)
          .attr('y', currentY)
          .text(word);

        // Store the x position of the word
        wordXPositions.push(currentX);

        currentX += wordWidth + spaceBetweenWords;
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const span = node;
      const color = span.className.slice(-6);
      const isHighlight = span.className.includes('color-highlight');
      const isStrikethrough = span.className.includes('strikethrough');

      const words = span.textContent.split(' ');
      const middleWordIndex = Math.floor((words.length + 1) / 2) - 1;
      let middleWordX;


      words.forEach((word, wordIndex) => {

        // Create a temporary text node to calculate the word width
        const tempText = plot.append('text')
          .attr('x', -9999) // Place the temporary text node off-screen
          .attr('y', -9999)
          .text(word);

        const wordWidth = tempText.node().getComputedTextLength(); // Use getComputedTextLength() method
        tempText.remove(); // Remove the temporary text node
        const spaceBetweenWords = 5;


        if (currentX + wordWidth > maxLineWidth) {
          currentX = 0;
          currentY += lineHeight + 15;
        }

        if (wordIndex === middleWordIndex) {
          middleWordX = currentX;
        }

        const text = plot.append('text')
          .attr('x', currentX)
          .attr('y', currentY)
          .text(word)
          .style('pointer-events', 'none'); // Add this line

        // Calculate the middle word's x position
        if (wordIndex === middleWordIndex) {
          middleWordX = currentX + wordWidth / 2;
        }

        if (isHighlight) {
          const rect = plot.insert('rect', 'text')
            .attr('x', currentX - 3)
            .attr('y', currentY - 15)
            .attr('width', wordWidth + 6)
            .attr('height', lineHeight)
            .attr('fill', `#${color}`);
        }

        if (isStrikethrough) {
          const line = plot.insert('line', 'text')
            .attr('x1', currentX - 3)
            .attr('y1', currentY - 5)
            .attr('x2', currentX + wordWidth + 2)
            .attr('y2', currentY - 5)
            .attr('stroke', `#${color}`)
            .attr('stroke-width', 2);
        }

        currentX += wordWidth + spaceBetweenWords; // Change the spacing between words in highlight/strikethrough spans to 5 pixels
      });
      if (annotations[color] && !annotatedSpans.has(span)) {
        annotatedSpans.add(span);

        annotationData.push({
          color,
          middleWordX,
          currentY,
          annotationLines: annotations[color].split('\n')
        });
      }

    }
  });


  // Second pass: add the annotation lines, circles, and texts (outside the first pass loop)
  annotationData
    .filter(({ annotationLines }) => {
      return annotationLines.some(line => line.trim() !== '');
    })
    .forEach(({ color, middleWordX, currentY, annotationLines }) => {
      console.log('Drawing annotation for color:', color);

      // Create a group element to hold the annotation elements
      const annotationGroup = plot.append('g')
        .on('mouseover', function() { showDragHandles(d3.select(this)); })
        .on('mouseout', function() { hideDragHandles(d3.select(this)); })
        .on('touchstart', function() { showDragHandles(d3.select(this)); });

      const annotationText = annotationGroup.append('text')
        .attr('x', middleWordX - 6)
        .attr('y', currentY)
        .style('fill', darkenColor(`#${color}`))
        .style('font-size', '14px')
        .style('pointer-events', 'none'); // Add this line

      annotationLines.forEach((line, index) => {
        annotationText.append('tspan')
          .text(line)
          .attr('x', middleWordX - 6)
          .attr('dy', index === 0 ? 0 : lineHeight);
      });
      const padding = 5;

      const bbox = getPaddedBBox(annotationText.node(), padding);

      const newCoords = findNonOverlappingRegion(plot, middleWordX, currentY, bbox.width, bbox.height, lineHeight, padding, annotationText.node());



      annotationText.attr('x', newCoords.x).attr('y', newCoords.y);
      annotationText.node().setAttribute('x', newCoords.x);


      const newBbox = getPaddedBBox(annotationText.node(), padding);
      const centerXLeft = newBbox.x;
      const centerXRight = newBbox.x + newBbox.width;
      const centerYTop = newBbox.y;
      const centerYBottom = newBbox.y + newBbox.height;

      const centers = [
        { x: centerXLeft, y: (centerYTop + centerYBottom) / 2 },
        { x: centerXRight, y: (centerYTop + centerYBottom) / 2 },
        { x: (centerXLeft + centerXRight) / 2, y: centerYTop },
        { x: (centerXLeft + centerXRight) / 2, y: centerYBottom },
      ];

      const middleWordCoords = { x: middleWordX, y: currentY };

      const closestCenter = centers.reduce((prev, curr) => {
        const prevDist = Math.sqrt(Math.pow(prev.x - middleWordCoords.x, 2) + Math.pow(prev.y - middleWordCoords.y, 2));
        const currDist = Math.sqrt(Math.pow(curr.x - middleWordCoords.x, 2) + Math.pow(curr.y - middleWordCoords.y, 2));
        return currDist < prevDist ? curr : prev;
      });

      const line = annotationGroup.append('line')
        .attr('x1', middleWordX - 6)
        .attr('y1', currentY)
        .attr('x2', closestCenter.x)
        .attr('y2', closestCenter.y)
        .attr('stroke', darkenColor(`#${color}`))
        .attr('stroke-width', 1.5);

      //hack
      let diff = closestCenter.x - (middleWordX - 6);

      annotationText.attr('x', newCoords.x - diff);


      const circle = annotationGroup.append('circle')
        .attr('cx', closestCenter.x)
        .attr('cy', closestCenter.y)
        .attr('r', 3)
        .attr('fill', darkenColor(`#${color}`));

      if (newCoords.y < currentY) {
        annotationText.attr('y', parseFloat(annotationText.attr('y')) - padding);
      } else {
        annotationText.attr('y', parseFloat(annotationText.attr('y')) + padding);
      }

      // Create drag handles and add drag behavior
      const handleRadius = 4;

      const textHandle = annotationGroup.append('circle')
        .attr('class', 'drag-handle')
        .attr('cx', closestCenter.x)
        .attr('cy', closestCenter.y)
        .attr('r', handleRadius)
        .attr('fill', 'blue')
        .style('cursor', 'move')
        .style('display', 'none');

      textHandle.call(createDragBehavior((dx, dy) => {
        // Update the position of the text handle
        textHandle.attr('cx', parseFloat(textHandle.attr('cx')) + dx)
          .attr('cy', parseFloat(textHandle.attr('cy')) + dy);

        // Update the position of the multi-line text
        const newTextX = parseFloat(annotationText.attr('x')) + dx;
        const newTextY = parseFloat(annotationText.attr('y')) + dy;
        annotationText.attr('x', newTextX)
          .attr('y', newTextY);

        // Update the position of tspan elements
        annotationText.selectAll('tspan')
          .attr('x', newTextX);

        // Update the line's end position
        line.attr('x2', parseFloat(line.attr('x2')) + dx)
          .attr('y2', parseFloat(line.attr('y2')) + dy);

        // Update the circle's position
        circle.attr('cx', parseFloat(circle.attr('cx')) + dx)
          .attr('cy', parseFloat(circle.attr('cy')) + dy);

      }, () => {
        // Recalculate the centers of the annotation text bounding box
        const newBbox = getPaddedBBox(annotationText.node(), padding);
        const centerXLeft = newBbox.x;
        const centerXRight = newBbox.x + newBbox.width;
        const centerYTop = newBbox.y;
        const centerYBottom = newBbox.y + newBbox.height;

        const newCenters = [
          { x: centerXLeft, y: (centerYTop + centerYBottom) / 2 },
          { x: centerXRight, y: (centerYTop + centerYBottom) / 2 },
          { x: (centerXLeft + centerXRight) / 2, y: centerYTop },
          { x: (centerXLeft + centerXRight) / 2, y: centerYBottom },
        ];

        // Calculate the closest center
        const newClosestCenter = newCenters.reduce((prev, curr) => {
          const prevDist = Math.sqrt(Math.pow(prev.x - middleWordCoords.x, 2) + Math.pow(prev.y - middleWordCoords.y, 2));
          const currDist = Math.sqrt(Math.pow(curr.x - middleWordCoords.x, 2) + Math.pow(curr.y - middleWordCoords.y, 2));
          return currDist < prevDist ? curr : prev;
        });

        // Update the line's end position
        line.attr('x2', newClosestCenter.x)
          .attr('y2', newClosestCenter.y);

        // Update the circle's position
        circle.attr('cx', newClosestCenter.x)
          .attr('cy', newClosestCenter.y);

        // Update the text handle position
        textHandle.attr('cx', newClosestCenter.x)
          .attr('cy', newClosestCenter.y);
      }));

      const lineEndHandle = annotationGroup.append('circle')
        .attr('class', 'drag-handle')
        .attr('cx', middleWordX - 6)
        .attr('cy', currentY)
        .attr('r', handleRadius)
        .attr('fill', 'blue')
        .style('cursor', 'move')
        .style('display', 'none');

      lineEndHandle.call(createDragBehavior((dx, dy) => {
        // Update the position of the line's start position
        line.attr('x1', parseFloat(line.attr('x1')) + dx)
          .attr('y1', parseFloat(line.attr('y1')) + dy);

        // Update the position of the line end handle
        lineEndHandle.attr('cx', parseFloat(lineEndHandle.attr('cx')) + dx)
          .attr('cy', parseFloat(lineEndHandle.attr('cy')) + dy);
      }, () => {
        // No additional logic needed for lineEndHandle drag end
      }));
    });

  // Get the bounding box of the plot after rendering all the text elements
  const plotBBox = plot.node().getBBox();

  // Update the viewBox based on the plot's bounding box
  const padding = 20;
  const updatedViewBox = `0 0 ${plotBBox.width + padding * 2} ${plotBBox.height + padding * 2}`;
  canvas.attr('viewBox', updatedViewBox);

  // Center the plot within the updated viewBox
  const translateX = padding - plotBBox.x;
  const translateY = padding - plotBBox.y;
  plot.attr('transform', `translate(${translateX}, ${translateY})`);
};


// Helper function to create drag behavior
function createDragBehavior(onDrag, onDragEnd) {
  let prevX, prevY;

  return d3.drag()
    .on('start', (event) => {
      event.sourceEvent.stopPropagation();
      prevX = event.x;
      prevY = event.y;
    })
    .on('drag', (event) => {
      const dx = event.x - prevX;
      const dy = event.y - prevY;
      prevX = event.x;
      prevY = event.y;
      onDrag.call(this, dx, dy);
    })
    .on('end', onDragEnd);
}
// Helper function to show drag handles
function showDragHandles(annotationGroup) {
  annotationGroup.selectAll('.drag-handle').style('display', 'block');
}

// Helper function to hide drag handles
function hideDragHandles(annotationGroup) {
  annotationGroup.selectAll('.drag-handle').style('display', 'none');
}



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
