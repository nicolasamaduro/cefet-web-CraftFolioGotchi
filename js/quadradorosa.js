"strict mode"

class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	setZero(){
		this.x = 0;
		this.y = 0;
	}

	copyFrom(v){
		this.x = v.x;
		this.y = v.y;
	}

	add(v){
		this.x += v.x;
		this.y += v.y;
	}

	clamp(xmin,xmax,ymin,ymax){
		this.x = Math.min(xmax, Math.max(xmin, this.x));
		this.y = Math.min(ymax, Math.max(ymin, this.y));
	}

	smothClampLength(maxL, smothness){
		let maxL2 = maxL*maxL;
		let l2 = this.x*this.x + this.y*this.y;
		if(maxL2 < l2){
			let correction = (maxL2+smothness*l2)/(1+smothness)/l2;
			this.x *= correction;
			this.y *= correction;
		}
	}

	applyFriction(friction){
		if(this.x < 0){
			this.x = Math.min(0, this.x + friction);
		} else {
			this.x = Math.max(0, this.x - friction);
		}
		if(this.y < 0){
			this.y = Math.min(0, this.y + friction);
		} else {
			this.y = Math.max(0, this.y - friction);
		}
	}
}

class Player {
	constructor(){
		this.size = 24;

		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;

		this.friction = 0.04;
		this.maxSpeed = 6;
		this.acceleration = 0.3;
		this.velocity = new Vector(0,0);
		this.velocity1 = new Vector(0,0);
		this.position = new Vector(10,10);
		this.touchingTop = false;
		this.touchingBot = false;
		this.touchingLeft = false;
		this.touchingRight = false;
	}

	draw(){
		const dx = this.velocity.x-this.velocity1.x;
		const dy = this.velocity.y-this.velocity1.y;
		const shearCoef = -this.size;
		const strechCoef = this.size/16;

		let shearTop, shearBot, shearLeft, shearRight;
		if((this.touchingTop || this.touchingBot) && (this.touchingLeft || this.touchingRight)){
			shearTop = shearBot = shearLeft = shearRight = 0;
		} else {
			shearTop = this.touchingBot*shearCoef*dx;
			shearBot = this.touchingTop*shearCoef*dx;
			shearLeft = this.touchingRight*shearCoef*dy;
			shearRight = this.touchingLeft*shearCoef*dy;
		}

		let pushTop = this.down*strechCoef;
		let pushBot = -this.up*strechCoef;
		let pushLeft = this.right*strechCoef;
		let pushRight = -this.left*strechCoef;

		let topleft = new Vector(this.position.x + shearTop + pushLeft, this.position.y + shearLeft + pushTop);
		let botleft = new Vector(this.position.x + shearBot + pushLeft, this.position.y + this.size + shearLeft + pushBot);
		let botright = new Vector(this.position.x + this.size + shearBot + pushRight, this.position.y + this.size + shearRight + pushBot);
		let topright = new Vector(this.position.x + this.size + shearTop + pushRight, this.position.y + shearRight + pushTop);

		context.beginPath();
		context.moveTo(topleft.x, topleft.y);
		context.lineTo(botleft.x, botleft.y);
		context.lineTo(botright.x, botright.y);
		context.lineTo(topright.x, topright.y);
		context.fillStyle = "#ff00ce";
		context.fill();
	}

	move(){
		this.velocity1.copyFrom(this.velocity);
		this.velocity.y += this.acceleration*(this.down - this.up);
		this.velocity.x += this.acceleration*(this.right - this.left);
		if(this.touchingTop || this.touchingBot || this.touchingLeft || this.touchingRight){
			let boost = 1;
			if((this.touchingTop && this.up) || (this.touchingBot && this.down) || (this.touchingLeft && this.left) || (this.touchingRight && this.right)){
				boost = 2.2;
			}
			this.velocity.applyFriction(boost*this.friction);
		}
		this.velocity.smothClampLength(this.maxSpeed, 10);

		this.position.add(this.velocity);

		this.position.clamp(0, canvas.width - this.size, 0, canvas.height - this.size);

		this.touchingLeft = this.position.x == 0;
		this.touchingTop = this.position.y == 0;
		this.touchingRight = this.position.x == canvas.width - this.size;
		this.touchingBot = this.position.y == canvas.height - this.size;
		if(this.touchingLeft||this.touchingRight){
			this.velocity.x = 0;
		}
		if(this.touchingTop||this.touchingBot){
			this.velocity.y = 0;
		}
	}
}

const player = new Player ;

const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");
galeria.html
function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function handleKey(keyCode, setValue){
	switch (keyCode) {
		case 38:  //up
			player.up = setValue;
			break;
		case 40:  //down
			player.down = setValue;
			break;
		case 37:  //left
			player.left = setValue;
			break;
		case 39:  //right
			player.right = setValue;
			break;
	}
}

function handleKeyDown(e){
	handleKey(e.keyCode, true);
}

function handleKeyUp(e){
	handleKey(e.keyCode, false);
}

function update(){
	player.move();
	clear();
	player.draw();
	window.requestAnimationFrame(update);
}

function resize() {
	const widgetContainerEl = document.querySelector('.widget-container');
  canvas.width = widgetContainerEl.clientWidth;
  canvas.height = widgetContainerEl.clientHeight;
	console.log(canvas.height);
};

const NO_GAME = false;

if(NO_GAME){
	canvas.remove();
} else {
	window.addEventListener('resize', resize, false);

	resize();
	window.addEventListener('keydown',handleKeyDown,true);
	window.addEventListener('keyup',handleKeyUp,true);
	window.requestAnimationFrame(update);
}
