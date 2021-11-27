import { disableConfig, enableConfig } from './browser/browserEventProcessor';
import { showToast } from './browser/dom/snackbar';
import { modifyGamepadGlobals } from './browser/gamepadSimulator';
import { intializedMsg, Message, MessageTypes } from './shared/messages';
import { GamepadConfig } from './shared/types';

/*
 * This script is injected and run inside the browser page itself and thus
 * has no "isolated world" or sandboxing.
 * It uses window.postMessage to communicate with the content_script.
 */

modifyGamepadGlobals();

function postMessageToWindow(msg: any) {
  window.postMessage({ ...msg, source: 'xcloud-page' });
}

function handleDisableGamepad() {
  // Disable the fake gamepad and let them use their real gamepad
  console.log('handleDisableGamepad');
  showToast('Mouse/keyboard disabled');
  disableConfig();
}

function handleGamepadConfigUpdate(name: string, config: GamepadConfig) {
  const { mouseConfig, keyConfig } = config;
  console.log('handleGamepadConfigUpdate', name, mouseConfig, keyConfig);
  showToast(`'${name}' preset activated`);
  enableConfig(config);
}

function connectToExtension(gameName: string | null) {
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

function getGameNameFromXboxPage(): string | null {
  let gameName: string | null = null;
  // e.g. "Halo Infinite | Xbox Cloud Gaming (Beta) on Xbox.com"
  const titleSplit = document.title.split(/\s+\|/);
  if (titleSplit.length === 2) {
    gameName = titleSplit[0];
  }
  return gameName || null;
}

function initializeIfReady() {
  // Headings only shown when there are errors or need sign in
  const h1 = document.querySelector('h1');
  const streamDiv = document.getElementById('game-stream');
  const isXbox = window.location.href.indexOf('xbox.com') !== -1;
  const gameName = isXbox ? getGameNameFromXboxPage() : null;

  if (!isXbox || (!h1 && streamDiv)) {
    connectToExtension(gameName);
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

// We need to use 'pageshow' here instead of 'load' because the 'load' event
// doesn't always trigger if the page is cached (e.g. pressing the back button)
window.addEventListener('pageshow', onLoad, false);
// Not sure yet if this is needed:
// win.addEventListener('popstate', onLoad, false);
