fieldSize = 20
isNotEnd = true
checkLeft = true
# Tile initialization
tiles = []
for y in [1..fieldSize]
	for x in [1..fieldSize]
		tiles.push("block#{y}-#{x}")

mouse =
	x: 0
	y: 0

mousestate = 0
leftOver = fieldSize ** 2
score = 0

# Update the Scoreboard
updateScore = (add) ->
	score += add
	leftOver = 0;
	for tile in tiles
		if (tile != null)
			leftOver++
	if leftOver == 0
		score += 1000
		isNotEnd = false
	document.getElementById("score").innerHTML = score.toString()
	document.getElementById("leftover").innerHTML = leftOver.toString();
	console.log("Score: #{score}")
	console.log("Left: #{leftOver}")


# Getting Mouse Position
getMouse = (evnt) ->
	cnvs = wnd.screen.getBoundingClientRect();
	retVal =
		x: evnt.clientX - cnvs.left
		y: evnt.clientY - cnvs.top

# Do this on click
click = () ->
	deletable = []
	for tile in tiles
		if(tile != null)
			if (tile.state == true)
				deletable.push(tiles.indexOf(tile))
	ic = 0
	if (deletable.length > 1)
		for tile in deletable
			tiles[tile] = null
		if (deletable.length == 3)
			toAdd = 1
		else if (deletable.length > 3)
			toAdd = (deletable.length - 2) * 2
		else
			toAdd = 0
		updateScore(toAdd)

# Checking for Clicks
checkMouse = () ->
	document.body.onmousedown = () ->
		++mousestate
	document.body.onmouseup = () ->
		if mousestate > 0
			click()
			isNotEnd = false
			for tile in tiles
				if (tile != null)
					tile.getSurrElems()
					if (isNotEnd == false)
						if (tile.topElem != undefined)
							if (tiles[tile.topElem].origColor == tile.origColor)
								isNotEnd = true
						if (tile.rightElem != undefined)
							if (tiles[tile.rightElem].origColor == tile.origColor)
								isNotEnd = true
						if (tile.bottomElem != undefined)
							if (tiles[tile.bottomElem].origColor == tile.origColor)
								isNotEnd = true
						if (tile.leftElem != undefined)
							if (tiles[tile.leftElem].origColor == tile.origColor)
								isNotEnd = true
			mousestate = 0
		else
			mousestate = 0


# Start Game Function
startGame = () ->
	wnd.start()
	wnd.screen.addEventListener("mousemove", (evnt) ->
		mousepos = getMouse(evnt)
		mouse.x = mousepos.x
		mouse.y = mousepos.y
	,false)
	dx = 0
	dy = 0
	for tile in tiles
		randInt = Math.floor(Math.random() * 3)
		if randInt == 0
			tileColor = "Green"
		else if randInt == 1
			tileColor = "Salmon"
		else
			tileColor = "Blue"
		tiles[tiles.indexOf(tile)] = new Component(40, 40, tileColor, dx, dy)
		dx += 40
		if dx >= 800
			dx = 0
			dy +=40
	for tile in tiles
		if (tile != null)
			tile.getSurrElems()
	return

# Component Class
class Component
	constructor: (@width, @height, @color, @x, @y) ->
		@origColor = @color
		@state = false;
		ctx = wnd.context
		ctx.fillStyle = @color
		ctx.fillRect(@x, @y, @width, @height)
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1
		ctx.strokeRect(@x, @y, @width, @height)
	getSurrElems: () ->
		@topElem = undefined
		@rightElem = undefined
		@bottomElem = undefined
		@leftElem = undefined
		for tile in tiles
			if (tile != null)
				if (tile.x == @x) && (tile.y == @y - 40)
					@topElem = tiles.indexOf(tile);
				if (tile.x == @x + 40) && (tile.y == @y)
					@rightElem = tiles.indexOf(tile);
				if (tile.x == @x) && (tile.y == @y + 40)
					@bottomElem = tiles.indexOf(tile);
				if (tile.x == @x - 40) && (tile.y == @y)
					@leftElem = tiles.indexOf(tile);
		return
	updateComp: () ->
		if (@bottomElem == undefined && @y < 760)
			@y += 40
			for tile in tiles
				if (tile != null)
					tile.getSurrElems()
			for tile in tiles
				if (tile != null)
					if (tile.y < 760 && tile.bottomElem == undefined)
						checkLeft = false

		if (checkLeft == true && @y == 760 && @x != 0 && @leftElem == undefined)
			for tile in tiles
				if (tile != null)
					if (tile.x >= @x)
						tile.x -= 40
			for tile in tiles
				if (tile != null)
					tile.getSurrElems()
		ctx = wnd.context
		ctx.fillStyle = @color
		ctx.fillRect(@x, @y, @width, @height)
		ctx.strokeStyle = "white";
		ctx.lineWidth = 1
		ctx.strokeRect(@x, @y, @width, @height)
		if (@state == true)
			@color = @origColor
			@color = "light#{@color}"
		else
			@color = @origColor
	getState: () ->
		@state
	checkState: ()->
		if ((mouse.x > @x && mouse.x < @x + 40) && (mouse.y > @y && mouse.y < @y + 40))
			for tile in tiles
				if (tile != null)
					if tile.origColor != @origColor
						tile.state = false
			@state = true
		else
			@state = false

			if (@topElem != undefined)
				if (tiles[@topElem].getState() == true) && (tiles[@topElem].origColor == @origColor)
					@state = true
			if (@rightElem != undefined)
				if (tiles[@rightElem].getState() == true) && (tiles[@rightElem].origColor == @origColor)
					@state = true
			if (@bottomElem != undefined)
				if (tiles[@bottomElem].getState() == true) && (tiles[@bottomElem].origColor == @origColor)
					@state = true
			if (@leftElem != undefined)
				if (tiles[@leftElem].getState() == true) && (tiles[@leftElem].origColor == @origColor)
					@state = true

	giveInfo: () ->
		console.log(@width, @height, @color, @x, @y)
		return

# Update Function
update = () ->
	wnd.clear()
	checkMouse()
	checkLeft = true
	for tile in tiles
		if (tile != null)
			tile.checkState()
			tile.updateComp()
	if (isNotEnd == false)
		wnd.stop()
		return
	return

voidAction = () ->
	return

# Window Object
wnd =
	screen: document.createElement("canvas")
	start: () ->
		@screen.width = 800
		@screen.height = 800
		@context = @screen.getContext("2d")
		document.body.insertBefore(@screen, document.body.childNodes[2])
		@interval = setInterval(update, 20)
		return
	clear: () ->
		@context.clearRect(0,0, @screen.width, @screen.height)
		return
	stop: () ->
		@interval = setInterval(voidAction, 10000)
		span = document.createElement("span")
		span.innerHTML = "Game Over<br/>Score: #{score}"
		document.body.insertBefore(span, document.body.childNodes[2])

startGame()