// @ts-nocheck
import { useExternal } from "ahooks";
import { DOMElement, useEffect, useState } from "react";
import { useLoadScript } from "./useLoadScript";

export const useAceEditor = ({
  el,
  mode,
  theme = "light",
  value = "Insert Text",
}: {
  el: DOMElement | string | HTMLElement,
  mode: "javascript" | "css" | "html" | "json",
  value?: string,
  theme?: "light" | "dark"
}) => {
  const [editor, setEditor] = useState<any>(null);
  const [coreLoaded, setCoreLoaded] = useState(false)
  const { loaded, loader } = useLoadScript({
    scripts: [{
      path: "https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-min/ace.js", callback: (e) => {
        if (window.ace) {
          setCoreLoaded(true)
        }
      }
    }]
  });
  useEffect(() => {
    if (!loaded) return;
    setEditor(window.ace.edit(el, {
      selectionStyle: "line",
      showPrintMargin: false,
      fontSize: "14px"
    }))
    return () => {
      if (editor) {
        editor.destroy();
        setEditor(null);
      }
    }
  }, [loaded, el]);

  useEffect(() => {
    if (!coreLoaded && !editor) return;
    loader.addScript("https://cdn.jsdelivr.net/npm/ace-builds@1.4.14/src-min/ext-emmet.js").unload().initialize(() => {
      if (editor) editor.setOption("enableEmmet", true)
    })
  }, [coreLoaded, editor])

  useEffect(() => {
    if (!editor) return;
    editor.session.setMode(`ace/mode/${mode}`);
  }, [editor, mode]);

  useEffect(() => {
    if (!editor) return;
    if (editor.getValue() !== value) {
      editor.setValue(value);
      editor.gotoLine(value.length)
    }
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setTheme(`ace/theme/${theme === "dark" ? "one_dark" : "xcode"}`)
  }, [editor, theme]);

  return { editor }
}

if (module.hot) {
  module.hot.accept(() => {
    location.reload();
  })
}