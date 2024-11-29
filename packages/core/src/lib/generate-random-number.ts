export const generateRandomNumber = (len: number)  => {
    let min: number = Number.parseInt("1".padEnd(len, '0'));
    let max: number = Number.parseInt("9".padEnd(len, '9'));
    return Math.round((Math.random() * (max - min) + min));
  }