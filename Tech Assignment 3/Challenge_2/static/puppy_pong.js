document.addEventListener("DOMContentLoaded", ()=>{
    let theBody=document.querySelector('body');
    let theImg=document.querySelector('img');
    let theScore=document.querySelector('#score');
    let theTime=document.querySelector('#time');
    let thePaddle=document.querySelector('#paddle');
    let theSpeed=document.querySelector('#speed');
    let resetBtn=document.querySelector('button');
    var x_pos=0;
    var y_pos=0;
    const VELOCITY=2;
    var velocity_val = VELOCITY;
    var direction_x = 1;
    var direction_y = 1;
    var score = 0;
    var time = 0;
    var paddle_pos = 0;
    var failed = false;

    function isWithinPaddleBounds(){
        let img_left = x_pos;
        let img_right = x_pos+theImg.offsetWidth;
        let paddle_left = paddle_pos-thePaddle.offsetWidth/2;
        let paddle_right = paddle_pos + thePaddle.offsetWidth/2;
        if(img_left>paddle_right || img_right<paddle_left){
            return false;
        }else{
            return true;
        }
    }

    function incrementScore(){
        score++;
        theScore.innerText = `${score}`;
    }

    function updateX() {
    x_pos+=velocity_val * direction_x;
    theImg.style.left=`${x_pos}px`;
    
    if(x_pos<0){//LEFT WALL
        direction_x = 1;
    }else if(x_pos>theBody.offsetWidth-theImg.offsetWidth) {//RIGHT WALL
        direction_x = -1;
    }
    }

    function updateY() {
    y_pos+=velocity_val * direction_y;
    theImg.style.top=`${y_pos}px`;
    if(y_pos<0){// TOP WALL
        direction_y = 1;
    }else if(y_pos>theBody.offsetHeight-theImg.offsetHeight-thePaddle.offsetHeight) { //BOTTOM WALL
        if(isWithinPaddleBounds()){
            direction_y = -1;
            incrementScore();
        }else{ //fail condition
            failed = true;
        }
        
    }
    }

    setInterval(function() {
        if(!failed){
            updateX();
            updateY();
            velocity_val = VELOCITY*Math.exp(time/32);
            theSpeed.innerText = `${Math.round(velocity_val*10)/10}`;
        }
    },15);
    setInterval(function() {
        if(!failed){
        time++;
        theTime.innerText = `${time}`;
        }
    },1000);

    document.addEventListener("mousemove", (e)=>{
        if(!failed){
        if(e.clientX<thePaddle.offsetWidth/2){
            paddle_pos=thePaddle.offsetWidth/2;
        }else
        if(e.clientX > theBody.offsetWidth-thePaddle.offsetWidth/2){
            paddle_pos = theBody.offsetWidth-thePaddle.offsetWidth/2;
        }else{
            paddle_pos = e.clientX;
        }
        thePaddle.style.left = `${paddle_pos-thePaddle.offsetWidth/2}px`;
    }
    });
    resetBtn.addEventListener("click", ()=>{
        x_pos = 0;
        y_pos = 0;
        failed = false;
        velocity_val = VELOCITY;
        score = 0;
        theScore.innerText = `0`;
        time = 0;
        theTime.innerText = `0`;
    });
});
