const mousePosition = { pageX: null, pageY: null, originalPageY: null, originalScrollY: null };

window.addEventListener('mousemove', event => {
  mousePosition.pageX = event.pageX;
  mousePosition.pageY = mousePosition.originalPageY = event.pageY;
  mousePosition.originalScrollY = window.scrollY;
});

window.addEventListener('scroll', event => {
  if(mousePosition.originalScrollY >= 0) {
    mousePosition.pageY = mousePosition.originalPageY + (window.scrollY - mousePosition.originalScrollY);
  }
});

window.mousePosition = mousePosition;
