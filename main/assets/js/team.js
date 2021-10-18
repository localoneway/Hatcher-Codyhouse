document.querySelector("form").addEventListener("submit", handleSubmit);

const handleSubmit = (e) => {
  e.preventDefault()
  let myForm = document.getElementById('pizzaOrder');
  let formData = new FormData(myForm)
  fetch('/', {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  }).then(() => console.log('Form successfully submitted')).catch((error) =>
    alert(error))
}

var PageTransition = document.getElementsByClassName('text-anim');

new PageTransition({
  afterEnter: function(newContent, link) {
    // slideshow
    var slideshowEl = newContent.getElementsByClassName('slideshow');
    if(slideshowEl.length > 0) {
      new Slideshow({
        element: slideshowEl[0],
        navigation: true, // show dots navigation
        autoplay : false, // enable/disable autoplay
        autoplayInterval : false, // in milliseconds - default is 5000 (5s)
        autoplayOnHover: false, // do not pause autoplay on hover
        swipe : false // enable/disable swipe
      });
    }

    // animated headline
    var headline = newContent.getElementsByClassName('text-anim');
    if(headline.length > 0) {
      new TextAnim(headline[0]);
    }
  },
  // additional options here
});