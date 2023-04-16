function resize_svg(visualizationnumid, scaleFactor) {
  const svgContainer = d3.select('#' + visualizationnumid + ' svg').node();
  const viewBoxWidth = svgContainer.viewBox.baseVal.width;
  const viewBoxHeight = svgContainer.viewBox.baseVal.height;

  const gElement = d3.select('#' + visualizationnumid + ' svg g').node();
  const gBBox = gElement.getBBox();

  const gCenterX = gBBox.x + gBBox.width / 2;
  const gCenterY = gBBox.y + gBBox.height / 2;

  const svgCenterX = viewBoxWidth / 2;
  const svgCenterY = viewBoxHeight / 2;

  const translateX = svgCenterX - gCenterX * scaleFactor;
  const translateY = svgCenterY - gCenterY * scaleFactor;

  d3.select('#' + visualizationnumid + ' svg g')
    .attr('transform', `translate(${translateX}, ${translateY}) scale(${scaleFactor})`);
}

function scale_svgs(scalevals, num, visualizationid) {
  if (num === 2) {
    let scale1 = scalevals[0];
    let scale2 = scalevals[1];
    console.log(scale1, scale2);
    if (scale1 < 1 && scale2 < 1) {
      const minScale = Math.max(scale1, scale2);
      if (scale1 < minScale) {
        const scaleFactor = scale1 / minScale;
        //console.log(scaleFactor);
        resize_svg(visualizationid + '-1', scaleFactor);
      } else if (scale2 < minScale) {
        const scaleFactor = scale2 / minScale;
        //console.log(scaleFactor);
        resize_svg(visualizationid + '-2', scaleFactor);

      }
    }
  }
  else if (num === 3) {
    let scale1 = scalevals[0];
    let scale2 = scalevals[1];
    let scale3 = scalevals[2];
    console.log(scale1, scale2, scale3);
    if (scale1 < 1 && scale2 < 1 && scale3 < 1) {
      const minScale = Math.max(scale1, scale2, scale3);
      if (scale1 < minScale) {
        const scaleFactor = scale1 / minScale;
        //console.log(scaleFactor);
        resize_svg(visualizationid + '-1', scaleFactor);
      }
      if (scale2 < minScale) {
        const scaleFactor = scale2 / minScale;
        //console.log(scaleFactor);
        resize_svg(visualizationid + '-2', scaleFactor);

      }
      if (scale3 < minScale) {
        const scaleFactor = scale3 / minScale;
        //console.log(scaleFactor);
        resize_svg(visualizationid + '-3', scaleFactor);

      }

    }
  }

}

export const tab_create_viz = (visualizationid, tabid) => {
  if (tabid === "tab2") {
    clearVisualization(visualizationid + '-1');
    let scale1 = create_viz(visualizationid + '-1', 'tb2-text-input', 'tb2-sidebar');
    // svgToTikz('svg-'+visualizationid+'-1');
    //generateTikzCode('tb2-text-input', 'tb2-sidebar');
    // const svgCode = document.querySelector('#svg-'+visualizationid+'-1').innerHTML;
    // const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    // saveAs(blob, 'yourSvgFile.svg');

  }
  else if (tabid === "tab3") {
    clearVisualization(visualizationid + '-1');
    clearVisualization(visualizationid + '-2');
    var button = document.getElementById("tb3-visualization-combined-export-btn");
    if (button !== null) { button.remove(); }

    let scale1 = create_viz(visualizationid + '-1', 'tb3-text-input-1', 'tb3-sidebar-1');
    let scale2 = create_viz(visualizationid + '-2', 'tb3-text-input-2', 'tb3-sidebar-2');
    scale_svgs([scale1, scale2], 2, visualizationid);
    addDownloadCombinedButton(visualizationid, visualizationid + '-1');
  }
  else if (tabid === "tab4") {
    clearVisualization(visualizationid + '-1');
    clearVisualization(visualizationid + '-2');
    clearVisualization(visualizationid + '-3');
    var button = document.getElementById("tb4-visualization-combined-export-btn");
    if (button !== null) { button.remove(); }
    let scale1 = create_viz(visualizationid + '-1', 'tb4-text-input-1', 'tb4-sidebar-1');
    let scale2 = create_viz(visualizationid + '-2', 'tb4-text-input-2', 'tb4-sidebar-2');
    let scale3 = create_viz(visualizationid + '-3', 'tb4-text-input-3', 'tb4-sidebar-3');
    scale_svgs([scale1, scale2, scale3], 3, visualizationid);
    addDownloadCombinedButton(visualizationid, visualizationid + '-1', 3);
  }
};

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

const visualizations = document.querySelectorAll('.visualization');
visualizations.forEach(visualization => {
  visualization.style.display = 'none';
});


const clearVisualization = (visualizationid) => {
  const visualization = document.querySelector('#' + visualizationid);
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
  let newX = ((x) - width / 2) + padding;

  // Get all nodes with the class attribute "main-text-class"
  const mainTextNodes = canvas.selectAll('.main-text-class');

  // Calculate the bounding box of the selected nodes combined together
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  mainTextNodes.each(function() {
    const bbox = this.getBBox();
    minX = Math.min(minX, bbox.x);
    minY = Math.min(minY, bbox.y);
    maxX = Math.max(maxX, bbox.x + bbox.width);
    maxY = Math.max(maxY, bbox.y + bbox.height);
  });

  // Update newY1 and newY2 based on the calculated bounding box
  newY1 = (newY1 < (maxY + 5)) ? (y + maxY + 5) : newY1;
  newY2 = (newY2 > (minY - 5)) ? (y - minY - 5) : newY2;

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

  // console.log('Overlap count for newY1:', overlapCount1);
  // console.log('Overlap count for newY2:', overlapCount2);

  const newY = (overlapCount1 === overlapCount2) ? (Math.random() < 0.5 ? newY1 : newY2) : (overlapCount1 < overlapCount2 ? newY1 : newY2);

  return { x: newX, y: newY };
};


const create_viz = (visualizationid, textid, sidebarid, wraplim = 40, width = 600, height = 335) => {
  const textInputDOM = document.querySelector('#' + textid);
  const sidebarDOM = document.querySelector('#' + sidebarid);
  const canvas = d3.select('#' + visualizationid)
    .append('svg')
    .attr('id', 'svg-'+visualizationid)
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', '0 0 ' + width + ' ' + height)
    .attr('preserveAspectRatio', 'xMidYMid meet');


  const plot = canvas.append('g');

  const textNodes = Array.from(textInputDOM.childNodes);
  const items = sidebarDOM.querySelectorAll('.item-wrapper:not([data-type="horizontal-line"])');

  const annotations = {};

  items.forEach(item => {
    const colorIndexContainer = item.querySelector('.color-index-container');
    const color = colorIndexContainer.id.slice(-6);
    const inputs = item.querySelectorAll('.color-description-input');
    const dropdowns = item.querySelectorAll('.description-dropdown');
    const annotationText = Array.from(inputs).map((input, index) => {
      // const prefix = dropdowns[index].value != "" ? dropdowns[index].value + ": " : "";
      // return `${prefix} ${input.value}`.trim();
      if (dropdowns[index].value !== "" && input.value !== "") {
        return `${dropdowns[index].value}: ${input.value}`.trim();
      } else if (dropdowns[index].value === "" && input.value !== "") {
        return input.value.trim();
      } else if (dropdowns[index].value !== "" && input.value === "") {
        return dropdowns[index].value.trim();
      } else {
        return "";
      }
    }).join('\n');

    annotations[color] = annotationText;
  });

  //console.log('Annotations:', annotations);

  let currentX = 0;
  let currentY = 20;
  const lineHeight = 20;
  const maxLineWidth = wraplim * 10;
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
          .attr('class', 'main-text-class')
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
            .attr('fill', `#${color}`)
            .attr('rx', 4) // set x-axis radius to 5
            .attr('ry', 4); // set y-axis radius to 5

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

  console.log(annotationData);


  // Second pass: add the annotation lines, circles, and texts (outside the first pass loop)
  annotationData
    .filter(({ annotationLines }) => {
      return annotationLines.some(line => line.trim() !== '');
    })
    .forEach(({ color, middleWordX, currentY, annotationLines }) => {
      //console.log('Drawing annotation for color:', color);

      // Create a group element to hold the annotation elements
      const annotationGroup = plot.append('g')
        .on('mouseover', function() { showDragHandles(d3.select(this)); })
        .on('mouseout', function() { hideDragHandles(d3.select(this)); })
        .on('touchstart', function() { showDragHandles(d3.select(this)); });

      const annotationText = annotationGroup.append('text')
        .attr('x', middleWordX - 0)
        .attr('y', currentY)
        .attr('class', 'annotation-text-class')
        .style('fill', darkenColor(`#${color}`))
        .style('font-size', '14px')
        .style('pointer-events', 'none'); // Add this line

      annotationLines.forEach((line, index) => {
        annotationText.append('tspan')
          .text(line)
          .attr('x', middleWordX - 0)
          .attr('dy', index === 0 ? 0 : lineHeight);
      });
      const padding = 5;

      const bbox = getPaddedBBox(annotationText.node(), padding);

      const newCoords = findNonOverlappingRegion(plot, middleWordX, currentY, bbox.width, bbox.height, lineHeight, padding, annotationText.node());

      annotationText.attr('x', newCoords.x).attr('y', newCoords.y);

      // Update the x attribute for each tspan inside annotationText
      annotationText.selectAll('tspan').attr('x', newCoords.x);



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

      const liney1 = currentY < closestCenter.y ? currentY + 5 : currentY > closestCenter.y ? currentY - 14 : currentY;

      const line = annotationGroup.append('line')
        .attr('x1', middleWordX - 0)
        .attr('y1', liney1)
        .attr('x2', closestCenter.x)
        .attr('y2', closestCenter.y)
        .attr('stroke', darkenColor(`#${color}`))
        .attr('stroke-width', 1.5);


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
        .attr('class', 'drag-handle draggable')
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
        .attr('class', 'drag-handle draggable')
        .attr('cx', middleWordX - 0)
        .attr('cy', liney1)
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
  // const data = [{
  //   id: 1,
  //   annotationLines: ["sss", "sd"],
  //   color: "#ddedea",
  //   currentY: 60,
  //   middleWordX: 19.55963134765625
  // }];

  // // Define the annotation object
  // const annotationx = d3.annotation()
  //   .type(d3.annotationLabel)
  //   .annotations(data.map(d => ({
  //     note: {
  //       label: `${d.annotationLines.join("<br>")}` // Use line breaks to separate text lines
  //     },
  //     color: d.color,
  //     x: d.middleWordX,
  //     y: d.currentY,
  //     dy: -25, // Offset the label so it doesn't overlap the point
  //     dx: -25,
  //     subject: {
  //       radius: 10, // Set the size of the circle around the point
  //       radiusPadding: 5,
  //     },
  //     connector: {
  //       type: "curve",
  //       curve: d3.curveBasis,
  //       end: "dot",
  //       lineType: "horizontal",
  //       style: {
  //         stroke: d.color,
  //         "stroke-width": 1,
  //         "stroke-dasharray": "2 2",
  //       }
  //     }
  //   })));



  // // Call the annotation function to display the annotation
  // plot.append("g")
  //   .attr("class", "annotation-group")
  //   .call(annotationx);

  // annotationx.update();


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


  addDownloadButton(canvas, visualizationid);
  // console.log((plotBBox.width + padding * 2)/width);
  return (plotBBox.width + padding * 2) / width;
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



function addDownloadButton(svg, visualizationid) {
  //console.log("Adding download button...");
  const visualizationcontainer = document.getElementById(visualizationid);
  const downloadButton = document.createElement("button");
  downloadButton.className = "download-svg-btn"; // Add the CSS class
  downloadButton.id = visualizationid + "-export-btn";


  // Add the SVG download icon
  downloadButton.innerHTML = `
  <i class="fas fa-file-download"></i>`;

  downloadButton.onclick = () => {
    //console.log("Download button clicked...");
    downloadVisualization(svg);
  };
  visualizationcontainer.appendChild(downloadButton);
}

function addDownloadCombinedButton(visualizationid, subvistoadd, num = 2) {
  //console.log("Adding download button...");
  const subvistoaddcontainer = document.getElementById(subvistoadd);
  const downloadButton = document.createElement("button");
  downloadButton.className = "download-svg-combined-btn"; // Add the CSS class
  downloadButton.id = visualizationid + "-combined-export-btn";
  let outheight = num * 670;

  // Add the SVG download icon
  if (num == 2) {
    downloadButton.innerHTML = `
  <i class="fas fa-file-download"></i><i class="fas fa-plus"></i><i class="fas fa-file-download"></i>`;
  }
  else if (num == 3) {
    downloadButton.innerHTML = `
  <i class="fas fa-file-download"></i><i class="fas fa-plus"></i><i class="fas fa-file-download"></i><i class="fas fa-plus"></i><i class="fas fa-file-download"></i>`;
  }
  downloadButton.onclick = () => {
    //console.log("Download button clicked...");
    downloadCombinedVisualizations(visualizationid);
  };
  subvistoaddcontainer.appendChild(downloadButton);
}

function downloadVisualization(svg) {
  //console.log("Downloading visualization...");

  // Clone the original SVG element
  const clonedSVG = svg.node().cloneNode(true);

  // Include the styles in the cloned SVG
  includeStyles(clonedSVG);

  // Update the viewBox attribute based on the bounding box of the SVG content
  const bbox = getSVGContentBoundingBox(svg);
  clonedSVG.setAttribute('viewBox', `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`);

  // Serialize the cloned SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSVG);
  const svgDataURL = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));

  // Get the width and height from the SVG's viewBox attribute
  const viewBox = clonedSVG.getAttribute('viewBox').split(' ').map(parseFloat);
  const width = viewBox[2];
  const height = viewBox[3];

  // Calculate the aspect ratio
  const aspectRatio = width / height;

  // Set the canvas width and height based on the desired output size while preserving the aspect ratio
  const outputWidth = 1200;
  const outputHeight = outputWidth / aspectRatio;

  // Create an image element and set its source to the SVG data URL
  const img = new Image();
  img.src = svgDataURL;

  // Set up a canvas and draw the image on it
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const ctx = canvas.getContext("2d");
  //   ctx.fillStyle = "#fffcf5";
  // ctx.fillRect(0, 0, outputWidth, outputHeight);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Convert the canvas to a PNG data URL and download it
    const pngDataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngDataURL;
    link.download = "visualization.png";
    link.click();
    //console.log("Download should have started...");
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

function getSVGContentBoundingBox(svg) {
  const content = svg.select('g').node().parentNode; // Select the parent node of the outermost 'g' element
  const bbox = content.getBBox();
  return bbox;
}


function downloadCombinedVisualizations(visualizationid) {
  const vizcont = document.getElementById(visualizationid);
  const subvisualizations = Array.from(vizcont.querySelectorAll(".subvisualization"));
  const outputWidth = 600;
  const totalHeight = subvisualizations.length * 335;
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d");
  let currentHeight = 0;
  subvisualizations.forEach((subviz, index) => {
    const svg = subviz.querySelector("svg");
    const clonedSVG = svg.cloneNode(true);
    //includeStyles(clonedSVG);

    const clientWidth = svg.clientWidth;
    const clientHeight = svg.clientHeight;
    const scaleup = outputWidth / clientWidth;
    const outputHeight = clientHeight * scaleup;

    //     const g = clonedSVG.querySelector("g");
    //     const gTransform = g.getAttribute("transform");
    //     const gScale = gTransform.match(/scale\(([^)]+)\)/);
    //     const newGScale = gScale ? parseFloat(gScale[1]) * scaleup : scaleup;
    //     const newGTransform = gTransform.replace(/scale\([^)]+\)/, `scale(${newGScale})`);

    //     // Update the translate values
    //     const gTranslate = gTransform.match(/translate\(([^)]+)\)/);
    //     if (gTranslate) {
    //       const [translateX, translateY] = gTranslate[1].split(',').map(parseFloat);
    //       const newTranslateX = (translateX + (clientWidth / 2)) * scaleup - (outputWidth / 2);
    // const newTranslateY = (translateY + (clientHeight / 2)) * scaleup - (outputHeight / 2);

    //       const newGTranslate = `translate(${newTranslateX},${newTranslateY})`;
    //       g.setAttribute("transform", newGTransform.replace(gTranslate[0], newGTranslate));
    //     } else {
    //       g.setAttribute("transform", newGTransform);
    //     }

    clonedSVG.setAttribute('width', outputWidth);
    clonedSVG.setAttribute('height', outputHeight);
    console.log(clonedSVG);

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, currentHeight, outputWidth, outputHeight);
      currentHeight += outputHeight;
      if (index === subvisualizations.length - 1) {
        const pngDataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = pngDataURL;
        link.download = "combined_visualization.png";
        link.click();
      }
    };
    img.onerror = (error) => {
      console.error(`Error loading image ${index}:`, error);
    };
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSVG);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const svgBlobURL = URL.createObjectURL(svgBlob);
    img.src = svgBlobURL;
  });
}
