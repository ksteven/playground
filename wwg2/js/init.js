(function ($) {
  $(function () {

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space

$(document).ready(function () {
  $('#example').DataTable({
    "ajax": 'https://ksteven.github.io/playground/wwg2/js/data.txt',
    "columns": [
      { "data": "Game #" },
      { "data": "Player" },
      { "data": "Role" },
      { "data": "Fate" },
      { "data": "Survived Rounds\n" },
      { "data": "Winner" },
      { "data": "Game Rounds" },
    ]
  });
  console.log(friends);
});
