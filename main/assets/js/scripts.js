// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	return el.classList.contains(className);
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	el.classList.add(classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	el.classList.remove(classList[0]);	
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className)) childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb, timeFunction) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    if(timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
    var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
    if( menuBtns.length > 0 ) {
      for(var i = 0; i < menuBtns.length; i++) {(function(i){
        initMenuBtn(menuBtns[i]);
      })(i);}
  
      function initMenuBtn(btn) {
        btn.addEventListener('click', function(event){	
          event.preventDefault();
          var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
          Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
          // emit custom event
          var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
          btn.dispatchEvent(event);
        });
      };
    }
  }());
// File#: _1_animated-headline
// Usage: codyhouse.co/license
(function() {
    var TextAnim = function(element) {
      this.element = element;
      this.wordsWrapper = this.element.getElementsByClassName(' js-text-anim__wrapper');
      this.words = this.element.getElementsByClassName('js-text-anim__word');
      this.selectedWord = 0;
      // interval between two animations
      this.loopInterval = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-pause'))*1000 || 1000;
      // duration of single animation (e.g., time for a single word to rotate)
      this.transitionDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--text-anim-duration'))*1000 || 1000;
      // keep animating after first loop was completed
      this.loop = (this.element.getAttribute('data-loop') && this.element.getAttribute('data-loop') == 'off') ? false : true;
      this.wordInClass = 'text-anim__word--in';
      this.wordOutClass = 'text-anim__word--out';
      // check for specific animations
      this.isClipAnim = Util.hasClass(this.element, 'text-anim--clip');
      if(this.isClipAnim) {
        this.animBorderWidth = parseInt(getComputedStyle(this.element).getPropertyValue('--text-anim-border-width')) || 2;
        this.animPulseClass = 'text-anim__wrapper--pulse';
      }
      initTextAnim(this);
    };
  
    function initTextAnim(element) {
      // make sure there's a word with the wordInClass
      setSelectedWord(element);
      // if clip animation -> add pulse class
      if(element.isClipAnim) {
        Util.addClass(element.wordsWrapper[0], element.animPulseClass);
      }
      // init loop
      loopWords(element);
    };
  
    function setSelectedWord(element) {
      var selectedWord = element.element.getElementsByClassName(element.wordInClass);
      if(selectedWord.length == 0) {
        Util.addClass(element.words[0], element.wordInClass);
      } else {
        element.selectedWord = Util.getIndexInArray(element.words, selectedWord[0]);
      }
    };
  
    function loopWords(element) {
      // stop animation after first loop was completed
      if(!element.loop && element.selectedWord == element.words.length - 1) {
        return;
      }
      var newWordIndex = getNewWordIndex(element);
      setTimeout(function() {
        if(element.isClipAnim) { // clip animation only
          switchClipWords(element, newWordIndex);
        } else {
          switchWords(element, newWordIndex);
        }
      }, element.loopInterval);
    };
  
    function switchWords(element, newWordIndex) {
      // switch words
      Util.removeClass(element.words[element.selectedWord], element.wordInClass);
      Util.addClass(element.words[element.selectedWord], element.wordOutClass);
      Util.addClass(element.words[newWordIndex], element.wordInClass);
      // reset loop
      resetLoop(element, newWordIndex);
    };
  
    function resetLoop(element, newIndex) {
      setTimeout(function() { 
        // set new selected word
        Util.removeClass(element.words[element.selectedWord], element.wordOutClass);
        element.selectedWord = newIndex;
        loopWords(element); // restart loop
      }, element.transitionDuration);
    };
  
    function switchClipWords(element, newWordIndex) {
      // clip animation only
      var startWidth =  element.words[element.selectedWord].offsetWidth,
        endWidth = element.words[newWordIndex].offsetWidth;
      
      // remove pulsing animation
      Util.removeClass(element.wordsWrapper[0], element.animPulseClass);
      // close word
      animateWidth(startWidth, element.animBorderWidth, element.wordsWrapper[0], element.transitionDuration, function() {
        // switch words
        Util.removeClass(element.words[element.selectedWord], element.wordInClass);
        Util.addClass(element.words[newWordIndex], element.wordInClass);
        element.selectedWord = newWordIndex;
  
        // open word
        animateWidth(element.animBorderWidth, endWidth, element.wordsWrapper[0], element.transitionDuration, function() {
          // add pulsing class
          Util.addClass(element.wordsWrapper[0], element.animPulseClass);
          loopWords(element);
        });
      });
    };
  
    function getNewWordIndex(element) {
      // get index of new word to be shown
      var index = element.selectedWord + 1;
      if(index >= element.words.length) index = 0;
      return index;
    };
  
    function animateWidth(start, to, element, duration, cb) {
      // animate width of a word for the clip animation
      var currentTime = null;
  
      var animateProperty = function(timestamp){  
        if (!currentTime) currentTime = timestamp;         
        var progress = timestamp - currentTime;
        
        var val = Math.easeInOutQuart(progress, start, to - start, duration);
        element.style.width = val+"px";
        if(progress < duration) {
            window.requestAnimationFrame(animateProperty);
        } else {
          cb();
        }
      };
    
      //set the width of the element before starting animation -> fix bug on Safari
      element.style.width = start+"px";
      window.requestAnimationFrame(animateProperty);
    };
  
    window.TextAnim = TextAnim;
  
    // init TextAnim objects
    var textAnim = document.getElementsByClassName('js-text-anim'),
      reducedMotion = Util.osHasReducedMotion();
    if( textAnim ) {
      if(reducedMotion) return;
      for( var i = 0; i < textAnim.length; i++) {
        (function(i){ new TextAnim(textAnim[i]);})(i);
      }
    }
  }());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
    var Modal = function(element) {
      this.element = element;
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.moveFocusEl = null; // focus will be moved to this element when modal is open
      this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
      this.selectedTrigger = null;
      this.preventScrollEl = this.getPreventScrollEl();
      this.showClass = "modal--is-visible";
      this.initModal();
    };
  
    Modal.prototype.getPreventScrollEl = function() {
      var scrollEl = false;
      var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
      if(querySelector) scrollEl = document.querySelector(querySelector);
      return scrollEl;
    };
  
    Modal.prototype.initModal = function() {
      var self = this;
      //open modal when clicking on trigger buttons
      if ( this.triggers ) {
        for(var i = 0; i < this.triggers.length; i++) {
          this.triggers[i].addEventListener('click', function(event) {
            event.preventDefault();
            if(Util.hasClass(self.element, self.showClass)) {
              self.closeModal();
              return;
            }
            self.selectedTrigger = event.target;
            self.showModal();
            self.initModalEvents();
          });
        }
      }
  
      // listen to the openModal event -> open modal without a trigger button
      this.element.addEventListener('openModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.showModal();
        self.initModalEvents();
      });
  
      // listen to the closeModal event -> close modal without a trigger button
      this.element.addEventListener('closeModal', function(event){
        if(event.detail) self.selectedTrigger = event.detail;
        self.closeModal();
      });
  
      // if modal is open by default -> initialise modal events
      if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
    };
  
    Modal.prototype.showModal = function() {
      var self = this;
      Util.addClass(this.element, this.showClass);
      this.getFocusableElements();
      if(this.moveFocusEl) {
        this.moveFocusEl.focus();
        // wait for the end of transitions before moving focus
        this.element.addEventListener("transitionend", function cb(event) {
          self.moveFocusEl.focus();
          self.element.removeEventListener("transitionend", cb);
        });
      }
      this.emitModalEvents('modalIsOpen');
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
    };
  
    Modal.prototype.closeModal = function() {
      if(!Util.hasClass(this.element, this.showClass)) return;
      console.log('close')
      Util.removeClass(this.element, this.showClass);
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.moveFocusEl = null;
      if(this.selectedTrigger) this.selectedTrigger.focus();
      //remove listeners
      this.cancelModalEvents();
      this.emitModalEvents('modalIsClose');
      // change the overflow of the preventScrollEl
      if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
    };
  
    Modal.prototype.initModalEvents = function() {
      //add event listeners
      this.element.addEventListener('keydown', this);
      this.element.addEventListener('click', this);
    };
  
    Modal.prototype.cancelModalEvents = function() {
      //remove event listeners
      this.element.removeEventListener('keydown', this);
      this.element.removeEventListener('click', this);
    };
  
    Modal.prototype.handleEvent = function (event) {
      switch(event.type) {
        case 'click': {
          this.initClick(event);
        }
        case 'keydown': {
          this.initKeyDown(event);
        }
      }
    };
  
    Modal.prototype.initKeyDown = function(event) {
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside modal
        this.trapFocus(event);
      } else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
        event.preventDefault();
        this.closeModal(); // close modal when pressing Enter on close button
      }	
    };
  
    Modal.prototype.initClick = function(event) {
      //close modal when clicking on close button or modal bg layer 
      if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
      event.preventDefault();
      this.closeModal();
    };
  
    Modal.prototype.trapFocus = function(event) {
      if( this.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of modal
        event.preventDefault();
        this.lastFocusable.focus();
      }
      if( this.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of modal
        event.preventDefault();
        this.firstFocusable.focus();
      }
    }
  
    Modal.prototype.getFocusableElements = function() {
      //get all focusable elements inside the modal
      var allFocusable = this.element.querySelectorAll(focusableElString);
      this.getFirstVisible(allFocusable);
      this.getLastVisible(allFocusable);
      this.getFirstFocusable();
    };
  
    Modal.prototype.getFirstVisible = function(elements) {
      //get first visible focusable element inside the modal
      for(var i = 0; i < elements.length; i++) {
        if( isVisible(elements[i]) ) {
          this.firstFocusable = elements[i];
          break;
        }
      }
    };
  
    Modal.prototype.getLastVisible = function(elements) {
      //get last visible focusable element inside the modal
      for(var i = elements.length - 1; i >= 0; i--) {
        if( isVisible(elements[i]) ) {
          this.lastFocusable = elements[i];
          break;
        }
      }
    };
  
    Modal.prototype.getFirstFocusable = function() {
      if(!this.modalFocus || !Element.prototype.matches) {
        this.moveFocusEl = this.firstFocusable;
        return;
      }
      var containerIsFocusable = this.modalFocus.matches(focusableElString);
      if(containerIsFocusable) {
        this.moveFocusEl = this.modalFocus;
      } else {
        this.moveFocusEl = false;
        var elements = this.modalFocus.querySelectorAll(focusableElString);
        for(var i = 0; i < elements.length; i++) {
          if( isVisible(elements[i]) ) {
            this.moveFocusEl = elements[i];
            break;
          }
        }
        if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
      }
    };
  
    Modal.prototype.emitModalEvents = function(eventName) {
      var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
      this.element.dispatchEvent(event);
    };
  
    function isVisible(element) {
      return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
    };
  
    window.Modal = Modal;
  
    //initialize the Modal objects
    var modals = document.getElementsByClassName('js-modal');
    // generic focusable elements string selector
    var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
    if( modals.length > 0 ) {
      var modalArrays = [];
      for( var i = 0; i < modals.length; i++) {
        (function(i){modalArrays.push(new Modal(modals[i]));})(i);
      }
  
      window.addEventListener('keydown', function(event){ //close modal window on esc
        if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
          for( var i = 0; i < modalArrays.length; i++) {
            (function(i){modalArrays[i].closeModal();})(i);
          };
        }
      });
    }
  }());
// File#: _1_off-canvas-content
// Usage: codyhouse.co/license
(function() {
    var OffCanvas = function(element) {
      this.element = element;
      this.wrapper = document.getElementsByClassName('js-off-canvas')[0];
      this.main = document.getElementsByClassName('off-canvas__main')[0];
      this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
      this.closeBtn = this.element.getElementsByClassName('js-off-canvas__close-btn');
      this.selectedTrigger = false;
      this.firstFocusable = null;
      this.lastFocusable = null;
      this.animating = false;
      initOffCanvas(this);
    };	
  
    function initOffCanvas(panel) {
      panel.element.setAttribute('aria-hidden', 'true');
      for(var i = 0 ; i < panel.triggers.length; i++) { // listen to the click on off-canvas content triggers
        panel.triggers[i].addEventListener('click', function(event){
          panel.selectedTrigger = event.currentTarget;
          event.preventDefault();
          togglePanel(panel);
        });
      }
  
      // listen to the triggerOpenPanel event -> open panel without a trigger button
      panel.element.addEventListener('triggerOpenPanel', function(event){
        if(event.detail) panel.selectedTrigger = event.detail;
        openPanel(panel);
      });
      // listen to the triggerClosePanel event -> open panel without a trigger button
      panel.element.addEventListener('triggerClosePanel', function(event){
        closePanel(panel);
      });
    };
  
    function togglePanel(panel) {
      var status = (panel.element.getAttribute('aria-hidden') == 'true') ? 'close' : 'open';
      if(status == 'close') openPanel(panel);
      else closePanel(panel);
    };
  
    function openPanel(panel) {
      if(panel.animating) return; // already animating
      emitPanelEvents(panel, 'openPanel', '');
      panel.animating = true;
      panel.element.setAttribute('aria-hidden', 'false');
      Util.addClass(panel.wrapper, 'off-canvas--visible');
      getFocusableElements(panel);
      var transitionEl = panel.element;
      if(panel.closeBtn.length > 0 && !Util.hasClass(panel.closeBtn[0], 'js-off-canvas__a11y-close-btn')) transitionEl = 	panel.closeBtn[0];
      transitionEl.addEventListener('transitionend', function cb(){
        // wait for the end of transition to move focus and update the animating property
        panel.animating = false;
        Util.moveFocus(panel.element);
        transitionEl.removeEventListener('transitionend', cb);
      });
      if(!transitionSupported) panel.animating = false;
      initPanelEvents(panel);
    };
  
    function closePanel(panel, bool) {
      if(panel.animating) return;
      panel.animating = true;
      panel.element.setAttribute('aria-hidden', 'true');
      Util.removeClass(panel.wrapper, 'off-canvas--visible');
      panel.main.addEventListener('transitionend', function cb(){
        panel.animating = false;
        if(panel.selectedTrigger) panel.selectedTrigger.focus();
        setTimeout(function(){panel.selectedTrigger = false;}, 10);
        panel.main.removeEventListener('transitionend', cb);
      });
      if(!transitionSupported) panel.animating = false;
      cancelPanelEvents(panel);
      emitPanelEvents(panel, 'closePanel', bool);
    };
  
    function initPanelEvents(panel) { //add event listeners
      panel.element.addEventListener('keydown', handleEvent.bind(panel));
      panel.element.addEventListener('click', handleEvent.bind(panel));
    };
  
    function cancelPanelEvents(panel) { //remove event listeners
      panel.element.removeEventListener('keydown', handleEvent.bind(panel));
      panel.element.removeEventListener('click', handleEvent.bind(panel));
    };
  
    function handleEvent(event) {
      switch(event.type) {
        case 'keydown':
          initKeyDown(this, event);
          break;
        case 'click':
          initClick(this, event);
          break;
      }
    };
  
    function initClick(panel, event) { // close panel when clicking on close button
      if( !event.target.closest('.js-off-canvas__close-btn')) return;
      event.preventDefault();
      closePanel(panel, 'close-btn');
    };
  
    function initKeyDown(panel, event) {
      if( event.keyCode && event.keyCode == 27 || event.key && event.key == 'Escape' ) {
        //close off-canvas panel on esc
        closePanel(panel, 'key');
      } else if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside panel
        trapFocus(panel, event);
      }
    };
  
    function trapFocus(panel, event) {
      if( panel.firstFocusable == document.activeElement && event.shiftKey) {
        //on Shift+Tab -> focus last focusable element when focus moves out of panel
        event.preventDefault();
        panel.lastFocusable.focus();
      }
      if( panel.lastFocusable == document.activeElement && !event.shiftKey) {
        //on Tab -> focus first focusable element when focus moves out of panel
        event.preventDefault();
        panel.firstFocusable.focus();
      }
    };
  
    function getFocusableElements(panel) { //get all focusable elements inside the off-canvas content
      var allFocusable = panel.element.querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
      getFirstVisible(panel, allFocusable);
      getLastVisible(panel, allFocusable);
    };
  
    function getFirstVisible(panel, elements) { //get first visible focusable element inside the off-canvas content
      for(var i = 0; i < elements.length; i++) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          panel.firstFocusable = elements[i];
          return true;
        }
      }
    };
  
    function getLastVisible(panel, elements) { //get last visible focusable element inside the off-canvas content
      for(var i = elements.length - 1; i >= 0; i--) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          panel.lastFocusable = elements[i];
          return true;
        }
      }
    };
  
    function emitPanelEvents(panel, eventName, target) { // emit custom event
      var event = new CustomEvent(eventName, {detail: target});
      panel.element.dispatchEvent(event);
    };
  
    //initialize the OffCanvas objects
    var offCanvas = document.getElementsByClassName('js-off-canvas__panel'),
      transitionSupported = Util.cssSupports('transition');
    if( offCanvas.length > 0 ) {
      for( var i = 0; i < offCanvas.length; i++) {
        (function(i){new OffCanvas(offCanvas[i]);})(i);
      }
    }
  }());
// File#: _1_page-transition
// Usage: codyhouse.co/license
(function() {
  var PageTransition = function(opts) {
    if(!('CSS' in window) || !CSS.supports('color', 'var(--color)')) return;
    this.element = document.getElementsByClassName('js-page-trans')[0];
    this.options = Util.extend(PageTransition.defaults , opts);
    this.cachedPages = [];
    this.anchors = false;
    this.clickFunctions = [];
    this.animating = false;
    this.newContent = false;
    this.containerClass = 'js-page-trans__content';
    this.containers = [];
    initSrRegion(this);
    pageTrInit(this);
    initBrowserHistory(this);
  };

  function initSrRegion(element) {
    var liveRegion = document.createElement('p');
    Util.setAttributes(liveRegion, {'class': 'sr-only', 'role': 'alert', 'aria-live': 'polite', 'id': 'page-trans-sr-live'});
    element.element.appendChild(liveRegion);
    element.srLive = document.getElementById('page-trans-sr-live');
  };

  function pageTrInit(element) { // bind click events
    element.anchors = document.getElementsByClassName('js-page-trans-link');
    for(var i = 0; i < element.anchors.length; i++) {
      (function(i){
        element.clickFunctions[i] = function(event) {
          event.preventDefault();
          element.updateBrowserHistory = true;
          bindClick(element, element.anchors[i].getAttribute('href'));
        };

        element.anchors[i].addEventListener('click', element.clickFunctions[i]);
      })(i);
    }
  };

  function bindClick(element, link) {
    if(element.animating) return;
    element.animating = true;
    element.link = link; 
    // most of those links will be removed from the page
    unbindClickEvents(element);
    loadPageContent(element); 
    // code that should run before the leaving animation
    if(element.options.beforeLeave) element.options.beforeLeave(element.link);
    // announce to SR new content is being loaded
    element.srLive.textContent = element.options.srLoadingMessage;
    // leaving animation
    if(!element.options.leaveAnimation) return;
    element.containers.push(element.element.getElementsByClassName(element.containerClass)[0]);
    element.options.leaveAnimation(element.containers[0], element.link, function(){
      leavingAnimationComplete(element, true);
    });
  };

  function unbindClickEvents(element) {
    for(var i = 0; i < element.anchors.length; i++) {
      element.anchors[i].removeEventListener('click', element.clickFunctions[i]);
    }
  };

  function loadPageContent(element) {
    element.newContent = false;
    var pageCache = getCachedPage(element);
    if(pageCache) {
      element.newContent = pageCache;
    } else {
      if(element.options.loadFunction) { // use a custom function to load your data
        element.options.loadFunction(element.link, function(data){
          element.newContent = data;
          element.cachedPages.push({link: element.link, content: element.newContent});
        });
      } else {
        // load page content
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function() {
          if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            element.newContent = getContainerHTML(element, xmlHttp.responseText);
            element.cachedPages.push({link: element.link, content: element.newContent});
          }
        };
        xmlHttp.open('GET', element.link);
        xmlHttp.send();
      }
    }
  };

  function leavingAnimationComplete(element, triggerProgress) {
    if(element.newContent) {
      // new content has already been created
      triggerEnteringProcess(element);
    } else {
      // new content is not available yet
      if(triggerProgress && element.options.progressAnimation) element.options.progressAnimation(element.link);
      setTimeout(function(){
        leavingAnimationComplete(element, false);
      }, 200);
    }
  };

  function getCachedPage(element) {
    var cachedContent = false;
    for(var i = 0; i < element.cachedPages.length; i++) {
      if(element.cachedPages[i].link == element.link) {
        cachedContent = element.cachedPages[i].content;
        break;
      }
    }
    return cachedContent;
  };

  function getContainerHTML(element, content) {
    var template = document.createElement('div');
    template.innerHTML = content;
    return template.getElementsByClassName(element.containerClass)[0].outerHTML;
  };

  function triggerEnteringProcess(element) {
    if(element.updateBrowserHistory) updateBrowserHistory(element);
    // inject new content
    element.containers[0].insertAdjacentHTML('afterend', element.newContent);
    element.containers = element.element.getElementsByClassName(element.containerClass);
    if(element.options.beforeEnter) element.options.beforeEnter(element.containers[0], element.containers[1], element.link);
    if(!element.options.enterAnimation) return; // entering animation
    element.options.enterAnimation(element.containers[0], element.containers[1], element.link, function(){
      // move focus to new cntent
      Util.moveFocus(element.containers[1]);
      // new content
      var newContent = element.containers[1];
      // remove old content
      element.containers[0].remove();
      if(element.options.afterEnter) element.options.afterEnter(newContent, element.link);
      pageTrInit(element); // bind click event to new anchor elements
      resetPageTransition(element);
      // announce to SR new content is available
      element.srLive.textContent = element.options.srLoadedMessage;
    });
  };

  function resetPageTransition(element) {
    // remove old content
    element.newContent = false;
    element.animating = false;
    element.containers = [];
    element.link = false;
  };

  function updateBrowserHistory(element) {
    if(window.history.state && window.history.state == element.link) return;
    window.history.pushState({path: element.link},'',element.link);
  };

  function initBrowserHistory(element) {
    setTimeout(function() {
      // on load -> replace window history with page url
      window.history.replaceState({path: document.location.href},'',document.location.href);
      window.addEventListener('popstate', function(event) {
        element.updateBrowserHistory = false;
        if(event.state && event.state.path) {
          bindClick(element, event.state.path);
        }
      });
    }, 10);
  };

  PageTransition.defaults = {
    beforeLeave: false, // run before the leaving animation is triggered
    leaveAnimation: false,
    progressAnimation: false,
    beforeEnter: false, // run before enterAnimation (after new content has been added to the page)
    enterAnimation: false,
    afterEnter: false,
    loadFunction: false,
    srLoadingMessage: 'New content is being loaded',
    srLoadedMessage: 'New content has been loaded' 
  };

  window.PageTransition = PageTransition;
}());
// File#: _1_swipe-content
(function() {
    var SwipeContent = function(element) {
      this.element = element;
      this.delta = [false, false];
      this.dragging = false;
      this.intervalId = false;
      initSwipeContent(this);
    };
  
    function initSwipeContent(content) {
      content.element.addEventListener('mousedown', handleEvent.bind(content));
      content.element.addEventListener('touchstart', handleEvent.bind(content));
    };
  
    function initDragging(content) {
      //add event listeners
      content.element.addEventListener('mousemove', handleEvent.bind(content));
      content.element.addEventListener('touchmove', handleEvent.bind(content));
      content.element.addEventListener('mouseup', handleEvent.bind(content));
      content.element.addEventListener('mouseleave', handleEvent.bind(content));
      content.element.addEventListener('touchend', handleEvent.bind(content));
    };
  
    function cancelDragging(content) {
      //remove event listeners
      if(content.intervalId) {
        (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
        content.intervalId = false;
      }
      content.element.removeEventListener('mousemove', handleEvent.bind(content));
      content.element.removeEventListener('touchmove', handleEvent.bind(content));
      content.element.removeEventListener('mouseup', handleEvent.bind(content));
      content.element.removeEventListener('mouseleave', handleEvent.bind(content));
      content.element.removeEventListener('touchend', handleEvent.bind(content));
    };
  
    function handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
        case 'touchstart':
          startDrag(this, event);
          break;
        case 'mousemove':
        case 'touchmove':
          drag(this, event);
          break;
        case 'mouseup':
        case 'mouseleave':
        case 'touchend':
          endDrag(this, event);
          break;
      }
    };
  
    function startDrag(content, event) {
      content.dragging = true;
      // listen to drag movements
      initDragging(content);
      content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
      // emit drag start event
      emitSwipeEvents(content, 'dragStart', content.delta, event.target);
    };
  
    function endDrag(content, event) {
      cancelDragging(content);
      // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
      var dx = parseInt(unify(event).clientX), 
        dy = parseInt(unify(event).clientY);
      
      // check if there was a left/right swipe
      if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
        var s = getSign(dx - content.delta[0]);
        
        if(Math.abs(dx - content.delta[0]) > 30) {
          (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
        }
        
        content.delta[0] = false;
      }
      // check if there was a top/bottom swipe
      if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
          var y = getSign(dy - content.delta[1]);
  
          if(Math.abs(dy - content.delta[1]) > 30) {
            (y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
        }
  
        content.delta[1] = false;
      }
      // emit drag end event
      emitSwipeEvents(content, 'dragEnd', [dx, dy]);
      content.dragging = false;
    };
  
    function drag(content, event) {
      if(!content.dragging) return;
      // emit dragging event with coordinates
      (!window.requestAnimationFrame) 
        ? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
        : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
    };
  
    function emitDrag(event) {
      emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
    };
  
    function unify(event) { 
      // unify mouse and touch events
      return event.changedTouches ? event.changedTouches[0] : event; 
    };
  
    function emitSwipeEvents(content, eventName, detail, el) {
      var trigger = false;
      if(el) trigger = el;
      // emit event with coordinates
      var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
      content.element.dispatchEvent(event);
    };
  
    function getSign(x) {
      if(!Math.sign) {
        return ((x > 0) - (x < 0)) || +x;
      } else {
        return Math.sign(x);
      }
    };
  
    window.SwipeContent = SwipeContent;
    
    //initialize the SwipeContent objects
    var swipe = document.getElementsByClassName('js-swipe-content');
    if( swipe.length > 0 ) {
      for( var i = 0; i < swipe.length; i++) {
        (function(i){new SwipeContent(swipe[i]);})(i);
      }
    }
  }());
// File#: _2_off-canvas-navigation
// Usage: codyhouse.co/license
(function() {
    var OffCanvasNav = function(element) {
      this.element = element;
      this.panel = this.element.getElementsByClassName('js-off-canvas__panel')[0];
      this.trigger = document.querySelectorAll('[aria-controls="'+this.panel.getAttribute('id')+'"]')[0];
      this.svgAnim = this.trigger.getElementsByTagName('circle');
      initOffCanvasNav(this);
    };
  
    function initOffCanvasNav(canvas) {
      if(transitionSupported) {
        // do not allow click on menu icon while the navigation is animating
        canvas.trigger.addEventListener('click', function(event){
          canvas.trigger.style.setProperty('pointer-events', 'none');
        });
        canvas.panel.addEventListener('openPanel', function(event){
          canvas.trigger.style.setProperty('pointer-events', 'none');
        });
        canvas.panel.addEventListener('transitionend', function(event){
          if(event.propertyName == 'visibility') {
            canvas.trigger.style.setProperty('pointer-events', '');
          }
        });
      }
  
      if(canvas.svgAnim.length > 0) { // create the circle fill-in effect
        var circumference = (2*Math.PI*canvas.svgAnim[0].getAttribute('r')).toFixed(2);
        canvas.svgAnim[0].setAttribute('stroke-dashoffset', circumference);
        canvas.svgAnim[0].setAttribute('stroke-dasharray', circumference);
        Util.addClass(canvas.trigger, 'offnav-control--ready-to-animate');
      }
      
      canvas.panel.addEventListener('closePanel', function(event){
        // if the navigation is closed using keyboard or a11y close btn -> change trigger icon appearance (from arrow to menu icon) 
        if(event.detail == 'key' || event.detail == 'close-btn') {
          canvas.trigger.click();
        }
      });
    };
  
    // init OffCanvasNav objects
    var offCanvasNav = document.getElementsByClassName('js-off-canvas--nav'),
      transitionSupported = Util.cssSupports('transition');
    if( offCanvasNav.length > 0 ) {
      for( var i = 0; i < offCanvasNav.length; i++) {
        (function(i){new OffCanvasNav(offCanvasNav[i]);})(i);
      }
    }
  }());
// File#: _2_page-transition-v1
// Usage: codyhouse.co/license
(function() {
  var pageTransitionWrapper = document.getElementsByClassName('js-page-trans');
  if(pageTransitionWrapper.length < 1) return;
  
  var transPanel = document.getElementsByClassName('page-trans-v1'),
    loaderScale = '--page-trans-v1-loader-scale',
    timeoutId = false,
    loaderScaleDown = 0.2;

  var timeLeaveAnim = 0;
  
  new PageTransition({
    leaveAnimation: function(initContent, link, cb) {
      timeLeaveAnim = 0;
      Util.addClass(transPanel[0], 'page-trans-v1--is-visible');
      transPanel[0].addEventListener('transitionend', function cbLeave(){
        transPanel[0].removeEventListener('transitionend', cbLeave);
        setTimeout(function(){
          animateLoader(300, 1, loaderScaleDown, function(){
            Util.addClass(initContent, 'is-hidden');
            timeLeaveAnim = new Date().getTime();
            cb();
          });
        }, 100);
      });
    },
    
    enterAnimation: function(initContent, newContent, link, cb) {
      if(timeoutId) {
        window.cancelAnimationFrame(timeoutId);
        timeoutId = false;
      }

      // set a minimum loader animation duration of 0.75s
      var duration = Math.max((750 - new Date().getTime() + timeLeaveAnim), 300);
  
      // complete page-trans-v1__loader scale animation
      animateLoader(duration, parseFloat(getComputedStyle(transPanel[0]).getPropertyValue(loaderScale)), 1, function() {
        Util.removeClass(transPanel[0], 'page-trans-v1--is-visible');
        transPanel[0].addEventListener('transitionend', function cbEnter(){
          transPanel[0].removeEventListener('transitionend', cbEnter);
          cb();
        });
      });
    },
  
    progressAnimation: function(link) {
      animateLoader(3000, loaderScaleDown, 0.9);
    },
    afterEnter: function(newContent, link) {
      // slideshow
      var slideshowEl = newContent.getElementsByClassName('slideshow');
      if(slideshowEl.length > 0) {
        new Slideshow({
          element: slideshowEl[0],
          navigation: false, // show dots navigation
          autoplay : false, // enable/disable autoplay
          autoplayInterval : false, // in milliseconds - default is 5000 (5s)
          autoplayOnHover: false, // do not pause autoplay on hover
          swipe : false // enable/disable swipe
        }); 
        new Slideshow({
          element: slideshowEl[1],
          navigation: false, // show dots navigation
          autoplay : false, // enable/disable autoplay
          autoplayInterval : false, // in milliseconds - default is 5000 (5s)
          autoplayOnHover: false, // do not pause autoplay on hover
          swipe : false // enable/disable swipe
        }); 
        new Slideshow({
          element: slideshowEl[2],
          navigation: false, // show dots navigation
          autoplay : false, // enable/disable autoplay
          autoplayInterval : false, // in milliseconds - default is 5000 (5s)
          autoplayOnHover: false, // do not pause autoplay on hover
          swipe : false // enable/disable swipe
        }); 
      }
       // animated headline
    var headline = newContent.getElementsByClassName('text-anim');
    if(headline.length > 0) {
      new TextAnim(headline);
      }
      // Modal
      var modal = newContent.getElementsByClassName('modal');
      new Modal(modal);
      
    },
  });

  function animateLoader(duration, startValue, finalValue, cb) {
    // takes care of animating the loader element
    var currentTime = false;

    var animateScale = function(timestamp) {
      if (!currentTime) currentTime = timestamp;        
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeInOutQuart(progress, startValue, finalValue - startValue, duration);
      transPanel[0].style.setProperty(loaderScale, val);
      if(progress < duration) {
        timeoutId = window.requestAnimationFrame(animateScale);
      } else {
        // reveal page content
        if(cb) cb();
      }
    };
    timeoutId = window.requestAnimationFrame(animateScale);
  };
}());
// File#: _2_slideshow
// Usage: codyhouse.co/license
(function() {
    var Slideshow = function(opts) {
      this.options = Util.extend(Slideshow.defaults , opts);
      this.element = this.options.element;
      this.items = this.element.getElementsByClassName('js-slideshow__item');
      this.controls = this.element.getElementsByClassName('js-slideshow__control'); 
      this.selectedSlide = 0;
      this.autoplayId = false;
      this.autoplayPaused = false;
      this.navigation = false;
      this.navCurrentLabel = false;
      this.ariaLive = false;
      this.moveFocus = false;
      this.animating = false;
      this.supportAnimation = Util.cssSupports('transition');
      this.animationOff = (!Util.hasClass(this.element, 'slideshow--transition-fade') && !Util.hasClass(this.element, 'slideshow--transition-slide') && !Util.hasClass(this.element, 'slideshow--transition-prx'));
      this.animationType = Util.hasClass(this.element, 'slideshow--transition-prx') ? 'prx' : 'slide';
      this.animatingClass = 'slideshow--is-animating';
      initSlideshow(this);
      initSlideshowEvents(this);
      initAnimationEndEvents(this);
    };
  
    Slideshow.prototype.showNext = function() {
      showNewItem(this, this.selectedSlide + 1, 'next');
    };
  
    Slideshow.prototype.showPrev = function() {
      showNewItem(this, this.selectedSlide - 1, 'prev');
    };
  
    Slideshow.prototype.showItem = function(index) {
      showNewItem(this, index, false);
    };
  
    Slideshow.prototype.startAutoplay = function() {
      var self = this;
      if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
        self.autoplayId = setInterval(function(){
          self.showNext();
        }, self.options.autoplayInterval);
      }
    };
  
    Slideshow.prototype.pauseAutoplay = function() {
      var self = this;
      if(this.options.autoplay) {
        clearInterval(self.autoplayId);
        self.autoplayId = false;
      }
    };
  
    function initSlideshow(slideshow) { // basic slideshow settings
      // if no slide has been selected -> select the first one
      if(slideshow.element.getElementsByClassName('slideshow__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow__item--selected');
      slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow__item--selected')[0]);
      // create an element that will be used to announce the new visible slide to SR
      var srLiveArea = document.createElement('div');
      Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
      slideshow.element.appendChild(srLiveArea);
      slideshow.ariaLive = srLiveArea;
    };
  
    function initSlideshowEvents(slideshow) {
      // if slideshow navigation is on -> create navigation HTML and add event listeners
      if(slideshow.options.navigation) {
        // check if navigation has already been included
        if(slideshow.element.getElementsByClassName('js-slideshow__navigation').length == 0) {
          var navigation = document.createElement('ol'),
            navChildren = '';
  
          var navClasses = 'slideshow__navigation js-slideshow__navigation';
          if(slideshow.items.length <= 1) {
            navClasses = navClasses + ' is-hidden';
          } 
          
          navigation.setAttribute('class', navClasses);
          for(var i = 0; i < slideshow.items.length; i++) {
            var className = (i == slideshow.selectedSlide) ? 'class="slideshow__nav-item slideshow__nav-item--selected js-slideshow__nav-item"' :  'class="slideshow__nav-item js-slideshow__nav-item"',
              navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow__nav-current-label">Current Item</span>' : '';
            navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
          }
          navigation.innerHTML = navChildren;
          slideshow.element.appendChild(navigation);
        }
        
        slideshow.navCurrentLabel = slideshow.element.getElementsByClassName('js-slideshow__nav-current-label')[0]; 
        slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow__nav-item');
  
        var dotsNavigation = slideshow.element.getElementsByClassName('js-slideshow__navigation')[0];
  
        dotsNavigation.addEventListener('click', function(event){
          navigateSlide(slideshow, event, true);
        });
        dotsNavigation.addEventListener('keyup', function(event){
          navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
        });
      }
      // slideshow arrow controls
      if(slideshow.controls.length > 0) {
        // hide controls if one item available
        if(slideshow.items.length <= 1) {
          Util.addClass(slideshow.controls[0], 'is-hidden');
          Util.addClass(slideshow.controls[1], 'is-hidden');
        }
        slideshow.controls[0].addEventListener('click', function(event){
          event.preventDefault();
          slideshow.showPrev();
          updateAriaLive(slideshow);
        });
        slideshow.controls[1].addEventListener('click', function(event){
          event.preventDefault();
          slideshow.showNext();
          updateAriaLive(slideshow);
        });
      }
      // swipe events
      if(slideshow.options.swipe) {
        //init swipe
        new SwipeContent(slideshow.element);
        slideshow.element.addEventListener('swipeLeft', function(event){
          slideshow.showNext();
        });
        slideshow.element.addEventListener('swipeRight', function(event){
          slideshow.showPrev();
        });
      }
      // autoplay
      if(slideshow.options.autoplay) {
        slideshow.startAutoplay();
        // pause autoplay if user is interacting with the slideshow
        if(!slideshow.options.autoplayOnHover) {
          slideshow.element.addEventListener('mouseenter', function(event){
            slideshow.pauseAutoplay();
            slideshow.autoplayPaused = true;
          });
          slideshow.element.addEventListener('mouseleave', function(event){
            slideshow.autoplayPaused = false;
            slideshow.startAutoplay();
          });
        }
        
        slideshow.element.addEventListener('focusin', function(event){
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('focusout', function(event){
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
      }
      // detect if external buttons control the slideshow
      var slideshowId = slideshow.element.getAttribute('id');
      if(slideshowId) {
        var externalControls = document.querySelectorAll('[data-controls="'+slideshowId+'"]');
        for(var i = 0; i < externalControls.length; i++) {
          (function(i){externalControlSlide(slideshow, externalControls[i]);})(i);
        }
      }
      // custom event to trigger selection of a new slide element
      slideshow.element.addEventListener('selectNewItem', function(event){
        // check if slide is already selected
        if(event.detail) {
          if(event.detail - 1 == slideshow.selectedSlide) return;
          showNewItem(slideshow, event.detail - 1, false);
        }
      });
  
      // keyboard navigation
      slideshow.element.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          slideshow.showNext();
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          slideshow.showPrev();
        }
      });
    };
  
    function navigateSlide(slideshow, event, keyNav) { 
      // user has interacted with the slideshow navigation -> update visible slide
      var target = ( Util.hasClass(event.target, 'js-slideshow__nav-item') ) ? event.target : event.target.closest('.js-slideshow__nav-item');
      if(keyNav && target && !Util.hasClass(target, 'slideshow__nav-item--selected')) {
        slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
        slideshow.moveFocus = true;
        updateAriaLive(slideshow);
      }
    };
  
    function initAnimationEndEvents(slideshow) {
      // remove animation classes at the end of a slide transition
      for( var i = 0; i < slideshow.items.length; i++) {
        (function(i){
          slideshow.items[i].addEventListener('animationend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
          slideshow.items[i].addEventListener('transitionend', function(){resetAnimationEnd(slideshow, slideshow.items[i]);});
        })(i);
      }
    };
  
    function resetAnimationEnd(slideshow, item) {
      setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
        if(Util.hasClass(item,'slideshow__item--selected')) {
          if(slideshow.moveFocus) Util.moveFocus(item);
          emitSlideshowEvent(slideshow, 'newItemVisible', slideshow.selectedSlide);
          slideshow.moveFocus = false;
        }
        Util.removeClass(item, 'slideshow__item--'+slideshow.animationType+'-out-left slideshow__item--'+slideshow.animationType+'-out-right slideshow__item--'+slideshow.animationType+'-in-left slideshow__item--'+slideshow.animationType+'-in-right');
        item.removeAttribute('aria-hidden');
        slideshow.animating = false;
        Util.removeClass(slideshow.element, slideshow.animatingClass); 
      }, 100);
    };
  
    function showNewItem(slideshow, index, bool) {
      if(slideshow.items.length <= 1) return;
      if(slideshow.animating && slideshow.supportAnimation) return;
      slideshow.animating = true;
      Util.addClass(slideshow.element, slideshow.animatingClass); 
      if(index < 0) index = slideshow.items.length - 1;
      else if(index >= slideshow.items.length) index = 0;
      // skip slideshow item if it is hidden
      if(bool && Util.hasClass(slideshow.items[index], 'is-hidden')) {
        slideshow.animating = false;
        index = bool == 'next' ? index + 1 : index - 1;
        showNewItem(slideshow, index, bool);
        return;
      }
      // index of new slide is equal to index of slide selected item
      if(index == slideshow.selectedSlide) {
        slideshow.animating = false;
        return;
      }
      var exitItemClass = getExitItemClass(slideshow, bool, slideshow.selectedSlide, index);
      var enterItemClass = getEnterItemClass(slideshow, bool, slideshow.selectedSlide, index);
      // transition between slides
      if(!slideshow.animationOff) Util.addClass(slideshow.items[slideshow.selectedSlide], exitItemClass);
      Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow__item--selected');
      slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
      if(slideshow.animationOff) {
        Util.addClass(slideshow.items[index], 'slideshow__item--selected');
      } else {
        Util.addClass(slideshow.items[index], enterItemClass+' slideshow__item--selected');
      }
      // reset slider navigation appearance
      resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
      slideshow.selectedSlide = index;
      // reset autoplay
      slideshow.pauseAutoplay();
      slideshow.startAutoplay();
      // reset controls/navigation color themes
      resetSlideshowTheme(slideshow, index);
      // emit event
      emitSlideshowEvent(slideshow, 'newItemSelected', slideshow.selectedSlide);
      if(slideshow.animationOff) {
        slideshow.animating = false;
        Util.removeClass(slideshow.element, slideshow.animatingClass);
      }
    };
  
    function getExitItemClass(slideshow, bool, oldIndex, newIndex) {
      var className = '';
      if(bool) {
        className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-out-right' : 'slideshow__item--'+slideshow.animationType+'-out-left'; 
      } else {
        className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-out-left' : 'slideshow__item--'+slideshow.animationType+'-out-right';
      }
      return className;
    };
  
    function getEnterItemClass(slideshow, bool, oldIndex, newIndex) {
      var className = '';
      if(bool) {
        className = (bool == 'next') ? 'slideshow__item--'+slideshow.animationType+'-in-right' : 'slideshow__item--'+slideshow.animationType+'-in-left'; 
      } else {
        className = (newIndex < oldIndex) ? 'slideshow__item--'+slideshow.animationType+'-in-left' : 'slideshow__item--'+slideshow.animationType+'-in-right';
      }
      return className;
    };
  
    function resetSlideshowNav(slideshow, newIndex, oldIndex) {
      if(slideshow.navigation) {
        Util.removeClass(slideshow.navigation[oldIndex], 'slideshow__nav-item--selected');
        Util.addClass(slideshow.navigation[newIndex], 'slideshow__nav-item--selected');
        slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
        slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
      }
    };
  
    function resetSlideshowTheme(slideshow, newIndex) {
      var dataTheme = slideshow.items[newIndex].getAttribute('data-theme');
      if(dataTheme) {
        if(slideshow.navigation) slideshow.navigation[0].parentElement.setAttribute('data-theme', dataTheme);
        if(slideshow.controls[0]) slideshow.controls[0].parentElement.setAttribute('data-theme', dataTheme);
      } else {
        if(slideshow.navigation) slideshow.navigation[0].parentElement.removeAttribute('data-theme');
        if(slideshow.controls[0]) slideshow.controls[0].parentElement.removeAttribute('data-theme');
      }
    };
  
    function emitSlideshowEvent(slideshow, eventName, detail) {
      var event = new CustomEvent(eventName, {detail: detail});
      slideshow.element.dispatchEvent(event);
    };
  
    function updateAriaLive(slideshow) {
      slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
    };
  
    function externalControlSlide(slideshow, button) { // control slideshow using external element
      button.addEventListener('click', function(event){
        var index = button.getAttribute('data-index');
        if(!index || index == slideshow.selectedSlide + 1) return;
        event.preventDefault();
        showNewItem(slideshow, index - 1, false);
      });
    };
  
    Slideshow.defaults = {
      element : '',
      navigation : true,
      autoplay : false,
      autoplayOnHover: false,
      autoplayInterval: 5000,
      swipe: false
    };
  
    window.Slideshow = Slideshow;
    
    //initialize the Slideshow objects
    var slideshows = document.getElementsByClassName('js-slideshow');
    if( slideshows.length > 0 ) {
      for( var i = 0; i < slideshows.length; i++) {
        (function(i){
          var navigation = (slideshows[i].getAttribute('data-navigation') && slideshows[i].getAttribute('data-navigation') == 'off') ? false : true,
            autoplay = (slideshows[i].getAttribute('data-autoplay') && slideshows[i].getAttribute('data-autoplay') == 'on') ? true : false,
            autoplayOnHover = (slideshows[i].getAttribute('data-autoplay-hover') && slideshows[i].getAttribute('data-autoplay-hover') == 'on') ? true : false,
            autoplayInterval = (slideshows[i].getAttribute('data-autoplay-interval')) ? slideshows[i].getAttribute('data-autoplay-interval') : 5000,
            swipe = (slideshows[i].getAttribute('data-swipe') && slideshows[i].getAttribute('data-swipe') == 'on') ? true : false;
          new Slideshow({element: slideshows[i], navigation: navigation, autoplay : autoplay, autoplayOnHover: autoplayOnHover, autoplayInterval : autoplayInterval, swipe : swipe});
        })(i);
      }
    }
  }());
// File#: _2_sticky-sharebar
// Usage: codyhouse.co/license
(function() {
    var StickyShareBar = function(element) {
      this.element = element;
      this.contentTarget = document.getElementsByClassName('js-sticky-sharebar-target');
      this.showClass = 'sticky-sharebar--on-target';
      this.threshold = '50%'; // Share Bar will be revealed when .js-sticky-sharebar-target element reaches 50% of the viewport
      initShareBar(this);
    };
  
    function initShareBar(shareBar) {
      if(shareBar.contentTarget.length < 1) {
        Util.addClass(shareBar.element, shareBar.showClass);
        return;
      }
      if(intersectionObserverSupported) {
        initObserver(shareBar); // update anchor appearance on scroll
      } else {
        Util.addClass(shareBar.element, shareBar.showClass);
      }
    };
  
    function initObserver(shareBar) {
      var observer = new IntersectionObserver(
        function(entries, observer) { 
          Util.toggleClass(shareBar.element, shareBar.showClass, entries[0].isIntersecting);
        }, 
        {rootMargin: "0px 0px -"+shareBar.threshold+" 0px"}
      );
      observer.observe(shareBar.contentTarget[0]);
    };
  
    //initialize the StickyShareBar objects
    var stickyShareBar = document.getElementsByClassName('js-sticky-sharebar'),
      intersectionObserverSupported = ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype);
    
    if( stickyShareBar.length > 0 ) {
      for( var i = 0; i < stickyShareBar.length; i++) {
        (function(i){ new StickyShareBar(stickyShareBar[i]); })(i);
      }
    }
  }());