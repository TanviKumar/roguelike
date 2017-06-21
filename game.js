function Game(){
	this.demontimerCount = 0;
	this.playerObject= new Player();
	this.canvasObject= new CanvasDisplay();
	this.timerCount=0;
	this.boosterCount=0;
	this.boosterSet = false;
	this.duration =240;

};

Game.prototype.timer = function(){
	this.duration--;
	var minutes , seconds;
	minutes = parseInt(this.duration / 60, 10);
seconds = parseInt(this.duration % 60, 10);
minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.innerHTML = minutes + ":" + seconds;
    this.playerObject.timePoints = this.duration*10;
    if(this.duration<0){
	this.loser();
	window.cancelAnimationFrame(myReq);
	onLoad();
    }
}


Game.prototype.drawFn = function(){
	this.canvasObject.drawFrame();
	var dirNum = this.playerObject.directionAssign();
	this.canvasObject.drawPlayer(dirNum);
	this.playerObject.updateLevel();
}

Game.prototype.changeBasics = function(){
	this.canvasObject.moveCount++;
	this.canvasObject.moveCount%=4;
	directionKey=0;
}

Game.prototype.changePosition= function(){
	switch(directionKey){
		case 37   : if(this.canvasObject.yValue>0&&this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue-1]!=0)
						this.canvasObject.yValue--;
					this.playerObject.direction="left";
					this.changeBasics();
					break;
		case 38   : if(this.canvasObject.xValue>0&&this.canvasObject.map[this.canvasObject.xValue-1][this.canvasObject.yValue]!=0)
						this.canvasObject.xValue--;
					this.playerObject.direction="up";
					this.changeBasics();
					break;
		case 39   : if(this.canvasObject.yValue<this.canvasObject.length-1&&	this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue+1]!=0)
						this.canvasObject.yValue++;
					this.playerObject.direction="right";
					this.changeBasics();
					break;
		case 40   : if(this.canvasObject.xValue<this.canvasObject.width-1&&this.canvasObject.map[this.canvasObject.xValue+1][this.canvasObject.yValue]!=0)
						this.canvasObject.xValue++;
					this.playerObject.direction="down";
					this.changeBasics();
					break;
	}
}

Game.prototype.loser = function(){
	alert("Feil. Back to square 1.")
	this.playerObject.level=1;
	document.getElementById("level").innerHTML= this.playerObject.level;
	this.playerObject.updatePoint(-this.playerObject.points);
}

Game.prototype.nextLevel = function(){
	if(this.playerObject.level>3){
		alert("Great Job! " + document.getElementById("points").innerHTML);
		this.playerObject.updateLevel();
		document.getElementById("points").innerHTML=00;
		this.playerObject.level=1;
		onLoad();
	}
	else{
		alert("Next Level");
		this.playerObject.updateLevel();
		onLoad();

	}
}

Game.prototype.updateFn = function(dt){
	this.timerCount+=dt;
	this.demontimerCount+=dt;
	if(this.boosterSet==true){
		this.boosterCount+=dt;
	}
	this.changePosition();

	if(this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue]==2){
		this.playerObject.updatePoint(this.playerObject.timePoints);
		this.playerObject.level++;
		window.cancelAnimationFrame(myReq);
		this.nextLevel();
	}
	else if(this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue]==-1&&this.boosterSet==false){
		music.pause();
		scream.play();
		this.loser();
		window.cancelAnimationFrame(myReq);
		onLoad();
	}
	else if(this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue]==3){
		this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue]=1;
		this.playerObject.updatePoint(100);
		this.timerCheck();
	}
	else if(this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue]==4){
		this.canvasObject.map[this.canvasObject.xValue][this.canvasObject.yValue]=1;
		this.playerObject.updatePoint(500);
		this.boosterSet=true;
		this.timerCheck();
	}
	else
		this.timerCheck();	
}

Game.prototype.timerCheck = function(){
	if(this.timerCount>1){
		this.timer();
		this.timerCount=0;
	}
	if(this.demontimerCount>0.5){
		this.canvasObject.demonTimer();
		this.demontimerCount=0;
	}
	if(this.boosterCount>20&&this.boosterSet==true){
		this.boosterSet=false;
		this.boosterCount=0;
	}
}

Game.prototype.startLoop = function(){
	myReq = window.requestAnimationFrame(this.gameLoop.bind(this));
}

Game.prototype.gameLoop = function(){

	myReq = window.requestAnimationFrame(this.gameLoop.bind(this));
	now = timestamp();
	dt = (now- last)/1000;
	last=now;
	this.updateFn(dt);
	this.drawFn();
}
