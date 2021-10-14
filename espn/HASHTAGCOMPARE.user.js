// ==UserScript==
// @name         HASHTAG - COMPARE
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  team comparison tool
// @author       You
// @match        https://hashtagbasketball.com/*
// @icon         https://www.google.com/s2/favicons?domain=hashtagbasketball.com
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

/*eslint no-undef:0*/

(function () {
    'use strict';
    let testmap = new Map(JSON.parse(localStorage.getItem('rosterMap')));
    console.log(testmap)
    if (testmap.size === 0) { // no rosters loaded
        // USE default 
        let mystr = `[["Captain Pingu  ",["Damian Lillard","Donovan Mitchell","Buddy Hield","Anthony Davis","Rudy Gobert","Draymond Green","Mike Conley","Kevin Porter Jr.","Robert Covington","Lauri Markkanen","Joe Harris","Al Horford","Bojan Bogdanovic","Ben Simmons","Dillon Brooks"]],["Wet Like  I'm Book",["Chris Paul","Devin Booker","Andrew Wiggins","Jayson Tatum","Joel Embiid","Tim Hardaway Jr.","Scottie Barnes","Clint Capela","Jarrett Allen","Jonas Valanciunas","Malik Beasley","T.J. McConnell","Aaron Gordon"]],["We The North Masaiah 😇✌️",["Stephen Curry","D'Angelo Russell","John Collins","De'Aaron Fox","Derrick White","Mikal Bridges","Kemba Walker","Brandon Ingram","Thaddeus Young","Darius Bazley","Mo Bamba","Daniel Gafford","Josh Giddey","Bam Adebayo","Jaren Jackson Jr."]],["WhattA Joke",["Trae Young","Zach LaVine","Jimmy Butler","Tobias Harris","Nikola Jokic","Tyrese Haliburton","Robert Williams III","Jusuf Nurkic","Harrison Barnes","Jordan Clarkson","Evan Fournier","Kyle Anderson","Joe Ingles","Gordon Hayward","Nerlens Noel"]],["Vucci Mane",["Ja Morant","Malcolm Brogdon","Khris Middleton","Giannis Antetokounmpo","Nikola Vucevic","Kyle Lowry","Domantas Sabonis","Spencer Dinwiddie","Isaiah Stewart","Bogdan Bogdanovic","Saddiq Bey","Eric Bledsoe","Brook Lopez"]],["Toronto Dan's Team",["Luka Doncic","Shai Gilgeous-Alexander","Anthony Edwards","Christian Wood","Jakob Poeltl","LaMelo Ball","Gary Trent Jr.","Myles Turner","Cade Cunningham","Tyler Herro","Kyle Kuzma","Dennis Schroder","De'Andre Hunter","Klay Thompson","Mitchell Robinson"]],["Shaqtin  A Fool ",["LeBron James","DeMar DeRozan","Kevin Durant","Pascal Siakam","Deandre Ayton","Marcus Smart","RJ Barrett","Richaun Holmes","Darius Garland","Victor Oladipo","Terrence Ross","Serge Ibaka","Duncan Robinson"]],["SterlingHeights Uncle Vaxxers",["Russell Westbrook","CJ McCollum","Paul George","Michael Porter Jr.","Montrezl Harrell","Jordan Poole","Jerami Grant","Collin Sexton","Wendell Carter Jr.","Bradley Beal","Marvin Bagley III","Reggie Jackson","Evan Mobley","Kyrie Irving"]],["Don Bodmon",["Dejounte Murray","Fred VanVleet","Jaylen Brown","OG Anunoby","Karl-Anthony Towns","Devonte' Graham","Caris LeVert","Jalen Suggs","P.J. Washington","Nickeil Alexander-Walker","Daniel Theis","Isaiah Roby","Killian Hayes","Chris Boucher","Jonathan Isaac"]],["YYZ Chin Diesel ",["Jrue Holiday","James Harden","Keldon Johnson","Julius Randle","Kristaps Porzingis","Lonzo Ball","Norman Powell","Jalen Green","Miles Bridges","Kelly Olynyk","Otto Porter Jr.","Larry Nance Jr.","Jaden McDaniels","Zion Williamson","Terry Rozier"]]]`
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
        //console.log(players);
        //console.log()
        for (let p of players) {
            $("#" + id + "-table > table > tbody").append("<tr>" + playerMap.get(p) + "</tr>");
        }
    })
    $("#ContentPlaceHolder1_GridView1").find('tr').each(function (row) {
        let playername = ""
        var mytd = $(this).find("td")[2]
        playername = $.trim($(mytd).text())
        playerMap.set(playername, $.trim($(this).html()))
    });
})();