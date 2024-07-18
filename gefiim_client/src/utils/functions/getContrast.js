const isColorDark = (hexColor) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128; // Valor de referencia para decidir si es oscuro o claro
};

export const textColor = (color) => {
    return color && isColorDark(color) ? '#FFFFFF' : '#000000';
  };