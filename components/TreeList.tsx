import DocumentTextIcon from "@heroicons/react/outline/esm/DocumentTextIcon";
import ChevronRightIcon from "@heroicons/react/outline/esm/ChevronRightIcon";
import clsx from "clsx";
import { useState } from "react";

type StringOrJSX = string | JSX.Element | JSX.Element[];

export interface TreeListItem {
  title?: StringOrJSX;
  icon?: StringOrJSX;
  active?: boolean;
  onClick?: (e: any) => void;
  items?: TreeListItem[];
}

export function TreeList({ items, ...props }: TreeListItem) {
  const [active, setActive] = useState(props.active ? true : false);
  const hasItems = Array.isArray(items);
  return (
    <div className="relative w-full">
      <button
        onClick={(e) => setActive(!active)}
        className={clsx(
          "flex justify-between text-left w-full py-1 px-4 hover:bg-gray-200 dark:hover:bg-gray-900"
          // {
          //   "bg-gray-200 dark:bg-gray-900 bg-opacity-30 dark:bg-opacity-30": active
          // }
        )}
      >
        <div className="flex items-center gap-2">
          {hasItems ? (
            <ChevronRightIcon
              width={16}
              height={16}
              className={clsx("transition-transform", {
                "rotate-90": active
              })}
            />
          ) : (
            props.icon ?? <DocumentTextIcon width={16} height={16} />
          )}
          <div>{props.title}</div>
        </div>
        <div>*</div>
      </button>
      {hasItems && (
        <div
          className={clsx("pl-1", {
            hidden: !active,
            "flex flex-col border-l-[.1em] border-gray-300 dark:border-gray-500":
              active
          })}
        >
          {items.map((i, k) => (
            <TreeList key={k} {...i} />
          ))}
        </div>
      )}
    </div>
  );
}

const files: TreeListItem[] = [
  {
    title: "public",
    items: []
  },
  {
    title: "src",
    items: [
      {
        title: "components",
        items: [
          {
            title: "Hello",
            items: [
              {
                title: "Hello2",
                items: [
                  {
                    title: "index.tsx"
                  },
                  {
                    title: "aaaa.ts"
                  }
                ]
              },
              {
                title: "index.tsx"
              }
            ]
          }
        ]
      },
      {
        title: "index.tsx"
      }
    ]
  },
  {
    title: "verilong",
    items: Array(20)
      .fill(null)
      .map((_, k) => ({ title: "hello" + k + ".ts" }))
  },
  {
    title: ".gitignore"
  },
  {
    title: "package.json"
  },
  {
    title: "pnpm-lock.yaml"
  }
];

export function FileTrees() {
  return (
    <div className="text-sm">
      {files.map((i, k) => (
        <TreeList key={k} {...i} />
      ))}
    </div>
  );
}
