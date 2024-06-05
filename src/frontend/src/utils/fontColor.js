export function isLightColor(color) {
    const namedColors = {
      black: '#000000',
      white: '#ffffff',
      red: '#ff0000',
      green: '#008000',
      blue: '#0000ff',
      // Add more named colors as needed
    };
  
    if (namedColors[color.toLowerCase()]) {
      color = namedColors[color.toLowerCase()];
    }
  
    let c_r, c_g, c_b;
  
    if (color.startsWith('rgb')) {
      const rgbValues = color.match(/\d+/g);
      c_r = parseInt(rgbValues[0], 10);
      c_g = parseInt(rgbValues[1], 10);
      c_b = parseInt(rgbValues[2], 10);
    } else {
      const hex = color.replace('#', '');
      c_r = parseInt(hex.substring(0, 2), 16);
      c_g = parseInt(hex.substring(2, 4), 16);
      c_b = parseInt(hex.substring(4, 6), 16);
    }
  
    const brightness = (c_r * 299 + c_g * 587 + c_b * 114) / 1000;
    return brightness > 155;
  }