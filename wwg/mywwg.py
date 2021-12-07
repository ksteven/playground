import json
#import urllib2
from urllib.request import urlopen
import re
import lxml.html
import traceback
import logging
import ssl

game_start = 3379  # start of games you want to get
game_end = 3444  # last game you want to get

records = []
gcontext = ssl.SSLContext()  # Only for gangstars

for game in range(game_start, game_end+1):
    try:
        gameno = str(game)
        data = urlopen(
            "https://www.braingle.com/games/werewolf/game.php?id="+gameno, context=gcontext).read()
        tree = lxml.html.fromstring(data)
        print('GAME: ' + gameno)
        players = tree.xpath('//div[@class="boxed"]//table//tr//td//a/text()')
        if len(players) < 1:
            print("INVALID GAME")
            continue
        roles = tree.xpath(
            '//div[@class="boxed"]//table//tr//td[1]//img[1]/@alt')
        rounds = tree.xpath('//div[@class="box_footer space_top"]/text()')
        gameresult = tree.xpath(
            '//div[@class="box_footer space_top"]//b/text()')[0]
        survived = tree.xpath(
            '//div[@class="boxed"]//table//tr//td[a[img]][last()]')
        # strip non-numeric characters so only round # remains
        gamerds = re.sub("\D", "", rounds[0])

        roundsurvived = []
        fate = []
        for res in survived:
            s = lxml.html.tostring(res).decode()
            # use images to determine fate
            if s.find("accept.png") > -1:  # "accept.png" in s:
                fate.append("Survived")
            elif s.find("blood.gif") > -1:
                fate.append("Eaten")
            else:
                fate.append("Shot")
            result = re.search(';round=(.*)#end', s)  # find round survived no.
            roundsurvived.append(result.group(1))  # add to array

        gameresult = gameresult.split(" ")[1]
        for i in range(len(players)):  # prepare for JSON export
            role = roles[i]
            roleList = {
                "h": "Human",
                "w": "Werewolf",
                "s": "Seer",
            }

            record = {
                "Game #": gameno,
                "Game Rounds": gamerds,
                "Winner": gameresult,
                "Player": players[i],
                "Role": roleList.get(role),
                "Survived Rounds\n": roundsurvived[i],
                "Fate": fate[i]
            }
            records.append(record)
    except Exception as e:
        logging.error(traceback.format_exc())
        print('INVALID GAME')
        continue

# print(json.dumps(records)) # export to JSON
with open('data.json', 'w') as f:
    json.dump(records, f)
