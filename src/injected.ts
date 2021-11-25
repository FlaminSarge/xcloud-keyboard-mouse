import { listenKeyboard, listenMouseMove, unlistenAll, destroy } from './browser/browserEventProcessor';
import { simulateGamepadConnect, modifyGamepadGlobals, resetGamepadGlobals } from './browser/gamepadSimulator';
import { GamepadConfig } from './shared/types';
import { processGamepadConfig } from './shared/gamepadConfig';
import { intializedMsg, Message, MessageTypes } from './shared/messages';
import { showToast } from './browser/dom/snackbar';

/*
 * This script is injected and run inside the browser page itself and thus
 * has no "isolated world" or sandboxing.
 * It uses window.postMessage to communicate with the content_script.
 */

const win = modifyGamepadGlobals();

function postMessageToWindow(msg: any) {
  win.postMessage({ ...msg, source: 'xcloud-page' });
}

function handleDisableGamepad() {
  console.log('handleDisableGamepad');
  showToast('Mouse/keyboard disabled');
  destroy();
  resetGamepadGlobals();
  // User may likely just need to refresh the page as well in this case...
  // - show them a message in the DOM?
}

function handleGamepadConfigUpdate(name: string, config: GamepadConfig) {
  const { mouseConfig, keyConfig } = config;
  console.log('handleGamepadConfigUpdate', name, mouseConfig, keyConfig);
  showToast(`'${name}' preset activated`);
  const { codeMapping, invalidButtons, hasErrors } = processGamepadConfig(keyConfig);
  if (hasErrors) {
    // This should have been handled in the Popup UI, but just in case
    console.error('Invalid button mappings in gamepad config object', invalidButtons);
  }
  unlistenAll();
  listenKeyboard(codeMapping);
  if (mouseConfig.mouseControls !== undefined) {
    listenMouseMove(mouseConfig.mouseControls, mouseConfig.sensitivity);
  }
}

function connectToExtension(gameName?: string) {
  console.log('setting up connection to content script via postMessage');
  postMessageToWindow(intializedMsg(gameName));

  window.addEventListener('message', (event) => {
    if (event.source != window || event.data.source !== 'xcloud-keyboard-mouse-content-script') {
      // We only accept messages from ourselves
      return;
    }
    const msg: Message = event.data;
    console.log('GOT MESSAGE FROM EXTENSION!', msg);
    // enable configuration
    if (msg.type === MessageTypes.ACTIVATE_GAMEPAD_CONFIG) {
      handleGamepadConfigUpdate(msg.name, msg.gamepadConfig);
    } else if (msg.type === MessageTypes.DISABLE_GAMEPAD) {
      handleDisableGamepad();
    }
  });
}

function initializeIfReady() {
  const h1 = document.querySelector('h1'); // Only on sign in page or other pages
  const isXbox = window.location.href.indexOf('xbox.com') !== -1;
  // e.g. "Halo Infinite | Xbox Cloud Gaming (Beta) on Xbox.com"
  const gameName = isXbox ? document.title.split(/\s+\|/)[0] : undefined;

  // TODO NOT WORKING!
  // Prematurely hitting false positive in xbox case
  if (!isXbox || !h1) {
    simulateGamepadConnect();
    connectToExtension(gameName);

    // Prevent xCloud's unfocus listeners from triggering
    // TODO do we need this?
    win.addEventListener('focusout', (event) => {
      event.stopImmediatePropagation();
    });
    win.addEventListener('blur', (event) => {
      event.stopImmediatePropagation();
    });
    return true;
  }
  return false;
}

let interval: ReturnType<typeof setInterval>;

function onLoad() {
  interval = setInterval(() => {
    const ready = initializeIfReady();
    if (ready) {
      clearInterval(interval);
    }
  }, 1000);
}

win.addEventListener('pageshow', onLoad, false);
win.addEventListener('popstate', onLoad, false);
