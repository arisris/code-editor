import { CodeEditor } from "components/CodeEditor";
import EditorLayout from "components/EditorLayout";
import { useTheme } from "next-themes";
import dracula from "prism-react-renderer/themes/dracula";
import github from "prism-react-renderer/themes/github";
import { useEffect, useState } from "react";

const example = `import { Fragment, useEffect, useRef, useState } from "react";
import Highlight, {
  defaultProps,
  Language,
  Prism,
  PrismTheme
} from "prism-react-renderer";
import { useEditable, Options, Position } from "use-editable";
import clsx from "clsx";
import filename2prism from "filename2prism";

const detectLangByFilename = (filename: string): Language => {
  const keys = Object.keys(Prism.languages);
  const langs = filename2prism(filename);
  if (langs.length && keys.findIndex((i) => langs.indexOf(i) !== -1)) {
    return langs[0] as Language;
  }
  // default to markup
  return "markup";
};

interface Props extends Options {
  code?: string;
  filename?: string;
  onChange?: (code: string, pos: Position) => void;
  className?: string;
  theme?: PrismTheme;
}

export function CodeEditor({
  onChange,
  code,
  indentation = 2,
  disabled = false,
  filename = "",
  theme,
  className,
  ...props
}: Props) {
  const ref = useRef<HTMLPreElement>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEditable(
    ref,
    (code, pos) => {
      code = code.slice(0, -1);
      onChange && onChange(code, pos);
    },
    {
      disabled,
      indentation
    }
  );
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={code}
      language={detectLangByFilename(filename)}
    >
      {({ className: clazz, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={clsx(
            clazz,
            "ring-1 focus:ring-2 focus:outline-none transition-all duration-300",
            className
          )}
          style={style}
          ref={ref}
        >
          {tokens.map((line, i) => (
            <Fragment key={i}>
              {line
                .filter((token) => !token.empty)
                .map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              {mounted ? "\n" : ""}
            </Fragment>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
`;

export default function Page({ latestUpdatedRepos }) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <EditorLayout>
      <CodeEditor
        code={example}
        filename="file.tsx"
        theme={mounted && theme.resolvedTheme === "dark" ? dracula : github}
      />
      <CodeEditor
        code={`console.error(new Error("Blah blah.))`}
        filename="file.tsx"
        theme={mounted && theme.resolvedTheme === "dark" ? dracula : github}
      />
    </EditorLayout>
  );
}
