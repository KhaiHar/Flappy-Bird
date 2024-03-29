//Select the canvas on html
const cvs = document.getElementById("bird");
const ctx = cvs.getContext("2d");

//Game Vars and consts
let frames = 0;
const DEGREE = Math.PI/180;

//Load image sprite 
const sprite = new Image();
sprite.src = "assets/img/sprite.png";

//Load all require sound
const SCORE_S = new Audio();
SCORE_S.src = "assets/audio/sfx_point.wav";
document.getElementById('mute').addEventListener('click', function (evt) {
    if ( SCORE_S.muted ) {
        SCORE_S.muted = false
      evt.target.innerHTML = 'Mute Audio'
    }
    else {
        SCORE_S.muted = true
      evt.target.innerHTML = 'Unmute Audio'
}})

const FLAP = new Audio();
FLAP.src = "assets/audio/sfx_flap.wav";
document.getElementById('mute').addEventListener('click', function (evt) {
    if ( FLAP.muted ) {
        FLAP.muted = false
      evt.target.innerHTML = 'Mute Audio'
    }
    else {
        FLAP.muted = true
      evt.target.innerHTML = 'Unmute Audio'
}})

const HIT = new Audio();
HIT.src = "assets/audio/sfx_hit.wav";
document.getElementById('mute').addEventListener('click', function (evt) {
    if ( HIT.muted ) {
        HIT.muted = false
      evt.target.innerHTML = 'Mute Audio'
    }
    else {
        HIT.muted = true
      evt.target.innerHTML = 'Unmute Audio'
}})

const SWOOSHING = new Audio();
SWOOSHING.src = "assets/audio/sfx_swooshing.wav";
document.getElementById('mute').addEventListener('click', function (evt) {
    if ( SWOOSHING.muted ) {
        SWOOSHING.muted = false
      evt.target.innerHTML = 'Mute Audio'
    }
    else {
        SWOOSHING.muted = true
      evt.target.innerHTML = 'Unmute Audio'
}})

const DIE = new Audio();
DIE.src = "assets/audio/sfx_die.wav";
document.getElementById('mute').addEventListener('click', function (evt) {
    if ( DIE.muted ) {
        DIE.muted = false
      evt.target.innerHTML = 'Mute Audio'
    }
    else {
        DIE.muted = true
      evt.target.innerHTML = 'Unmute Audio'
}})

//Game state
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

//Start button
const startBtn = {
    x : 120,
    y : 263,
    w : 83,
    h : 29
}

//Control the game
cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
            case state.game:
            if(bird.y - bird.radius <= 0) return;
            bird.flap();
            FLAP.play();
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;
            
            //Checking if user click on the start button
            if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                pipes.reset();
                bird.speedReset();
                score.reset();
                window.location.reload();
                state.current = state.getReady;
            }
            break;
    }
});


//Background
const bg = {
    sX : 0,
    sY : 0,
    w : 275,
    h : 226,
    x : 0,
    y : cvs.height - 226,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
    
}

//Foreground
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    
    dx : 2,
    
    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },
    
    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

//Bird
const bird = {
    animation : [
        {sX: 276, sY : 112},
        {sX: 276, sY : 139},
        {sX: 276, sY : 164},
        {sX: 276, sY : 139}
    ],
    x : 50,
    y : 150,
    w : 34,
    h : 26,
    
    radius : 12,
    
    frame : 0,
    
    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,
    
    draw : function(){
        let bird = this.animation[this.frame];
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);
        
        ctx.restore();
    },
    
    flap : function(){
        this.speed = - this.jump;
    },
    
    
    update: function(){
        //If the game state is getready then the bird will flap slow
        this.period = state.current == state.getReady ? 10 : 5;
        //The increment will frame by 1 in each period
        this.frame += frames%this.period == 0 ? 1 : 0;
        //frame will goes from - to 4 and to 0 again
        this.frame = this.frame%this.animation.length;
        
        if(state.current == state.getReady){
            this.y = 150; //reset position of the bird after game over
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;
            
            if(this.y + this.h/2 >= cvs.height - fg.h){
                this.y = cvs.height - fg.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }
            
            //if the speed is greater than the jump that mean the bird is falling down
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }
        
    },
    speedReset : function(){
        this.speed = 0;
    }
}

//get ready message board
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,
    
    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }
    
}

//gameover message
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,
    
    draw: function(){
        if(state.current == state.over){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);   
        }
    }
    
}

//the pipes
const pipes = {
    position : [],
    
    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },
    
    w : 53,
    h : 400,
    gap : 85,
    maxYPos : -150,
    dx : 2,
    
    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            
            //top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);  
            
            //bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);  
        }
    },
    
    update: function(){
        if(state.current !== state.game) return;
        
        if(frames%100 == 0){
            this.position.push({
                x : cvs.width,
                y : this.maxYPos * ( Math.random() + 1)
            });
        }
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];
            
            let bottomPipeYPos = p.y + this.h + this.gap;
            
            //Collision detection
            //top pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            //bottom pipe
            if(bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }
            
            //move the pipe to the left
            p.x -= this.dx;
            
            //if the pipes go beyond canvas, we delete them from the array
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },
    
    reset : function(){
        this.position = [];
    }
    
}

//Score
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    
    draw : function(){
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "#000";
        
        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);
            
        }else if(state.current == state.over){
            //Score value
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            //Best score
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
        }
    },
    
    reset : function(){
        this.value = 0;
    }
}

//Show highest score to html
function getValue() {
 return parseInt(localStorage.getItem('best')); 
} 
let para = document.getElementById("lastscore");
para.innerHTML += parseInt(getValue()) || 0;
getValue();

//if user want to reset the score
function resetScore() {
    let para1 = document.getElementById("lastscore");
    window.localStorage.removeItem('best');
    para1.innerHTML = 'Best Score:' + 0;
}

//medals
const medals = {
    sX : 359,
    sY : 157,
    x : 72,
    y : 175,
    width : 45,
    height : 45,
    
    draw: function(){
     if(state.current == state.over && score.value <= 10){
        ctx.drawImage(sprite, this.sX, this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
     }
     if(state.current == state.over && score.value <= 20){
        ctx.drawImage(sprite, this.sX, this.sY - 46, this.width, this.height, this.x, this.y, this.width, this.height);
     }
     if(state.current == state.over && score.value <= 30){
        ctx.drawImage(sprite, this.sX - 48, this.sY, this.width, this.height, this.x, this.y, this.width, this.height);
     }
     if(state.current == state.over && score.value <= 40){
        ctx.drawImage(sprite, this.sX - 48, this.sY - 46, this.width, this.height, this.x, this.y, this.width, this.height);
     }
    }
}

//draw
function draw(){
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    medals.draw();
}

//update
function update(){
    bird.update();
    fg.update();
    pipes.update();
}

//loop
function loop(){
    update();
    draw();
    frames++;
    
    requestAnimationFrame(loop);
}
loop();

// On page load set the theme.
(function() {
    let onpageLoad = localStorage.getItem("theme") || "light";
    let element = document.body;
    element.classList.add(onpageLoad);
    document.getElementById("theme").textContent =
      localStorage.getItem("theme") || "light";
  })();
  
function themeToggle() {
    let element = document.body;
    element.classList.toggle("dark-mode");
  
    let theme = localStorage.getItem("theme");
    if (theme && theme === "dark-mode") {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark-mode");
    }
  
    document.getElementById("theme").textContent = localStorage.getItem("theme");
  }