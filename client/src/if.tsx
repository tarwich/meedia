import { Fragment, FunctionComponent, ReactNode } from 'react';

export const If: FunctionComponent<{
  condition: any;
  children: ReactNode;
}> = ({ condition, children }) => {
  return <Fragment>{condition ? children : null}</Fragment>;
};
