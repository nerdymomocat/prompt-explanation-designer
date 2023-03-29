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

	// Helper function to draw annotation lines and text
	function drawAnnotation(x, y, textLength, annotationText, color, isStrikethrough) {
		const minLineLength = 50;
		const textMargin = 10;
		const lineStartY = isStrikethrough ? y : y - 7;
		const upEndY = lineStartY - minLineLength;
		const downEndY = lineStartY + minLineLength;

		const computeBoundingBox = (direction) => {
			const testY = direction === "up" ? upEndY - textMargin : downEndY + textMargin;
			const testX = x + textLength / 2;

			const textNode = plotGroup
				.append("text")
				.attr("x", testX)
				.attr("y", testY)
				.classed("annotation-text", true)
				.style("fill", invertLightness(color));

			const lines = annotationText.split('\n');
			lines.forEach((lineText, i) => {
				textNode
					.append('tspan')
					.attr('x', testX)
					.attr('dy', i === 0 ? 0 : '1.2em')
					.text(lineText);
			});

			const bbox = textNode.node().getBBox();
			textNode.remove();
			return {
				x: bbox.x,
				y: bbox.y,
				width: bbox.width,
				height: bbox.height,
			};
		};

		const hasOverlap = (newBBox) => {
			const overlaps = plotGroup.selectAll(".annotation-text, .text-node").filter(function() {
				const existingBBox = this.getBBox();
				return (
					newBBox.x < existingBBox.x + existingBBox.width &&
					newBBox.x + newBBox.width > existingBBox.x &&
					newBBox.y < existingBBox.y + existingBBox.height &&
					newBBox.y + newBBox.height > existingBBox.y
				);
			});
			return !overlaps.empty();
		};

		const newBBoxUp = computeBoundingBox("up");
		const newBBoxDown = computeBoundingBox("down");
		const direction = hasOverlap(newBBoxUp) ? "down" : "up";
		const adjustedLineEndY = direction === "up" ? upEndY : downEndY;
		const bbox = direction === "up" ? newBBoxUp : newBBoxDown;
		const lineStartYAdjusted = direction === "up" ? y - bbox.height / 2 : y;

		const annotationLine = plotGroup
			.append("line")
			.attr("x1", x + textLength / 2)
			.attr("y1", lineStartYAdjusted)
			.attr("x2", x + textLength / 2)
			.attr("y2", adjustedLineEndY)
			.style("stroke", invertLightness(color));

		const circleX = x + textLength / 2;
		const circleY = adjustedLineEndY;

		const annotationCircle = plotGroup
			.append("circle")
			.attr("cx", circleX)
			.attr("cy", circleY)
			.attr("r", 3)
			.style("fill", invertLightness(color));

		const annotationTextElement = plotGroup
			.append("text")
			.attr("x", x + textLength / 2)
			.attr("y", direction === "up" ? circleY - bbox.height - textMargin : circleY + textMargin + bbox.height)
			.classed("annotation-text", true)
			.style("fill", invertLightness(color));

		const lines = annotationText.split('\n');
		lines.forEach((lineText, i) => {
			annotationTextElement
				.append('tspan')
				.attr('x', x + textLength / 2)
				.attr('dy', i === 0 ? 0 : '1.2em')
				.text(lineText);
		});
	}

	function processTextNode(textNode, x, y, parentClassList, annotationText) {
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

					// Call drawAnnotation function for color-highlight-* case
					drawAnnotation(x, y, textLength, annotationText, `#${className.substring(16)}`);
					text.raise();

				} else if (className.startsWith("strikethrough-")) {
					const strikethroughGroup = plotGroup.append("g").classed("strikethrough-group", true);

					const line = strikethroughGroup
						.append("line")
						.attr("x1", x)
						.attr("y1", y - 7)
						.attr("x2", x + textLength)
						.attr("y2", y - 7)
						.classed("strikethrough", true)
						.style("stroke", `#${className.substring(14)}`)
						.style("stroke-width", "2"); // Increase the thickness of the strikethrough line

					// Modify the text styling to make it italic and mid-grey when a strikethrough is applied
					text.style("font-style", "italic").style("fill", "#D3D3D3").style("font-size", "16px"); // Mid-grey: #808080

					// Call drawAnnotation function for strikethrough-* case
					drawAnnotation(x, y, textLength, annotationText, `#${className.substring(14)}`);

					// Raise the text node to be above all the annotations except for the strikethrough line
					text.raise();

					// Raise the strikethrough group above the text nodes
					strikethroughGroup.raise();
				}
			});
		}

		return text.node().getComputedTextLength();
	}

	function processChildNode(childNode, x, y, classNames) {
		//console.log(classNames);
		if (childNode.nodeType === Node.TEXT_NODE) {
			const annotationText = getAnnotationText(classNames);
			return processTextNode(childNode, x, y, classNames, annotationText) + 10;
		}
		return 0;
	}

	// Iterate through the parsed HTML children
	parsedHtml.body.childNodes.forEach((child) => {
		if (child.nodeType === Node.TEXT_NODE) {
			x += processChildNode(child, x, y);
		} else {
			const classNames = child.classList;
			child.childNodes.forEach((childNode) => {
				x += processChildNode(childNode, x, y, classNames);
			});
		}
	});

	const bbox = plotGroup.node().getBBox();
	const centerX = (600 - bbox.width) / 2 - bbox.x;
	const centerY = (335 - bbox.height) / 2 - bbox.y;
	plotGroup.attr("transform", `translate(${centerX}, ${centerY})`);

	console.log("SVG contents:", svg.node().outerHTML);
	console.log("Bounding box:", bbox);

	document.addEventListener("DOMContentLoaded", () => {
		const hiddenTrigger = document.getElementById("hiddenTrigger");
		hiddenTrigger.textContent = Math.random();
	});
	addDownloadButton(svg);

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
