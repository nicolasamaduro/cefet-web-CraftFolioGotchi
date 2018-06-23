"strict mode"

const canvas = document.querySelector('canvas');

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
		this.size = 85;

		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;

		this.friction = 0.04;
		this.maxSpeed = 6;
		this.acceleration = 0.3;
		this.velocity = new Vector(0,0);
		this.position = new Vector(10,10);
		this.touchingTop = false;
		this.touchingBot = false;
		this.touchingLeft = false;
		this.touchingRight = false;

		this.frameIndex = 0;
		this.tickCount = 0;
		this.ticksPerFrame = 10;
		this.numberOfSprite = 8;
		this.goingRight = 0;
		this.goingLeft = 4;
		this.goingUp = 6;
		this.goingDown = 2;
		this.img = new Image();
		this.img.src = "/images/ghost.png";
	}

	draw(){
		context.drawImage(
			this.img,
			this.frameIndex*this.img.width/this.numberOfSprite,
			0,
			this.img.width/this.numberOfSprite,
			this.img.height,
			this.position.x,
			this.position.y,
			this.img.width/this.numberOfSprite,
			this.img.height);

		if(this.right){
			this.frameIndex = this.goingRight;
		}else if(this.left){
			this.frameIndex = this.goingLeft;
		}else if(this.up){
			this.frameIndex = this.goingUp;
		}else if(this.down){
			this.frameIndex = this.goingDown;
		}else{
			this.tickCount++;
			if(this.tickCount == this.ticksPerFrame-1){
				if(this.frameIndex < this.numberOfSprite-1){
					this.frameIndex++;
				}else{
					this.frameIndex = 0;
				}
				this.tickCount = 0;
			}
		}
	}

	move(){
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
	let wScale = (player.position.x+player.size/2)/canvas.width;
	let vScale = (player.position.y+player.size/2)/canvas.height;
  canvas.width = widgetContainerEl.clientWidth;
  canvas.height = widgetContainerEl.clientHeight;
	player.position.x = wScale*canvas.width-player.size/2;
	player.position.y = vScale*canvas.height-player.size/2;
};

function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}


const player = new Player;
let context;
export default function initGame(){
	context = canvas.getContext("2d");
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
}
