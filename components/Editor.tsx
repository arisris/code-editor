import {
  CSSProperties,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import HiCogIcon from "@heroicons/react/outline/esm/CogIcon";
import HiPlayIcon from "@heroicons/react/outline/esm/PlayIcon";
import HiMenuIcon from "@heroicons/react/outline/esm/MenuIcon";
import HiMoonIcon from "@heroicons/react/outline/esm/MoonIcon";
import HiSunIcon from "@heroicons/react/outline/esm/SunIcon";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { noopFn } from "lib/utils";
import { useModal } from "hooks/useModal";
import Split from "components/Split";
import { useSize } from "ahooks";
import { FileTrees } from "./TreeList";
import { EditorTabs } from "./EditorTabs";

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
  cols?: JSX.Element[];
}>;

function Editor({ children, cols = [] }: EditorLayoutProps) {
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
            icon={<HiMenuIcon width={24} height={24} />}
            title="Toggle Menu"
            onClick={toggleMenu}
            className="lg:hidden"
          />
          <h1 className="text-2xl font-bold bg-gradient-to-t from-blue-900 to-blue-400 bg-clip-text text-transparent text-justify">
            Code Editor
          </h1>
        </div>
        <div className="inline-flex items-center gap-2">
          <MenuIcon
            icon={<HiPlayIcon width={24} height={24} />}
            title="Run Bundler"
          />
          <MenuIcon
            icon={<HiCogIcon width={24} height={24} />}
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
                <HiSunIcon width={24} height={24} />
              ) : (
                <HiMoonIcon width={24} height={24} />
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
        className="relative flex-auto flex max-w-full min-h-[1vh] mt-[7vh] min-w-full"
        lineBar={isLarge}
        disable={!isLarge}
      >
        <div
          className={clsx(
            "lg:block absolute inset-y-0 z-50 lg:z-auto lg:relative lg:inset-auto w-[250px] lg:3/12 bg-gray-100 dark:bg-gray-800 shadow-md",
            treeMenuOpened ? "block" : "hidden"
          )}
        >
          <div className="py-2 px-4 border-b dark:border-gray-600">Top</div>
          <div className="mt-2 overflow-auto max-h-[80vh] scrollbar-styled">
            {mounted && <FileTrees />}
          </div>
        </div>
        <Split
          mode={isLarge ? "horizontal" : "vertical"}
          className={clsx("mb-8", isLarge ? "w-full" : "min-w-full")}
        >
          {cols.map((child, key, arr) => {
            const style: CSSProperties = {
              width: isLarge ? `${100 / arr.length}%` : "100%",
              height: isLarge ? "100%" : `${100 / arr.length}%`
            };
            return (
              <div style={style} key={key}>
                <EditorTabs
                  tabs={[
                    { title: "Hello.ts" },
                    { title: "my.js" },
                    { title: "adasdasdas.js" },
                    { title: "fdfdfdf.js" },
                    { title: "erere55.js" }
                  ]}
                />
                <div
                  className={clsx(
                    "relative flex-auto overflow-auto text-xs shadow w-full h-[90%]"
                  )}
                >
                  {child}
                </div>
                <div className="z-10 bottom-0 inset-x-0 px-2 py-2 flex justify-between items-center shadow-md bg-gray-300 dark:bg-gray-900">
                  <div>Left bottom</div>
                  <div>Right bottom</div>
                </div>
              </div>
            );
          })}
        </Split>
      </Split>
    </div>
  );
}

export default Editor;
