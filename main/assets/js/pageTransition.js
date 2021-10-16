new PageTransition({
  beforeLeave: false, // function running before the leaveAnimation
  leaveAnimation: function(initContent, link, cb) {
    // animation used to hide the initial page content
  },
  progressAnimation: function(link) {
    // progress animation - it runs if the leave animation is complete but the new content is not available yet
  },
  beforeEnter: false, // function running before the enterAnimation and after the new content has been injected into the page
  enterAnimation: function(initContent, newContent, link, cb) {
    // animation used to show the new page content
  },
  afterEnter: false, // function running once the enterAnimation is complete
  loadFunction: false, // function used to load new content - if false, a standard Ajax call will be used
  srLoadingMessage: false,
  srLoadedMessage: false
});
