import { Message } from './shared/messages';
import { injectCssFile, injectImagePaths, injectInitialScriptFile } from './shared/pageInjectUtils';

/*
 * This script is run on the page, but in an isolated world (except for DOM/postMessage).
 * It is used to bridge communication between the extension background worker
 * and the injected script on the page.
 * https://developer.chrome.com/docs/extensions/mv3/content_scripts/#host-page-communication
 */

injectInitialScriptFile(chrome.runtime.getURL('/js/injected.js'));
document.addEventListener('DOMContentLoaded', () => {
  injectCssFile(chrome.runtime.getURL('/css/injected.css'));
  injectImagePaths([chrome.runtime.getURL('/images/keyboard.svg')]);
});

function handleMessageFromExt(msg: Message) {
  // Proxy messages to the page itself
  window.postMessage({
    source: 'xcloud-keyboard-mouse-content-script',
    ...msg,
  });
}

window.addEventListener('message', (event) => {
  if (event.source != window || event.data.source !== 'xcloud-page') {
    // We only accept messages from ourselves
    return;
  }
  const msg: Message = event.data;

  // https://stackoverflow.com/a/69603416/2359478
  if (chrome.runtime?.id) {
    // Proxy to the extension
    chrome.runtime.sendMessage(msg, (response) => {
      handleMessageFromExt(response);
    });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, _sendResponse) => {
  // Receives messages from the extension background page
  if (!sender.tab) {
    handleMessageFromExt(msg);
  }
});
