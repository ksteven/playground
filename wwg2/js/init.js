$(document).ready(function () {
  const url = "https://ksteven.github.io/playground/wwg2/js/data.txt";
  var table;
  $.getJSON(url, function (data) {
    //console.log(data);
    table = makeTable(data);
    var player_data = data.data.sort(function (a, b) {
      return a.Player.toLowerCase().localeCompare(b.Player.toLowerCase());
    });
    var UniqueNames = player_data.map(function (d) { return d.Player; });
    var player_list = unique(UniqueNames);
    var player_map = {};
    for (play of player_list) {
      player_map[play] = null;
    };
    // console.log(player_map);
    $('#autocomplete-input').autocomplete({
      data: player_map,
      onAutocomplete: function (data) {
        // console.log('got ', data);
        table.column([1])
          .search(data ? '^' + data + '$' : '', true, false)
          .draw();
        // Games Played 	Win % 	Wins 	Losses 	Survival Rate 	Avg Round Killed

        $("#stat_container").removeClass('hide');
        $(".player_name").text(data);
        $('#player_stats').DataTable({
          "destroy": true,
          "data": calculateStats(data),
          "paging": false,
          "ordering": false,
          "info": false,
          "dom": 't',
          "columns": [
            { "data": "order" },
            { "data": "role" },
            { "data": "gp" },
            { "data": "winpct" },
            { "data": "wins" },
            { "data": "losses" },
            { "data": "survivalrate" },
            { "data": "rdSurvived" },
          ],
          "columnDefs": [
            { "visible": false, "targets": [0] }
          ]
        });
      },
    }).on("keyup", function (e) {
      if (e.keyCode == 13) {
        var instance = M.Autocomplete.getInstance($(this)[0]);
        // console.log(instance);
        $('ul.autocomplete-content > li')[0].click();
        //M.toast({ html: 'You must select an autocomplete option to search.' })
      }
    }).focusout(function () {
      var data = $(this).val();
      table.column([1])
        .search(data ? '^' + data + '$' : '', true, false)
        .draw();
      $("#stat_container").addClass('hide');
    });
    function calculateStats(playerName) {
      var games_played = player_data.filter(function (player) {
        return player.Player === playerName;
      });
      var human_games = games_played.filter(function (player) {
        return player.Role === "Human";
      });
      var wolf_games = games_played.filter(function (player) {
        return player.Role === "Werewolf";
      });
      var seer_games = games_played.filter(function (player) {
        return player.Role === "Seer";
      });
      //console.log('human', human_games, 'wolf', wolf_games, 'seer_games', seer_games);
      // Games Played 	Win % 	Wins 	Losses 	Survival Rate 	Avg Round Killed
      var human_row = {};
      var wolf_row = {};
      var seer_row = {};
      var total_row = {};

      human_row = statRowCalculator(human_row, human_games, "Humans", "Human", 0);
      wolf_row = statRowCalculator(wolf_row, wolf_games, "Werewolves", "Wolf", 1);
      seer_row = statRowCalculator(seer_row, seer_games, "Humans", "Seer", 2);
      total_row = statRowCalculator(total_row, games_played, "total", "Total", 3);

      // console.log(human_row, wolf_row, seer_row, total_row);
      return [human_row, wolf_row, seer_row, total_row];
    };
  });
  function unique(list) {
    var result = [];
    $.each(list, function (i, e) {
      if ($.inArray(e, result) == -1) result.push(e);
    });
    return result;
  }

  function statRowCalculator(row, games_list, winnerText, roleText, orderNo) {

    if (games_list.length > 0) {
      let average = (array) => array.reduce((a, b) => a + b) / array.length;
      row.gp = games_list.length;
      row.wins = games_list.filter(function (player) {
        if (winnerText !== "total")
          return $.trim(player.Winner) === winnerText;
        else
          return ($.trim(player.Winner).charAt(0) === player.Role.charAt(0))
            || (player.Role === "Seer" && $.trim(player.Winner) === "Humans")
      }).length;
      row.losses = row.gp - row.wins;
      row.winpct = ((row.wins / row.gp) * 100).toFixed(2) + "%";
      row.survivalrate = (((games_list.filter(function (player) {
        return player.Fate === "Survived";
      }).length) / row.gp) * 100).toFixed(2) + "%";
      row.rdSurvived = average(games_list.map(function (game) {
        return parseInt(game["Survived Rounds\n"]) - 1; // get 1 less than round
      })).toFixed(2);
      row.role = roleText;
      row.order = orderNo;
    } else {
      row = {
        order: orderNo,
        gp: 0,
        wins: " - ",
        losses: " - ",
        winpct: " - ",
        survivalrate: " - ",
        rdSurvived: " - ",
        role: roleText
      }
    }
    return row;
  }
  function makeTable(jsonData) {
    return $('#example').DataTable({
      //"ajax": 'https://ksteven.github.io/playground/wwg2/js/data.txt',
      "dom": '<f<t>ip>',
      "language": {
        "search": "Filter"
      },
      "initComplete": function (settings, json) {
        $("#table_loader_container").addClass('hide');
        $("#db_container").removeClass('hide');
      },
      "data": jsonData.data,
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
        { "visible": false, "targets": [4] },
        {
          // The `data` parameter refers to the data for the cell (defined by the
          // `data` option, which defaults to the column being worked with, in
          // this case `data: 0`.
          "render": function (data, type, row) {
            return '<a target="_blank" href="https://www.braingle.com/games/werewolf/game.php?id=' + data + '">' + data + '</a>';
          },
          "targets": 0
        }
      ]
    });
  }
});
//});