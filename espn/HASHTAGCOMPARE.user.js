// ==UserScript==
// @name         HASHTAG - COMPARE
// @namespace    http://tampermonkey.net/
// @version      0.4
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
        let mystr = `[["WhattA Joke",["Trae Young","Zach LaVine","Gordon Hayward","Robert Williams III","Jusuf Nurkic","Evan Fournier","Nikola Jokic","Tobias Harris","Will Barton","Jimmy Butler","Tyrese Haliburton","Harrison Barnes","Daniel Gafford"]],["SterlingHeights Uncle Vaxxers",["Russell Westbrook","Jordan Clarkson","Michael Porter Jr.","Evan Mobley","Montrezl Harrell","CJ McCollum","Jerami Grant","Bradley Beal","Collin Sexton","Wendell Carter Jr.","Paul George","Reggie Jackson","Jordan Poole","Kyrie Irving"]],["Wet Like  I'm Book",["Chris Paul","Devin Booker","Scottie Barnes","Jayson Tatum","Joel Embiid","T.J. McConnell","Clint Capela","Jarrett Allen","Aaron Gordon","Andrew Wiggins","Tim Hardaway Jr.","Jonas Valanciunas","Grayson Allen"]],["Don Bodmon",["Cole Anthony","Fred VanVleet","Cam Reddish","Chris Boucher","Karl-Anthony Towns","Dejounte Murray","P.J. Washington","Jaylen Brown","OG Anunoby","Jalen Suggs","Nickeil Alexander-Walker","Devonte' Graham","Hassan Whiteside","Caris LeVert","Jonathan Isaac"]],["Toronto Dan's Team",["Luka Doncic","Shai Gilgeous-Alexander","Anthony Edwards","Myles Turner","Jakob Poeltl","LaMelo Ball","Kyle Kuzma","Mitchell Robinson","Dennis Schroder","Gary Trent Jr.","Christian Wood","Cade Cunningham","Tyler Herro","Klay Thompson"]],["Captain Pingu  ",["Damian Lillard","Donovan Mitchell","Buddy Hield","Anthony Davis","Rudy Gobert","Ricky Rubio","Robert Covington","Draymond Green","Lauri Markkanen","Al Horford","Mike Conley","Kevin Porter Jr.","Bojan Bogdanovic","Ben Simmons","Dillon Brooks"]],["Vucci Gang",["Ja Morant","Tyrese Maxey","Saddiq Bey","Domantas Sabonis","Nikola Vucevic","Malcolm Brogdon","Giannis Antetokounmpo","Spencer Dinwiddie","Bogdan Bogdanovic","Eric Bledsoe","Khris Middleton","Kyle Lowry","Isaiah Stewart","Brook Lopez"]],["We The North Masaiah 😇✌️",["D'Angelo Russell","Mikal Bridges","Brandon Ingram","Mo Bamba","Josh Giddey","John Collins","Jaren Jackson Jr.","Derrick White","Stephen Curry","De'Aaron Fox","Steven Adams","Mason Plumlee","Franz Wagner","Bam Adebayo"]],["YYZ Chin Diesel ",["Lonzo Ball","Terry Rozier","Norman Powell","Miles Bridges","Alperen Sengun","Kemba Walker","Julius Randle","Keldon Johnson","Alex Caruso","Desmond Bane","James Harden","Kristaps Porzingis","Jalen Green","Zion Williamson","Jrue Holiday"]],["Shaqtin  A Fool ",["Seth Curry","Darius Garland","Kevin Durant","Richaun Holmes","Deandre Ayton","Terrence Ross","Kelly Oubre Jr.","DeMar DeRozan","RJ Barrett","Marcus Smart","LeBron James","Serge Ibaka","Duncan Robinson","Pascal Siakam","Victor Oladipo"]]]`
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
			<th scope="col">R#</th><th scope="col"><a href="#">ADP</a></th><th scope="col"><a href="#">PLAYER</a></th><th scope="col"><a href="#">POS</a></th>
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
    }, 3000);
    // console.log(playerMap)

    function rosterPageLoad() {
        return setTimeout(function () {
            $(".subHeader").html('<button id="copyRosters" class="Button Button--alt Button--custom autob">Save Roster List</button>')
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
                $(this).parents(".container").append(`<p><textarea rows=10 style="width:100%">${stringRoster}</textbox></p>`)
            })

        }, 2000)
    }
})();