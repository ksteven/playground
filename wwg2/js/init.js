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
    ],
    "columnDefs": [
      {
        // The `data` parameter refers to the data for the cell (defined by the
        // `data` option, which defaults to the column being worked with, in
        // this case `data: 0`.
        "render": function (data, type, row) {
          if (row['Fate'] !== 'Survived')
            return data + ' (' + (parseInt(row['Survived Rounds\n']) - 1) + ')';
          else
            return data;
        },
        "targets": 3
      },
      { "visible": false, "targets": [4] }
    ]
  });
});
