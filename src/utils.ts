const incrementId = () => {
  let id = 99;
  return (prefix: string = '') => `${prefix}${id += 1}`;
};
export const getId = incrementId();
