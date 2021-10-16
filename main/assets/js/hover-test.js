document.getElementsByClassName("x-nob").addEventListener("touchstart", touchHandler, false);
document.getElementsByClassName("x-nob").addEventListener("touchmove", touchHandler, false);
document.getElementsByClassName("x-nob").addEventListener("touchend", touchHandler, false);

function touchHandler(e) {
  if (e.type == "touchstart") {
    alert("You touched the screen!");
  } else if (e.type == "touchmove") {
    alert("You moved your finger!");
  } else if (e.type == "touchend" || e.type == "touchcancel") {
    alert("You removed your finger from the screen!");
  }
}
