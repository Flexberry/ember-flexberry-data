/**
 * @return { String } a combination of timestamp and 5 random digits
 */
export default function generateUniqueId(prefix) {
  prefix = prefix || 'flexberry';
  let time = (new Date()).getTime();
  let randomFiveDigits = Math.random().toFixed(5).slice(2);
  return [prefix, time, randomFiveDigits].join('-');
}
