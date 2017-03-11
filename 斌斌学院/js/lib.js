    $ = function(id) {
        return document.getElementById(id);
      }
      //添加监听
    function addEvent(element, event, listerner) {
      if (element.addEventListener) {
        element.addEventListener(event, listerner, false);
      } else if (element.attachEvent) {
        element.attachEvent('on' + event, listerner); //IE5+
      } else {
        element["on" + event] = listerner;
      }
    }