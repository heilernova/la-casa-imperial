
/**
 * Formatea un string para que sea un ruta URL valida, retirando acentos y reemplazado los espacios por guiones (-)
 */
export const generateSlug = (str: string): string => {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/(\s+-\s+)|(-\s+)|(\s+-)|\s+/g, "-");
  }