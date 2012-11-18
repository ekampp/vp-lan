$._select = function $(sel, scope) {
	return Array.prototype.slice.call((scope || document).querySelectorAll(sel))
}
function $$(sel, scope) {
	return (scope || document).querySelector(sel)
}

function drawSeats(canvas, seats) {
	var ctx = canvas.getContext('2d')

	seats.forEach(drawSeat.bind(null, ctx))
}

function drawLegend(canvas) {
	var ctx = canvas.getContext('2d')
	drawSeat(ctx, { occupant: true, position: [ 0, 0 ], 'occupant-name': 'Occupied' })
	drawSeat(ctx, { occupant: false, position: [ 2, 0 ], 'occupant-name': 'Empty' })
}

function drawSeat(ctx, seat) {
	var width = 30
	  , height = 30
	  , padding = 15
	  , x = seat.position[0] * (width + padding)
	  , y = seat.position[1] * (height + padding)
	  , person = { radius: 10, x: x+(width/2), y: y+(height/2) }
	  , table = { height: 30, width: 5, x: x+width-5, y: y }
	  , text = { content: seat['occupant-name'] || '', x: x, y: y+height+10 }

	ctx.beginPath()
	ctx.rect(table.x, table.y, table.width, table.height)
	ctx.arc(person.x, person.y, person.radius, 0, 360)
	if(seat.occupant) {
		ctx.fill()
	} else {
		ctx.stroke()
	}
	ctx.font = '10px Helvetica'
	ctx.fillText(text.content, text.x, text.y)
}
