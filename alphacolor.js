function LightenDarkenColor(col, amt) {
  // Negative values make the color lighter
  var usePound = false;
  if (col[0] == "#") {
      col = col.slice(1);
      usePound = true;
  }

  var num = parseInt(col,16);

  var r = (num >> 16) *(1 - amt/100);
   
  if (r > 255) r = 255;
  else if  (r < 0) r = 0;
  
  var g = ((num >> 8) & 0x00FF)*(1 - amt/100) ;

  if (g > 255) g = 255;
  else if  (g < 0) g = 0;

  var b = (num & 0x0000FF)*(1 - amt/100) ;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;
  return (usePound?"#":"") + (b | (g << 8) | (r << 16)).toString(16).padStart(6, '0');

}