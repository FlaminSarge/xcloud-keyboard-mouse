const META_IMAGE_PATHS = 'xmc-extension-image-paths';

// Chrome extensions can run content scripts "in the page", but they
// are sandboxed to an 'isolated world', so all variables/window/etc.
// are isolated from the page.
// The only shared thing between the two is the DOM.
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#isolated_world

export function injectInitialScriptFile(file: string) {
  // Runs a script file without Chrome extension content scripts sandboxing
  const s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  s.async = false;
  // https://stackoverflow.com/a/28188390/2359478
  document.documentElement.appendChild(s);
}

export function injectCssFile(file: string) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = file;
  document.head.appendChild(css);
}

export function injectImagePaths(files: string[]) {
  // TODO create a dom node wih string body
  const meta = document.createElement('meta');
  meta.name = META_IMAGE_PATHS;
  meta.content = files.join(',');
  document.head.appendChild(meta);
}

let imagePaths: Record<string, string>;
export function getInjectedImagePaths(): Record<string, string> {
  if (imagePaths) return imagePaths;
  const meta = document.head.querySelector(`meta[name=${META_IMAGE_PATHS}]`);
  if (meta) {
    const content = meta.getAttribute('content');
    if (content) {
      const vals = content.split(',');
      imagePaths = vals.reduce((acc, val) => {
        const exec = /(?<=\/)[^/?#]+(?=[^/]*$)/.exec(val);
        const fileName = exec && exec[0];
        if (fileName) {
          acc[fileName] = val;
        }
        return acc;
      }, {} as Record<string, string>);
    }
  }
  return imagePaths;
}
