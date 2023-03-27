const lowerLightnessThreshold = 0.5; // You can adjust this value to change the lower lightness constraint
export const upperLightnessThreshold = 0.8; // You can adjust this value to change the upper lightness constraint

const generateRandomColor = () => {
  let randomColor = '#';
  for (let i = 0; i < 6; i++) {
    randomColor += ('0' + Math.floor(Math.random() * 16).toString(16)).slice(-1);
  }
  return randomColor;
};

const isColorUsedInSidebar = (color) => {
  const colorItems = document.querySelectorAll('.sidebar .color-item');
  let isUsed = false;
  const deltaEThreshold = 5; // You can adjust this value to change the sensitivity of the color comparison

  colorItems.forEach((item) => {
    const itemColor = item.style.backgroundColor;
    const deltaE = chroma.deltaE(color, itemColor, 2);
    if (deltaE < deltaEThreshold) {
      isUsed = true;
    }
  });

  return isUsed;
};

// New helper function to get a unique random color not used in the sidebar
export const getUniqueRandomColor = () => {
  let randomColor;
  let lightness;
  do {
    randomColor = generateRandomColor();
    lightness = chroma(randomColor).get('hsl.l');
  } while (
    isColorUsedInSidebar(randomColor) ||
    lightness <= lowerLightnessThreshold || // Avoid colors close to black
    lightness >= upperLightnessThreshold // Avoid colors close to white
  );
  return randomColor;
};
