'use strict';

(function () {
  var search = $('#search');
  var searchmenu = $('#searchmenu');
  search.on('keyup', function(e) {
    var val = e.target.value;
    var url = '/search/' + val;
    $.get(url, function(data) {
      var html = '';
      var max = data.length > 4 ? 5 : data.length;
      for (var i = 0; i < max; i += 1) {
        html += 
          '<a href="/article/' + 
          data[i].url +
          '" class="list-group-item">' +
          data[i].text +
          '</a>';
      }
      searchmenu.html(html);
    });
  });

  $( document ).ready(function () {
    $('.prevent').on('click', (e) => {
      e.preventDefault();
    });
  });

  var subemail = $('#subemail');
  if (subemail && subemail.length) {
    subemail.keypress(function (e) {
      var key = e.which;
      if(key == 13)  // the enter key code
        {
          $('#subform').submit();
          return false;  
        }
      });   
  }
}());
