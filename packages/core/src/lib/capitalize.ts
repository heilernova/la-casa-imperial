/**
 * Coloca la primera letra de cada palabra en mayúscula
 */
export const capitalize = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  }