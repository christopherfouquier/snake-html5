/*
 *
 *	@author: Christopher Fouquier
 *	@Version: Snake 0.1
 *	@Created: 05/05/2013
 *
 */

$(document).ready(function() {
	// Initialize variables
	var canvas  	= $('#snake');
	var context 	= canvas[0].getContext('2d');
	var score   	= 0;
	var level		= 1;
	var width   	= 500;
	var height  	= 500;
	var size        = 12;
	var stop 		= true;
	var gameOver    = false;
	var tmpScore 	= 200;
	var time 		= 0;
	window.onkeydown= controls;

	Snake = new Array();
	for(i=0; i < 3; i++) {
		objectSnake = { X: 250 - i * size, Y: 250, vX: 1, vY: 0 };
		Snake.push(objectSnake);
	}
	rat = {
		X: (Math.round((Math.random() * 490) / size) * size) - 2, 
		Y: (Math.round((Math.random() * 490) / size) * size) - 2
	}

	// Controls keyboard
	function controls(e) {
	  	if(e.keyCode == 37 && Snake[0].vX != 1) {
	    	Snake[0].vX = -1;
	    	Snake[0].vY = 0;
	  	}
	  	else if (e.keyCode == 38 && Snake[0].vY != 1) {
	    	Snake[0].vY = -1;
	    	Snake[0].vX = 0;
	  	}
	  	else if (e.keyCode == 39 && Snake[0].vX != -1) {
	    	Snake[0].vX = 1;
	    	Snake[0].vY = 0;
	  	}
	  	else if (e.keyCode == 40 && Snake[0].vY != -1) {
	    	Snake[0].vY = 1;
	    	Snake[0].vX = 0;
	  	}
	  	else if (e.keyCode == 13) {
	  		stopGame();
	  		gameOver = false;
	  	}
	}

	// Generate bg and border to the canvas 
	function bg() {
		context.fillStyle = "#A4C78D";
		context.fillRect(0 ,0, width, height);
		context.fill();

		context.strokeStyle = "#000000";
		context.strokeRect(0, 0, width, height);
	}

	// Generate block to snake
	function createBlock(x, y) {
		context.fillStyle = "#000000";
		context.fillRect(x ,y, 10, 10);
		context.fill();
	}

	// Add block in the snake
	function addBlock() {
		objectSnake = { 
			X: Snake[Snake.length-1].X - Snake[Snake.length-1].vX * size, 
			Y: Snake[Snake.length-1].Y - Snake[Snake.length-1].vY * size,  
			vX: Snake[Snake.length-1].vX, 
			vY: Snake[Snake.length-1].vY 
		};    
		Snake.push(objectSnake);
	}

	// Generate Snake
	function snake() {
		for(i=0; i < Snake.length; i++) {
			createBlock(Snake[i].X, Snake[i].Y);
		};
	}

	// Move snake
	function moveSnake() {
		for(i=0; i < Snake.length; i++) {
		    Snake[i].X += (Snake[i].vX * size);
		    Snake[i].Y += (Snake[i].vY * size);
		}
		for(i=Snake.length-1; i > 0; i--) {
		    Snake[i].vX = Snake[i-1].vX;
		    Snake[i].vY = Snake[i-1].vY;
		}
	}

	// Clear canvas
	function clearGame() {
	  	context.clearRect(0, 0, width, height);
	}

	// stop Game
	function stopGame() {
    	if(stop == false) {
    		stop = true;
    		writeText('PAUSE', 'msg');
    	}
    	else {
    		stop = false;
    		writeText('', 'msg');
    	}
	}

	// Start Game
	function processGame() {
	  	setTimeout(processGame, 200 - (level*10));
	  	clearGame();
	  	if(stop == false) {
			collision();
	  		moveSnake();
	  	}
	  	bg();
		createBlock(rat.X, rat.Y);
	 	snake();
	}

	function init() {
		Snake = new Array();
		for(i=0; i < 3; i++) {
			objectSnake = { X: 250 - i * size, Y: 250, vX: 1, vY: 0 };
			Snake.push(objectSnake);
		}
		rat = {
			X: (Math.round((Math.random() * 490) / size) * size) - 2, 
			Y: (Math.round((Math.random() * 490) / size) * size) - 2
		}
		bg();
		createBlock(rat.X, rat.Y);
	 	snake();
	}

	function writeText(value, id) {
		document.getElementById(id).innerHTML = value;
	}

	function collision() {
		if(Snake[0].X < -2 || Snake[0].X > width || Snake[0].Y < -2 || Snake[0].Y > height) {
			GameOver();
		}
		else if(Snake[0].X == rat.X && Snake[0].Y == rat.Y) {
			addBlock(Snake[Snake.length-1].X, Snake[Snake.length-1].Y);
			clearGame();
			scoreLevel();
			rat = {
				X: (Math.round((Math.random() * 490) / size) * size) - 2, 
				Y: (Math.round((Math.random() * 490) / size) * size) - 2
			}
			createBlock(rat.X, rat.Y);
		}
		for(i=1; i < Snake.length; i++) {
			if(Snake[0].X == Snake[i].X && Snake[0].Y == Snake[i].Y) {
				GameOver();
			}
		};
	}

	function GameOver() {
		init();
		score = 0;
		level = 1;
		tmpScore = 200;
		writeText(score, 'score');
		writeText(level, 'level');
		writeText(tmpScore, 'points');
		stop = false;
		gameOver = true;
		stopGame();
		writeText('GAME OVER', 'msg');
	}

	function scoreLevel() {
		score = score + 10;
		writeText(score, 'score');
		if(score == tmpScore) {
			level++;
			tmpScore = 200 + tmpScore;
			writeText(level, 'level');
			writeText(tmpScore, 'points');
		}
		if(level == 20) {
			stop = false;
			stopGame();
			writeText('WINNER', 'msg');
		}
	}

	function timer() {
		if(gameOver == true) {
			time = 0;
			writeText(time, 'time');
		}
		if(stop == false) {
			time++;
			writeText(time, 'time');
		}
		console.log(time);
		setTimeout(timer, 1000);
	}

	// Display score and level
	writeText('Press Start', 'msg');
	writeText(score, 'score');
	writeText(level, 'level');
	writeText(tmpScore, 'points');
	writeText(time, 'time');

	// Call function
    processGame();
    timer();
});