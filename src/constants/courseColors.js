
export const Colors = [
  '#e57373',
  '#BA68C8',
  '#81C784',
  '#7986CB',
  '#4FC3F7',
  '#4DB6AC',
  '#DCE775'
];

export const LineColors = [
  '#e53935',
  '#9C27B0',
  '#4CAF50',
  '#3F51B5',
  '#03A9F4',
  '#009688',
  '#CDDC39'
];

let colorsLen = Colors.length;
let lineColorsLen = LineColors.length;

export const getColor = (index) => Colors[index % colorsLen];
export const getLineColor = (index) => LineColors[index % lineColorsLen];
