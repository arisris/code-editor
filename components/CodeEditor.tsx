import { Fragment, useEffect, useRef, useState } from "react";
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
          style={style}
          className={clsx(
            "p-4 outline-none focus:border-none focus:outline-none !bg-transparent",
            className,
            clazz
          )}
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
