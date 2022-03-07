import { FC, ReactElement, ReactNode } from "react";

export const TreeMenuItem: FC<{
  title?: ReactNode | ReactElement;
  icon?: ReactNode | ReactElement;
  isActive?: boolean;
  className?: string;
}> = (props) => {
  return <li></li>;
};

export const TreeMenu: FC<{
  isSubMenu?: boolean;
}> = (props) => {
  return <ul></ul>;
};
