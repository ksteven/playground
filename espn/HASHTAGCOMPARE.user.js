// ==UserScript==
// @name         HASHTAG - COMPARE
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  team comparison tool
// @author       You
// @match        https://hashtagbasketball.com/*
// @match        https://fantasy.espn.com/basketball/league/*
// @icon         https://www.google.com/s2/favicons?domain=hashtagbasketball.com
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

/*eslint no-undef:0*/

(function () {
    'use strict';
    // espn page
    const header = $($(".header")[0]).text().trim()
    console.log("header is ", header);
    if (header === "League Rosters" && $(".subHeader")) {
        rosterPageLoad();
    }

    // hashtag basketball page
    let testmap = new Map(JSON.parse(localStorage.getItem('rosterMap')));
    console.log(testmap)
    if (testmap.size === 0) { // no rosters loaded
        // USE default
        let mystr = `[["WhattA Joke",["Tyrese Haliburton","Jimmy Butler","Harrison Barnes","Robert Williams III","Jusuf Nurkic","Trae Young","Gordon Hayward","Eric Gordon","Matisse Thybulle","Nikola Jokic","Zach LaVine","Evan Fournier","Will Barton","Tobias Harris"]],["SterlingHeights Uncle Vaxxers",["Russell Westbrook","Jordan Clarkson","Jerami Grant","Evan Mobley","Montrezl Harrell","CJ McCollum","Wendell Carter Jr.","Paul George","Bradley Beal","Collin Sexton","Michael Porter Jr.","Reggie Jackson","Jordan Poole","Kyrie Irving"]],["Wet Like  I'm Book",["Chris Paul","Devin Booker","Scottie Barnes","Jayson Tatum","Joel Embiid","Tim Hardaway Jr.","Aaron Gordon","Clint Capela","Jarrett Allen","Jonas Valanciunas","Andrew Wiggins","T.J. McConnell","Anfernee Simons"]],["Don Bodmon",["Devonte' Graham","Nickeil Alexander-Walker","Jaylen Brown","OG Anunoby","Kelly Olynyk","Caris LeVert","Jae'Sean Tate","Fred VanVleet","Jalen Suggs","Cole Anthony","Karl-Anthony Towns","Dejounte Murray","P.J. Washington","Jonathan Isaac","Brook Lopez"]],["Toronto Dan's Team",["Cade Cunningham","Shai Gilgeous-Alexander","Anthony Edwards","Myles Turner","Christian Wood","LaMelo Ball","Kyle Kuzma","Tyler Herro","Dennis Schroder","Gary Trent Jr.","Luka Doncic","Jakob Poeltl","Mitchell Robinson","Klay Thompson"]],["Captain Pingu  ",["Damian Lillard","Donovan Mitchell","Buddy Hield","Anthony Davis","Rudy Gobert","Mike Conley","Robert Covington","Kevin Porter Jr.","Al Horford","Bojan Bogdanovic","Draymond Green","Lauri Markkanen","Ricky Rubio","Ben Simmons","Dillon Brooks"]],["Vucci Gang",["Kyle Lowry","Tyrese Maxey","Saddiq Bey","Isaiah Stewart","Nikola Vucevic","Chris Duarte","Carmelo Anthony","Spencer Dinwiddie","Bogdan Bogdanovic","Pat Connaughton","Giannis Antetokounmpo","Domantas Sabonis","Ja Morant","Khris Middleton","Malcolm Brogdon"]],["We The North Masaiah 😇✌️",["Mo Bamba","Derrick White","John Collins","Bam Adebayo","Mikal Bridges","Josh Giddey","Stephen Curry","De'Aaron Fox","Jaren Jackson Jr.","Steven Adams","Mason Plumlee","Franz Wagner","Jalen Brunson","Brandon Ingram","D'Angelo Russell"]],["YYZ Chin Diesel ",["Lonzo Ball","Terry Rozier","Norman Powell","Miles Bridges","Alperen Sengun","Kemba Walker","Julius Randle","James Harden","Jalen Green","Alex Caruso","Kristaps Porzingis","Keldon Johnson","Desmond Bane","Zion Williamson","Jrue Holiday"]],["Shaqtin  A Fool ",["Seth Curry","Darius Garland","Kevin Durant","Richaun Holmes","Deandre Ayton","Terrence Ross","Duncan Robinson","LeBron James","DeMar DeRozan","Marcus Smart","RJ Barrett","Serge Ibaka","Kelly Oubre Jr.","Pascal Siakam","Victor Oladipo"]]]`
        testmap = new Map(JSON.parse(mystr))
    }
    let keys = Array.from(testmap.keys());
    let teamListSelect = `<select class="teamselector" class="form-control"><option></option>`;
    for (let k of keys) {
        let option = `<option value="${k}">${k}</option>`
        teamListSelect = teamListSelect + option
    }
    teamListSelect = teamListSelect + `</select>`
    let thead = `
    <tr align="center">
			<th scope="col">R#</th>
            <th scope="col"><a href="#">PLAYER</a></th><th scope="col"><a href="#">POS</a></th>
            <th scope="col"><a href="#">GP</a></th>
            <th scope="col"><a href="#">GP</a></th>
            <th scope="col"><a href="#">MPG</a></th>
            <th scope="col"><a href="#">FG%</a></th>
            <th scope="col"><a href="#">FT%</a></th>
            <th scope="col"><a href="#">3PM</a></th>
            <th scope="col"><a href="#">PTS</a></th>
            <th scope="col"><a href="#">TREB</a></th>
            <th scope="col"><a href="#">AST</a></th><th scope="col"><a href="#">STL</a></th>
            <th scope="col"><a href="#">BLK</a></th><th scope="col">
            <a href="#">TO</a></th><th scope="col"><a href="#">TOTAL</a></th>
		</tr>`
    let teamCompPanel = `<div class="table-responsive">
      <table class="table table-bordered" id="versus">
          <tbody>
          <tr>
          <input id="importstr" class="form-control" /> <button id="import">Import</button>
          </tr>
          <tr>
              <td>TEAM 1</td>
              <td>TEAM 2</td>

          </tr>
          <tr>
              <td id="team1">${teamListSelect}</td>
              <td id="team2">${teamListSelect}</td>
          </tr>
          <tr>
          <td id="team1-table">
           <table class="table table-bordered"><tbody>${thead}</tbody></table>
          </td>
          <td id="team2-table">
           <table class="table table-bordered"><tbody>${thead}</tbody></table>
          </td>
          </tr>
      </tbody></table>
      </div>`
    $(".heading-pricing").append(teamCompPanel)
    $("#ContentPlaceHolder1_DDSHOW").val("600").change()
    $(".alert").hide()
    $("#import").click(function () {
        let importString = $("#importstr").val()
        localStorage.setItem('rosterMap', importString);
    })
    const playerMap = new Map()
    $(".teamselector").change(function () {
        let id = $(this).parent().attr("id")
        let teamid = "#" + id + "-table"
        $(teamid).html(`<table class="table table-bordered"><tbody>${thead}</tbody></table>`)
        let players = testmap.get($(this).val())
        for (let p of players) {
            $("#" + id + "-table > table > tbody").append("<tr>" + playerMap.get(p) + "</tr>");
        }
    })
    setTimeout(function () {
        $("#ContentPlaceHolder1_GridView1").find('tr').each(function (row) {
            let playername = ""
            var mytd = $(this).find("td")[1]
            playername = $.trim($(mytd).text())
            playerMap.set(playername, $.trim($(this).html()))
        });
        if ($("#copyRosters")) {
            $("#copyRosters").css('display', 'inline-block');
        }
    }, 3000);
    // console.log(playerMap)

    function rosterPageLoad() {
        return setTimeout(function () {
            $(".subHeader").html('<button id="copyRosters" style="display:block" class="Button Button--alt Button--custom autob">Save Roster List</button>')
            $("#copyRosters").click(function () {
                const rosterMap = new Map()
                $(".ResponsiveTable").each(function (r) {
                    let team = $(this).find(".teamName").text()
                    let players = []
                    let playersAnchor = $(this).find(".player-column__athlete > .truncate > a").each(function (p) {
                        if ($(this).text().length > 0) {
                            players.push($(this).text())
                        }
                    })
                    rosterMap.set(team, players)
                })
                let stringRoster = JSON.stringify(Array.from(rosterMap.entries()))
                localStorage.setItem('rosterMap', stringRoster);
                let testmap = new Map(JSON.parse(localStorage.getItem('rosterMap')));
                navigator.clipboard.writeText(stringRoster)
                $(this).parents(".container").append(`<p><textarea rows=10 style="width:100%">${stringRoster} `)
            })

        }, 2000)
    }
})();