/**
* Draws to canvas based on device motion
*/
var r = 20
var g = 50
var b = 255
var a = 0.8

var x, y

var matchMedia = window.msMatchMedia || window.MozMatchMedia || window.WebkitMatchMedia || window.matchMedia

function setup(){
	var main = document.getElementById("main")
	var canvas = createCanvas(main.offsetWidth, main.offsetHeight)
	canvas.parent(main)
	fill("#55f")
	stroke("#55f")
	x = main.offsetWidth/2
	y = main.offsetHeight/2
}

function draw(){
	g = wrapColor(g)
	fill(r, g, b)
	stroke(r, g, b, a)

	if(window.DeviceMotionEvent){
		window.addEventListener("devicemotion", followMotion, false)
	}else{
		console.log("DeviceMotionEvent is not supported")
		
	}
}

function followMotion(e){

	// var mx = main.offsetWidth/2
	// var my = main.offsetHeight/2

	// ellipse(mx, my, 5, 5)

	x -= e.accelerationIncludingGravity.x
	if (x < 0){
		x = 0
	}
	else if(x > main.offsetWidth){
		x = main.offsetWidth
	}
	// x = constrain(x, [0, main.offsetWidth])
	
	y += e.accelerationIncludingGravity.y
	if (y < 0){
		y = 0
	}
	else if(y > main.offsetHeight){
		y = main.offsetHeight
	}


	ellipse(x, y, 5, 5)
	
}


/** convert a value from one range to another ***/
function convertRange( val, r1, r2 ) { 
  return (val - r1[0])*(r2[1] - r2[0])/(r1[1] - r1[0]) + r2[0]
}

/** wrap color around ***/
function wrapColor(val){
	val += 1
	if (val > 255){
		return 0
	}
	else { return val }
}