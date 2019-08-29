(function ($) {
  $(function () {

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function () {
  $('#example').DataTable({
    "ajax": 'data.txt',
    "columns": [
      { "data": "Game #" },
      { "data": "Player" },
      { "data": "Winner" },
      { "data": "Fate" },
      { "data": "Game Rounds" },
      { "data": "Role" }
    ]

  });
});
