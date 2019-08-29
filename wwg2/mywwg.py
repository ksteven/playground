import json,urllib2, re
from lxml import html

game_start = 1 # start of games you want to get
game_end = 528 # last game you want to get

records = []

for game in range(game_start, game_end+1):
	try:
		gameno = str(game)
		data = urllib2.urlopen("https://www.braingle.com/games/werewolf/game.php?id="+gameno).read()
		tree = html.fromstring(data)
		print('GAME: '+ gameno)
		players = tree.xpath('//div[@class="boxed"]//table//tr//td//a/text()')
		if len(players) < 1:
			print("INVALID GAME")
			continue
		roles = tree.xpath('//div[@class="boxed"]//table//tr//td[1]//img[1]/@alt')
		rounds = tree.xpath('//div[@class="box_footer space_top"]/text()')
		gameresult = tree.xpath('//div[@class="box_footer space_top"]//b/text()')[0]
		survived = tree.xpath('//div[@class="boxed"]//table//tr//td[a[img]][last()]')
		gamerds = re.sub("\D", "", rounds[0]) # strip non-numeric characters so only round # remains
		
		roundsurvived = []
		fate = []
		for res in survived:
			s = html.tostring(res)
			# use images to determine fate 
			if "accept.png" in s:
				fate.append("Survived")
			elif "blood.gif" in s:
				fate.append("Eaten")
			else:
				fate.append("Shot")
			result = re.search(';round=(.*)#end', s) # find round survived no.
			roundsurvived.append(result.group(1)) # add to array
		
		for i in range(len(players)): # prepare for JSON export
			record =	{
			  "gameno": gameno ,
			  "gamerds": gamerds,
			  "gameresult": gameresult,
			  "player": players[i],
			  "role": roles[i],
			  "survivedrds": roundsurvived[i],
			  "fate": fate[i]
			}
			records.append(record)
	except:
		print('INVALID GAME')
		continue

#print(json.dumps(records)) # export to JSON
with open('data.json', 'w') as f:
    json.dump(records, f)