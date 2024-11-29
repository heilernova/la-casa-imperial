export const isHexadecimal = (value: string, len?: number): boolean => {
    const regex = /^[0-9A-Fa-f]+$/;
    return (!len || value.length === len) && regex.test(value);
};