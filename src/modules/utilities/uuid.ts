export default function uuid(length = 10) {
  let uuid = '';

  do {
    const random = Math.random() * 16 | 0;
    uuid += (uuid.length == 12 ? 4 : (uuid.length == 16 ? (random & 3 | 8) : random)).toString(16);
  } while (uuid.length < length);

  return uuid;
};