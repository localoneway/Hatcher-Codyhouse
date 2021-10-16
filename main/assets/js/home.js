new PageTransition({
  afterEnter: function(newContent, link) {
    var pageScript = document.getElementById('page-script');
    if(pageScript) pageScript.remove();
    // append new script
    var script = document.createElement('script');
    script.setAttribute('src', 'assets/js/services.js'); // the src value should change according to the link value
    script.setAttribute('id','page-script');
    document.body.appendChild(script);
  },
  // additional options here
});
