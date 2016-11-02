/**
* Draws to canvas based on device motion
*/
var r = 20
var g = [0,1]
var b = 255
var a = 0.8

var x, y;
var oldX, oldY;
var currentlyDrawing = false;
var currentlyCasting = false;
var isIosDevice = false;
var theta = 0;
var startCastTime = 0.0;

var matchMedia = window.msMatchMedia || window.MozMatchMedia || window.WebkitMatchMedia || window.matchMedia

function setup(){
	var canvas = createCanvas(windowWidth, windowHeight)
	canvas.parent(main)
	fill("#55f")
	stroke("#55f")
    strokeWeight(2)
	x = main.offsetWidth/2
	y = main.offsetHeight/2
    oldX = x;
    oldY = y;

    iOSChecker();

    castButton = createButton('Cast');
    castButton.addClass('cssCastButton');
    castButton.mousePressed(triggerCastingAnimation);
    discardButton = createButton('Discard');
    discardButton.addClass('cssDiscardButton');
    discardButton.mousePressed(discardDrawing);
    stopButton = createButton('Stop');
    stopButton.addClass('cssStopButton');
    stopButton.mouseClicked(stopDrawing);
    startButton = createButton('Start');
    startButton.addClass('cssStartButton');
    startButton.mouseClicked(startDrawing);
    stopButton.hide();
}

function draw(){
	wrapColor(g)
	fill(r, g[0], b)
	stroke(r, g[0], b)

	if(window.DeviceMotionEvent){
		window.addEventListener("devicemotion", followMotion, false)
	}else{
		console.log("DeviceMotionEvent is not supported")
	}

    if (currentlyCasting) {
        castSigil();
        if (millis() - startCastTime > 10000) {
            discardDrawing();
            currentlyCasting = false;
        }
    }
}

function followMotion(e){
    if (currentlyDrawing) {
        oldX = x
        oldY = y

        if (isIosDevice) {
            x += e.accelerationIncludingGravity.x
        } else {
    	    x -= e.accelerationIncludingGravity.x
        }

    	if (x < 0){
    		x = 0
    	}
    	else if(x > main.offsetWidth){
    		x = main.offsetWidth
    	}
    	
        if (isIosDevice) {
            y -= e.accelerationIncludingGravity.y
        } else {
    	    y += e.accelerationIncludingGravity.y
        }

    	if (y < 0){
    		y = 0
    	}
    	else if(y > main.offsetHeight){
    		y = main.offsetHeight
    	}

        line(oldX, oldY, x, y);
    } 
}

/** sets isIosDevice as true if using an iOS device ***/
function iOSChecker() {

    var iDevices = [
        'iPad',
        'iPhone',
        'iPod'
    ];

    if (!!navigator.platform) {
        console.log(navigator.platform)
        while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) { 
                isIosDevice = true; 
            }
        }
    }
}

/** resets pen and wipes canvas ***/
function discardDrawing() {
    x = main.offsetWidth/2
    y = main.offsetHeight/2
    background(0,0,0);
    stopButton.hide();
    startButton.show();
    currentlyDrawing = false;
    currentlyCasting = false;
}

/** resets sigil animation variables and stops pen movement ***/
function triggerCastingAnimation() {
    startCastTime = millis();
    currentlyCasting = true;
    currentlyDrawing = false;
    theta = 0.0;
}

/** animates flickery circles as your sigil fades into the void ***/
function castSigil() {
    circleXsm = 50 * cos(theta) + (windowWidth/2);
    circleYsm = 50 * sin(theta) + (windowHeight/2);
    ellipse(noise(circleXsm), noise(circleYsm), 5, 5);
    circleX = 100 * cos(theta) + (windowWidth/2);
    circleY = 100 * sin(theta) + (windowHeight/2);
    ellipse(circleX, circleY, 5, 5);
    circleXlg = 150 * cos(theta) + (windowWidth/2);
    circleYlg = 150 * sin(theta) + (windowHeight/2);
    ellipse(circleXlg, circleYlg, 5, 5);
    theta += 1;
    background('rgba(0%,0%,0%,0.01)')
}

/** starts pen motion and shows the stop button ***/
function startDrawing() {
    currentlyDrawing = true;
    startButton.hide();
    stopButton.show();
}

/** stops pen motion and shows the start button ***/
function stopDrawing() {
    currentlyDrawing = false;
    stopButton.hide();
    startButton.show();
}

/** convert a value from one range to another ***/
function convertRange( val, r1, r2 ) { 
    return (val - r1[0])*(r2[1] - r2[0])/(r1[1] - r1[0]) + r2[0]
}

/** wrap color around ***/
function wrapColor(val){
    //colour array stores two ints, the currently being-drawn colour and most-recent drawn colour
    //first we check to see if we're at the end of the colour wheel, if we are we 
    //have to switch direction.  Otherwise, we check what direction we're going, move current into 
    //last and increment or decrement current
    if (val[0] === 0) {
        val[1] = val[0]
        val[0] = 1
    } else if (val[0] === 255) {
        val[1] = val[0]
        val[0] = 250
    } else if (val[0] > val[1]) {
        val[1] = val[0]
        val[0] = val[0]+1
    } else {
        val[1] = val[0]
        val[0] = val[0]-1
    }
}