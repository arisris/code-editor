import { PropsWithChildren } from "react";

type LayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

function Layout(props: LayoutProps) {
  return <div>{props.children}</div>;
}

export default Layout;
