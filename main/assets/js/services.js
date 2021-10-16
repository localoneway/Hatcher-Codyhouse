new PageTransition({
  afterEnter: function(newContent, link) {
    var carouselEl = newContent.getElementsByClassName('js-carousel');
    for(var i = 0; i < carouselEl.length; i++) {
      new Carousel({element: carouselEl[i]});
    }
  },
  // additional options here
});
