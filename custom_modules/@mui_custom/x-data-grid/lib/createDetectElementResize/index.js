/**
 * Detect Element Resize.
 * https://github.com/sdecima/javascript-detect-element-resize
 * Sebastian Decima
 *
 * Forked from version 0.5.3; includes the following modifications:
 * 1) Guard against unsafe 'window' and 'document' references (to support SSR).
 * 2) Defer initialization code via a top-level function wrapper (to support SSR).
 * 3) Avoid unnecessary reflows by not measuring size for scroll events bubbling from children.
 * 4) Add nonce for style element.
 *
 * TODO replace with https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
 * once browser support allows it.
 **/
export default function createDetectElementResize(nonce, hostWindow) {
  var resetTriggers = function resetTriggers(element) {
    var triggers = element.__resizeTriggers__,
      expand = triggers.firstElementChild,
      contract = triggers.lastElementChild,
      expandChild = expand.firstElementChild;
    contract.scrollLeft = contract.scrollWidth;
    contract.scrollTop = contract.scrollHeight;
    expandChild.style.width = expand.offsetWidth + 1 + 'px';
    expandChild.style.height = expand.offsetHeight + 1 + 'px';
    expand.scrollLeft = expand.scrollWidth;
    expand.scrollTop = expand.scrollHeight;
  };
  var checkTriggers = function checkTriggers(element) {
    return element.offsetWidth != element.__resizeLast__.width || element.offsetHeight != element.__resizeLast__.height;
  };
  var scrollListener = function scrollListener(e) {
    // Don't measure (which forces) reflow for scrolls that happen inside of children!
    if (e.target.className.indexOf('contract-trigger') < 0 && e.target.className.indexOf('expand-trigger') < 0) {
      return;
    }
    var element = this;
    resetTriggers(this);
    if (this.__resizeRAF__) {
      hostWindow.cancelAnimationFrame(this.__resizeRAF__);
    }
    this.__resizeRAF__ = hostWindow.requestAnimationFrame(function () {
      if (checkTriggers(element)) {
        element.__resizeLast__.width = element.offsetWidth;
        element.__resizeLast__.height = element.offsetHeight;
        element.__resizeListeners__.forEach(function (fn) {
          fn.call(element, e);
        });
      }
    });
  };

  /* Detect CSS Animations support to detect element display/re-attach */
  var animation = false,
    keyframeprefix = '',
    animationstartevent = 'animationstart',
    domPrefixes = 'Webkit Moz O ms'.split(' '),
    startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
    pfx = '';
  {
    var elm = document.createElement('fakeelement');
    if (elm.style.animationName !== undefined) {
      animation = true;
    }
    if (animation === false) {
      for (var i = 0; i < domPrefixes.length; i++) {
        if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
          pfx = domPrefixes[i];
          keyframeprefix = '-' + pfx.toLowerCase() + '-';
          animationstartevent = startEvents[i];
          animation = true;
          break;
        }
      }
    }
  }
  var animationName = 'resizeanim';
  var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
  var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
  var createStyles = function createStyles(doc, root) {
    if (!root.getElementById('muiDetectElementResize')) {
      //opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
      var css = (animationKeyframes ? animationKeyframes : '') + '.Mui-resizeTriggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' + '.Mui-resizeTriggers, .Mui-resizeTriggers > div, .contract-trigger:before { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; z-index: -1; } .Mui-resizeTriggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
        container = root.constructor.name === 'ShadowRoot' ? root : doc.head || doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');
      style.id = 'muiDetectElementResize';
      style.type = 'text/css';
      if (nonce != null) {
        style.setAttribute('nonce', nonce);
      }
      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(doc.createTextNode(css));
      }
      container.appendChild(style);
    }
  };
  var addResizeListener = function addResizeListener(element, fn) {
    if (!element.__resizeTriggers__) {
      var doc = element.ownerDocument;
      var elementStyle = hostWindow.getComputedStyle(element);
      if (elementStyle && elementStyle.position == 'static') {
        element.style.position = 'relative';
      }
      createStyles(doc, element.getRootNode());
      element.__resizeLast__ = {};
      element.__resizeListeners__ = [];
      (element.__resizeTriggers__ = doc.createElement('div')).className = 'Mui-resizeTriggers';
      element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' + '<div class="contract-trigger"></div>';
      element.appendChild(element.__resizeTriggers__);
      resetTriggers(element);
      element.addEventListener('scroll', scrollListener, true);

      /* Listen for a css animation to detect element display/re-attach */
      if (animationstartevent) {
        element.__resizeTriggers__.__animationListener__ = function animationListener(e) {
          if (e.animationName == animationName) {
            resetTriggers(element);
          }
        };
        element.__resizeTriggers__.addEventListener(animationstartevent, element.__resizeTriggers__.__animationListener__);
      }
    }
    element.__resizeListeners__.push(fn);
  };
  var removeResizeListener = function removeResizeListener(element, fn) {
    element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
    if (!element.__resizeListeners__.length) {
      element.removeEventListener('scroll', scrollListener, true);
      if (element.__resizeTriggers__.__animationListener__) {
        element.__resizeTriggers__.removeEventListener(animationstartevent, element.__resizeTriggers__.__animationListener__);
        element.__resizeTriggers__.__animationListener__ = null;
      }
      try {
        element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
      } catch (e) {
        // Preact compat; see developit/preact-compat/issues/228
      }
    }
  };
  return {
    addResizeListener,
    removeResizeListener
  };
}