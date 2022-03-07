import {
  initialize,
  build,
  Plugin,
  Format,
  OnLoadResult,
  PluginBuild
} from "esbuild-wasm";
import { useEffect, useState } from "react";
import { canUseWindow } from "lib/utils";
import path from "path";
import localforage from "localforage";
import { createFsFromVolume, Volume } from "memfs";

const fileCache = localforage.createInstance({
  name: "esbuild-resolved-modules"
});
const builtinModules = [
  "assert",
  "async_hooks",
  "buffer",
  "child_process",
  "cluster",
  "console",
  "constants",
  "crypto",
  "dgram",
  "dns",
  "domain",
  "events",
  "fs",
  "http",
  "http2",
  "https",
  "inspector",
  "module",
  "net",
  "os",
  "path",
  "perf_hooks",
  "process",
  "punycode",
  "querystring",
  "readline",
  "repl",
  "stream",
  "string_decoder",
  "timers",
  "tls",
  "trace_events",
  "tty",
  "url",
  "util",
  "v8",
  "vm",
  "wasi",
  "worker_threads",
  "zlib"
];
const cdnUrl = "https://cdn.skypack.dev";
const makeResolveDir = (url: string) =>
  path.normalize(new URL(`./`, `${url}`).pathname);

const vfsPlugin = ({
  files
}: {
  files: Record<string, any>;
}): Plugin => {
  const vol = new Volume();
  vol.fromJSON(files);
  const fs = createFsFromVolume(vol);
  const filter = /^(\.\/)|(.\/)/i;
  return {
    name: "vfs-plugin",
    setup(build) {
      build.onResolve({ filter }, async (args) => {
        if (args.namespace === "cdn-url") return;
        return { path: args.path, namespace: "vfs" };
      });
      build.onLoad({ filter, namespace: "vfs" }, async (args) => {
        if (fs.existsSync(args.path)) {
          return {
            contents: fs.readFileSync(args.path, "utf-8"),
            resolveDir: path.dirname(args.path)
          };
        }
      });
    }
  };
};
const fetchPlugin = () => {
  return {
    name: "fetch-plugin",
    setup(build: PluginBuild) {
      build.onResolve({ filter: /.*/ }, (args) => {
        if (builtinModules.findIndex((i) => i === args.path) === -1) {
          return {
            namespace: "cdn-url",
            path: `${cdnUrl}${path.normalize(`/${args.path}`)}`
          };
        }
        return {
          external: true,
          path: args.path,
          namespace: "builtin-modules"
        };
      });
      build.onLoad({ filter: /.*/, namespace: "cdn-url" }, async (args) => {
        const cachedResult = await fileCache.getItem<OnLoadResult>(args.path);
        if (cachedResult) return cachedResult;
      });

      // build.onLoad({ filter: /.css$/, namespace: "cdn-url" }, async (args) => {
      //   const fetcher = await fetch(args.path);
      //   const text = await fetcher.text();
      //   const escaped = text
      //     .replace(/\n/g, "")
      //     .replace(/"/g, '\\"')
      //     .replace(/'/g, "\\'");
      //   const contents = `
      //     const style = document.createElement('style');
      //     style.innerText = '${escaped}';
      //     document.head.appendChild(style);
      //   `;
      //   const result: esbuild.OnLoadResult = {
      //     loader: "jsx",
      //     contents,
      //     resolveDir: makeResolveDir(fetcher.url)
      //   };
      //   await fileCache.setItem(args.path, result);
      //   return result;
      // });

      build.onLoad({ filter: /.*/, namespace: "cdn-url" }, async (args) => {
        const fetcher = await fetch(args.path);
        let contents = await fetcher.text();
        const result: OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: makeResolveDir(fetcher.url)
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    }
  };
};

type BuildOptionsExt = Partial<{
  define: Record<string, any>;
  jsxFactory: string;
  jsxFragment: string;
  plugins: Plugin[];
  minify?: boolean;
  treeShaking?: boolean;
  format?: Format;
}>;
export function useEsBuild(customWasmURL?: string) {
  const [initialized, setInitialized] = useState(false);
  const initializeEsBuild = () => {
    if (initialized) return;
    try {
      initialize({
        wasmURL: customWasmURL || "/esbuild.wasm"
      }).then(() => {
        setInitialized(true);
      });
    } catch (e) {
      // sometime error if hot reload triggered but no problem
      console.log(e.message);
      setInitialized(true);
    }
  };
  useEffect(() => initializeEsBuild(), []);
  const createBundle = async ({
    files,
    main,
    options
  }: {
    files?: Record<string, string>;
    main?: string;
    options?: BuildOptionsExt;
  }): Promise<{ code: string; err: string }> => {
    if (!canUseWindow())
      throw new Error(
        "Build only works on browser. cannot used in server runtime eg: Node"
      );
    if (!initialized) throw new Error("Esbuild Is Not Initialized");
    if (!files)
      files = {
        "./main.js": `console.log("Hello World: This is Example");`
      };
    if (!main) main = "./main.js";
    if (!options) options = {};
    try {
      const result = await build({
        entryPoints: [main || "./main.js"],
        watch: false,
        bundle: true,
        write: false,
        format: options.format || "esm",
        treeShaking: options.treeShaking || false,
        minify: options.minify || false,
        plugins: [
          vfsPlugin({ files }),
          fetchPlugin(),
          ...(options.plugins || [])
        ],
        define: {
          "process.env.NODE_ENV": '"production"',
          global: "window",
          ...(options.define || {})
        },
        jsxFactory: options.jsxFactory || "_React.createElement",
        jsxFragment: options.jsxFragment || "_React.Fragment"
      });

      return {
        code: result.outputFiles[0].text,
        err: ""
      };
    } catch (err) {
      return {
        code: "",
        err: err.message
      };
    }
  };
  return {
    createBundle,
    supported: canUseWindow("WebAssembly"),
    ready: initialized,
    clearCache: async () => fileCache.clear()
  };
}
