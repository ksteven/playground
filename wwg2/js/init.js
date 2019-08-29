(function ($) {
  $(function () {

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function () {
  $('#example').DataTable({
    "ajax": 'https://raw.githubusercontent.com/ksteven/playground/master/wwg2/js/data.txt?token=AEEDN7UXDWFMH32IMSJDPDS5NA2LG'
  });
});
