import clsx from "clsx";
import { EventHandler, MouseEventHandler, useCallback, useState } from "react";
import CloseIcon from "@heroicons/react/outline/esm/XIcon";
import CodeIcon from "@heroicons/react/outline/esm/CodeIcon";

interface EditorTabsItem {
  title: string;
}

interface EditorTabsProps {
  tabs: EditorTabsItem[];
  activeTab?: number;
  onClick?: (e: any) => void;
}

export function EditorTabs({
  tabs,
  onClick,
  activeTab: initialTabIndex = 0
}: EditorTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTabIndex || 0);
  const handleClick = (t: number) =>
    useCallback<MouseEventHandler<HTMLButtonElement>>(
      (event) => {
        event.preventDefault();
        setActiveTab(t);
        if (typeof onClick === "function") {
          onClick(t);
        }
      },
      [activeTab]
    );
  return (
    <div className="flex gap-[1px] text-sm overflow-x-auto">
      {tabs.map((tab, key) => {
        return (
          <button
            key={key}
            type="button"
            onClick={handleClick(key)}
            className={clsx(
              "flex gap-2 items-center py-2 px-2.5 bg-gray-200 dark:bg-gray-800",
              activeTab === key ? "bg-opacity-30 dark:bg-opacity-30" : "bg-opacity-80 dark:bg-opacity-80"
            )}
          >
            <CodeIcon width={14} height={14} className="text-blue-500" />
            <span>{tab.title}</span>
            <CloseIcon
              width={14}
              height={14}
              className={clsx(
                "transition-opacity opacity-0 hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-600"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
