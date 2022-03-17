import { useEffect, useState } from "react";

type Scripts = {
  path: string;
  callback?: ScriptsCallback
}
type ScriptsCallback = (p: { error: boolean; message: string }) => void;
export class ExternalLoader {
  private scripts: Scripts[];
  private stylesheets: Scripts[]
  constructor(scripts: Scripts[] = [], stylesheets: Scripts[] = []) {
    this.scripts = scripts;
    this.stylesheets = stylesheets;
  }
  addScript(path: string, callback?: ScriptsCallback) {
    this.scripts.push({ path, callback });
    return this;
  }
  addStylesheet(path: string, callback?: ScriptsCallback) {
    this.stylesheets.push({ path, callback });
    return this;
  }
  initialize(cb: ScriptsCallback): Promise<any> {
    return new Promise((resolve) => {
      const jsentry = [];
      if (this.scripts.length > 0) {
        this.scripts.forEach(script => {
          jsentry.push(this.createScriptTag(script.path)
            .then(() => {
              if (typeof script.callback == "function") {
                script.callback({
                  error: false,
                  message: "Script Loaded"
                });
              }
            })
            .catch((e: Error) => {
              script.callback({
                error: true,
                message: e.message
              });
            })
          );
        });
      }
      const cssentry = [];
      if (this.stylesheets.length > 0) {
        this.stylesheets.forEach(css => {
          cssentry.push(this.createStylesheetTag(css.path)
            .then(() => {
              if (typeof css.callback == "function") {
                css.callback({
                  error: false,
                  message: "Loaded"
                });
              }
            })
            .catch((e: Error) => {
              css.callback({
                error: true,
                message: e.message
              });
            })
          );
        });
      }
      return Promise.all([].concat(jsentry, cssentry))
        .then(resolve)
        .then(() => {
          if (typeof cb == "function") cb({ error: false, message: "Done" });
        })
        .catch((e: Error) => {
          if (typeof cb == "function") cb({ error: true, message: "Fail" });
        })
    });
  }
  unload() {
    this.scripts.forEach(script => {
      document.querySelectorAll(`script[src="${script.path}"]`).forEach(s => s.remove());
    })
    this.stylesheets.forEach(style => {
      document.querySelectorAll(`link[href="${style.path}"]`).forEach(s => s.remove());
    });
    return this;
  }
  protected createStylesheetTag(p: string) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = p;
      link.onerror = function (e) {
        link.onerror = link.onload = null;
        reject(e);
      };

      link.onload = function () {
        link.onerror = link.onload = null;
        resolve(true);
      };

      document.getElementsByTagName('head')[0].appendChild(link);
    });
  }
  protected createScriptTag(p: string) {
    return new Promise((resolve, reject) => {
      const scripts = document.createElement("script");
      scripts.async = true;
      scripts.src = p;
      scripts.type = "text/javascript";
      scripts.onload = () => {
        scripts.onerror = scripts.onload = null;
        resolve("Success loading script " + p);
      };
      scripts.onerror = e => {
        scripts.onerror = scripts.onload = null;
        reject("Got Error while loading script" + p);
      };
      document
        .getElementsByTagName('head')[0]
        .appendChild(scripts);
    });
  }
}

export const useLoadScript = ({
  scripts = [],
  stylesheets = [],
  onReady
}: { scripts: Scripts[], stylesheets: Scripts[], onReady?: ScriptsCallback }) => {
  const [loaded, setLoaded] = useState(false);
  const loader = new ExternalLoader(scripts, stylesheets);

  useEffect(() => {
    loader.initialize((p) => {
      setLoaded(true)
    })
    return () => {
      loader.unload();
      setLoaded(false);
    }
  }, []);
  return { loaded, loader }
}