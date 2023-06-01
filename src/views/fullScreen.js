export function enterFullscreen() {

  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
        var elem = document.getElementById("body");
  
  if((navigator.userAgent.match(/iPhone/i)) || 
   (navigator.userAgent.match(/iPod/i))) {
    if (is_safari){
  
      // elem.onclick = function() {
      // }
      let req = elem.requestFullScreen || elem.webkitRequestFullScreen || elem.mozRequestFullScreen;
      req.call(elem);
      }
   }
   document.addEventListener('keyup', e => {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
      elem.webkitExitFullScreen();
         }
   })
}

export function disabledMenu() {
  /* prevent ios edit-menu */
if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
  !function(){
      var target = document.body; // the element where the edit menue should be disabled

      var preventSelRecursion;
      document.addEventListener('selectionchange', function(e){
          var S = getSelection();
          if (!S.rangeCount) return;
          if (S.isCollapsed) return;
          var r = S.getRangeAt(0);
          if (!target.contains(r.commonAncestorContainer)) return;
          if (preventSelRecursion) return;
          iosSelMenuPrevent();
      }, false);

      var iosSelMenuPrevent = debounce(function(){
          var S = getSelection();
          var r = S.getRangeAt(0);
          preventSelRecursion = true;
          S = getSelection();
          S.removeAllRanges();
          setTimeout(function(){ // make remove-add-selection removes the menu
              S.addRange(r);
              setTimeout(function(){
                  preventSelRecursion = false;
              });
          },4);
      },800); // if no selectionchange during 800ms : remove the menu

      /* helper-function */
      function debounce(fn, delay) {
          var timer = null;
          return function () {
              var context = this, args = arguments;
              clearTimeout(timer);
              timer = setTimeout(function () {
                  fn.apply(context, args);
              }, delay);
          };
      }
  }();
}
}
