import React from 'react';

const incrementId = () => {
  let id = 99;
  return (prefix: string = '') => `${prefix}${id += 1}`;
};
export const getId = incrementId();

export type ReactChangeEvent = ((event: React.ChangeEvent<{
  name?: string | undefined;
  value: unknown;
}>, child: React.ReactNode) => void) | undefined;
