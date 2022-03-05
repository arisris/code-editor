import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { HiCog, HiKey, HiMenu, HiMoon, HiSun } from "react-icons/hi";
import { Transition } from "@headlessui/react";
import { useTheme } from "next-themes";

type EditorLayoutProps = PropsWithChildren<{
  title?: string;
  description?: string;
}>;

function EditorLayout(props: EditorLayoutProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const [treeMenuOpened, setTreeMenuOpened] = useState(true);
  const toggleMenu = useCallback(
    () => setTreeMenuOpened(!treeMenuOpened),
    [treeMenuOpened]
  );
  useEffect(() => setMounted(true), []);
  return (
    <div className="absolute inset-0 flex flex-col justify-between overflow-hidden">
      <div className="fixed inset-x-0 top-0 flex justify-between items-center shadow-md dark:bg-gray-800 h-[7vh] lg:px-2">
        <div>
          <button
            type="button"
            className="p-2 rounded-md block hover:bg-gray-100 dark:hover:bg-gray-900"
            title="Toggle Menu"
            onClick={toggleMenu}
          >
            <HiMenu size={24} />
          </button>
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-md block hover:bg-gray-100 dark:hover:bg-gray-900"
            title="Settings"
          >
            <HiCog size={24} />
          </button>
          <button
            type="button"
            className="p-2 rounded-md block hover:bg-gray-100 dark:hover:bg-gray-900"
            title="Toggle DarkMode"
            onClick={(e) => {
              e.preventDefault();
              theme.setTheme(theme.resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            {mounted &&
              (theme.resolvedTheme === "dark" ? (
                <HiSun size={24} />
              ) : (
                <HiMoon size={24} />
              ))}
          </button>
        </div>
      </div>
      <div className="relative flex-auto flex max-w-full h-[92vh] mt-[7vh] transition-all duration-300">
        <Transition
          appear
          show={treeMenuOpened}
          enter="transition-transform ease-out duration-150"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition-transform ease-in duration-150"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
          className="absolute inset-y-0 lg:relative lg:inset-auto w-[70vw] lg:w-[20vw] bg-gray-100 dark:bg-gray-800 shadow-md"
        >
          <div className="p-1"></div>
        </Transition>
        <div className="flex flex-col lg:flex-row h-full w-full divide-y-2 lg:divide-y-0 lg:divide-x-2 dark:divide-gray-700">
          <div className="w-full overflow-y-auto text-xs shadow scrollbar-styled">
            {props.children}
          </div>
          <div className="w-full overflow-y-auto text-xs shadow scrollbar-styled">
            {props.children}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 inset-x-0 h-[3vh] flex justify-between shadow-md bg-gray-300 dark:bg-gray-800"></div>
    </div>
  );
}

export default EditorLayout;
