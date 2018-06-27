"strict mode"

import removeConteudo from './worldController.js';

const canvas = document.querySelector('canvas');
let widgetContainerEl;
let pausegame = false;
let player;
let context;

class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	setZero(){
		this.x = 0;
		this.y = 0;
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
	constructor(imgSrc){
		this.size = new Vector(0,0);
		this.img = new Image();
		this.img.onload = () => {
			this.resize();
		}
		this.img.src = imgSrc;

		this.up = false;
		this.down = false;
		this.left = false;
		this.right = false;
		this.delete = false;
		this.deleteOnRelease = false;

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
	}

	resize(){
		const scale = Math.min(1, canvas.width/800, canvas.height/600);
		this.size.x = scale*this.img.width/this.numberOfSprite;
		this.size.y = scale*this.img.height;
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
			this.size.x,
			this.size.y);

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

		this.position.clamp(0, canvas.width - this.size.x, 0, canvas.height - this.size.y);

		this.touchingLeft = this.position.x == 0;
		this.touchingTop = this.position.y == 0;
		this.touchingRight = this.position.x == canvas.width - this.size.x;
		this.touchingBot = this.position.y == canvas.height - this.size.y;
		if(this.touchingLeft||this.touchingRight){
			this.velocity.x = 0;
		}
		if(this.touchingTop||this.touchingBot){
			this.velocity.y = 0;
		}
	}

	interact(){
		if(this.deleteOnRelease && !this.delete){
			this.deleteOnRelease = false;
			const center = new Vector(this.position.x+this.size.x/2, this.position.y+this.size.y/2)
			let interactionEl = document.elementFromPoint(center.x, center.y);
			if(interactionEl.parentElement.classList.contains("conteudo")){
				interactionEl = interactionEl.parentElement
			}
			if(interactionEl.classList.contains("conteudo") && !interactionEl.classList.contains('sentinela')){
				if(interactionEl.classList.contains('deleteconfirm')){
					clearTimeout(interactionEl.dataset.tid);
					removeConteudo(interactionEl);
				} else {
					interactionEl.classList.add('deleteconfirm');
					const tid = setTimeout(() => {
						interactionEl.classList.remove('deleteconfirm');
					}, 400);
					interactionEl.dataset.tid = tid;
				}
			}
		} else if(this.delete){
			this.deleteOnRelease = true;
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
		case 46: //delete
			player.delete = setValue;
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
	player.interact();
	player.move();
	clear();
	player.draw();
	window.requestAnimationFrame(update);
}

function resize() {
	const translateXScale = (player.position.x+player.size.x/2)/canvas.width;
	const translateYScale = (player.position.y+player.size.y/2)/canvas.height;
  canvas.width = widgetContainerEl.clientWidth;
  canvas.height = widgetContainerEl.clientHeight;
	player.position.x = translateXScale*canvas.width-player.size.x/2;
	player.position.y = translateYScale*canvas.height-player.size.y/2;
	player.resize()
};

function clear() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function doIfUnpaused(e, func){
	if(!pausegame){
		func(e)
	}
}

export function pause(){
	pausegame = true;
}
export function unpause(){
	pausegame = false;
}
export function initGame(imgSrc, _widgetContainerEl, controleUnicidade){
	widgetContainerEl = _widgetContainerEl;
	player = new Player(imgSrc);
	context = canvas.getContext("2d");
	const NO_GAME = false;
	if(NO_GAME){
		canvas.remove();
	} else {
		if (controleUnicidade){
			window.addEventListener('resize', (e) => doIfUnpaused(e, resize), false);
			resize();
			window.addEventListener('keydown', (e) => doIfUnpaused(e, handleKeyDown),true);
			window.addEventListener('keyup', (e) => doIfUnpaused(e, handleKeyUp),true);
			window.requestAnimationFrame(() => doIfUnpaused(undefined, update));
		}
	}
}
