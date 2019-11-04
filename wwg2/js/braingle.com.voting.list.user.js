// ==UserScript==
// @name     Voting List Automate
// @version  2.1
// @grant    none
// @include        http://www.braingle.com/games/werewolf/game.php?id=*
// @include        https://www.braingle.com/games/werewolf/game.php?id=*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// ==/UserScript==

// add button
if ($('input[name="vote"]').length > 0) { // check if active round
    // console.log('active round, add button');
    $('#main').find('.boxed_body > h2').eq(0).after('<p> <input id="doVLCopy" type="submit" value="Copy Voting List" class="button_primary t3"> <span id="result"></span></p>');
};
const colors = ["red", "blue", "green", "orange", "purple", "brown", "yellow", "lime", "aqua", "lilac", "navy"]

// utility functions
const count = names => names.reduce((a, b) => ({
    ...a,
    [b]: (a[b] || 0) + 1
}), {}) // don't forget to initialize the accumulator

function fallbackCopyTextToClipboard(text, cb) {
    let textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        let successful = document.execCommand('copy');
        let msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        cb(successful);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        cb(false);
    }
    document.body.removeChild(textArea);
}

function copyTextToClipboard(text, cb) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, cb);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
        cb(true);
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
        cb(false);
    });
}
// end utility functions 

$("#doVLCopy").click(function () {
    let vlList = doVLCopy();
    console.log(vlList);
    copyTextToClipboard(vlList, function (succ) {
        if (succ) {
            $("#result").html("Successfully copied!")
            $("#result").css('color', 'green');
        } else {
            $("#result").html("You must copy manually")
            $("#result").css('color', 'red');
            $("#result").append('<br/><textarea  onClick="this.select();" rows="4" cols="50">' + vlList + '</textarea>');
        };
    });
});

function doVLCopy() {
    let div_html = $('#main').find('.boxed_body').html();
    let splits = div_html.split("<br>");
    let add_this = false;
    let votes = [];
    let votes_for = [];
    for (let s in splits) {
        if (splits[s].length === 0) { // only start/stop adding when we find a blank
            add_this = !add_this;
        }
        if (add_this && splits[s].length > 0) {
            votes.push(splits[s]);
            let voted_for = splits[s].split(" ")[3];
            votes_for.push(voted_for);
        }
    }
    let count_votes = count(votes_for);
    let players = [];
    for (const [key, value] of Object.entries(count_votes)) {
        if (value > 1) {
            let player = { 'name': key, 'num': value };
            players.push(player);
        }
    };
    // sort Players desc by num votes
    players.sort(function (a, b) {
        return parseInt(b.num) - parseInt(a.num);
    });
    let countstr = "";
    for (let p in players) {
        player = players[p];
        countstr += "[color=" + colors[p] + "]" + player.name + " : " + player.num + "[/color]" + "\n";
    };
    countstr = (countstr.length > 0) ? "\n \n" + "<b>Totals</b>" + "\n" + countstr : "";
    for (let v in votes) {
        let vote = votes[v];
        let voted_for = vote.split(" ")[3];
        for (let p in players) {
            if (voted_for === players[p].name) { // add color
                votes[v] = "[color=" + colors[p] + "]" + vote + "[/color]"
            }
        }
    }
    return votes.join('\n') + countstr;
};