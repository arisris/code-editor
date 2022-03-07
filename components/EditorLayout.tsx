import {
  Children,
  CSSProperties,
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  PropsWithChildren,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { HiCog, HiKey, HiMenu, HiMoon, HiPlay, HiSun } from "react-icons/hi";
import { Transition } from "@headlessui/react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { noopFn } from "lib/utils";
import { useModal } from "hooks/useModal";
import Split from "components/Split";
import { useSize } from "ahooks";

function MenuIcon(props: {
  className?: string;
  icon?: ReactNode;
  title?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "p-2 rounded-full block focus:transition-transform focus:scale-105 hover:bg-gray-100 dark:hover:bg-gray-900",
        props.className
      )}
      title={props.title || ""}
      onClick={props.onClick || noopFn}
    >
      {props.icon}
    </button>
  );
}

function SettingsModal() {
  return <div>Hiiii</div>;
}

type EditorLayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
  colSize?: number;
}>;

function EditorLayout({ children, title, description }: EditorLayoutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const modal = useModal();
  const [mounted, setMounted] = useState(false);
  const [treeMenuOpened, setTreeMenuOpened] = useState(false);
  const toggleMenu = useCallback(
    () => setTreeMenuOpened(!treeMenuOpened),
    [treeMenuOpened]
  );
  const size = useSize(ref.current);
  const isLarge = useMemo(() => size?.width > 1023, [size]);
  useEffect(() => setMounted(true), []);
  return (
    <div
      ref={ref}
      className="absolute inset-0 flex flex-col justify-between overflow-hidden"
    >
      <div className="fixed inset-x-0 top-0 flex justify-between items-center shadow-md dark:bg-gray-800 h-[7vh] lg:px-2">
        <div className="inline-flex items-center gap-2">
          <MenuIcon
            icon={<HiMenu size={24} />}
            title="Toggle Menu"
            onClick={toggleMenu}
            className="lg:hidden"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-t from-blue-900 to-blue-400 bg-clip-text text-transparent text-justify">
            Code Editor
          </h1>
        </div>
        <div className="inline-flex items-center gap-2">
          <MenuIcon icon={<HiPlay size={24} />} title="Run Bundler" />
          <MenuIcon
            icon={<HiCog size={24} />}
            title="Editor Settings"
            onClick={() => {
              modal.create(<SettingsModal />);
            }}
          />
          <MenuIcon
            title="Toggle Dark Mode"
            icon={
              mounted &&
              (theme.resolvedTheme === "dark" ? (
                <HiSun size={24} />
              ) : (
                <HiMoon size={24} />
              ))
            }
            onClick={(e) => {
              e.preventDefault();
              theme.setTheme(theme.resolvedTheme === "dark" ? "light" : "dark");
            }}
          />
        </div>
      </div>
      <Split
        className="relative flex-auto flex max-w-full h-[92vh] mt-[7vh] min-w-full"
        lineBar={isLarge}
        disable={!isLarge}
      >
        <div
          className={clsx(
            "lg:block absolute inset-y-0 z-50 lg:z-auto lg:relative lg:inset-auto w-[250px] lg:3/12 bg-gray-100 dark:bg-gray-800 shadow-md",
            treeMenuOpened ? "block" : "hidden"
          )}
        >
          <div className="p-1"></div>
        </div>
        <Split
          mode={isLarge ? "horizontal" : "vertical"}
          className={clsx(isLarge ? "w-full" : "min-w-full")}
        >
          {Children.toArray(children).map((child, key, arr) => {
            const style: CSSProperties = {
              width: isLarge ? `${100 / arr.length}%` : "100%",
              height: isLarge ? "100%" : `${100 / arr.length}%`
            };
            return (
              <div
                key={key}
                className={clsx(
                  "flex-auto overflow-y-auto text-xs shadow scrollbar-styled"
                )}
                style={style}
              >
                {child}
              </div>
            );
          })}
          {/* <div
            className={clsx(
              "flex-auto overflow-y-auto text-xs shadow scrollbar-styled"
            )}
            style={{
              width: isLarge ? "50%" : "100%",
              height: isLarge ? "100%" : "50%"
            }}
          >
            {children}
          </div> */}
        </Split>
      </Split>
      <div className="fixed z-10 bottom-0 inset-x-0 h-[3vh] flex justify-between shadow-md bg-gray-300 dark:bg-gray-800"></div>
    </div>
  );
}

export default EditorLayout;
