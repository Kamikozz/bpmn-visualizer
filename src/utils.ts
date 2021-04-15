const incrementId = () => {
  let id = -1;
  return (prefix: string = '') => `${prefix}${id += 1}`;
};
export const getId = incrementId();
