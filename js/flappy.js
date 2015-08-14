// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

var width = 790;
var height = 400;
var gameSpeed = -150;
var gameGravity =400;
var jumpPower = -150;
var gapSize =80;
var gapMargin = 50;
var blockHeight = 50;
var splashDisplay;
var stars = [];
var starHeight = 30;



// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

var score = 0;
var labelScore;
var player;
var pipes = [];
var britney = [];
var pipeEvents;

jQuery("#greeting-form").on("submit", function (event_details) {
    var greeting = "Ur a babe ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;

    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    // event_details.preventDefault();
});

$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    //for (var i = 0; i < scores.length; i++) {
    for (var i = 0; i < 5; i++) {
        $("#scoreBoard").append(
        "<li>" +
        scores[i].name + ": " + scores[i].score +
        "</li>");
    }
});


function preload() {
    game.load.image("playerImg", "../assets/gomezz.png");
    game.load.audio("score", "../assets/toxic3.mp3");
    game.load.image("pipe", "../assets/pipe_pink.png");
    game.load.image("backgroundImg", "../assets/purple.png");
    game.load.image("bonus","../assets/brit.jpg");
    game.load.image("stars", "../assets/star.png");

}


/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene

    game.stage.setBackgroundColor("#B9F3F5");


    game.add.image(0, 0, "backgroundImg")
    game.add.text(325, 20, "byte me",
        {font: "33px KaiTi", fill: "#FFFFFF"});
    //game.sound.play("score");

    player = game.add.sprite(200, 200, "playerImg");
    player.scale.x = 0.115;
    player.scale.y = 0.115;
    player.anchor.setTo(0.5, 0.5);
    labelScore = game.add.text(20, 20, "0",
        {font: "33px KaiTi", fill: "#FFFFFF"});

    //game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    //    .onDown.add(moveRight)
    //
    //game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    //    .onDown.add(moveLeft)
    //
    //game.input.keyboard.addKey(Phaser.Keyboard.UP)
    //    .onDown.add(moveUp)
    //
    //game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
    //    .onDown.add(moveDown)
    //generatePipe();
    //game.physics.startSystem(Phaser.Physics.ARCADE);

    game.physics.arcade.enable(player);
    //player.body.velocity.x = 10;
    //player.body.velocity.y = -10;
    //player.body.gravity.y = gameGravity;

    //game.input.keyboard
    //    .addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);
    //
    //var pipeInterval = 1.5;
    //pipeEvents = game.time.events
    //    .loop(pipeInterval * Phaser.Timer.SECOND,
    //    generatePipe);

    game.pause = true;


    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(start);

    splashDisplay = game.add.text(100,300,"use earphones & press space 2 start x",
    {font: "33px KaiTi", fill: "#FFFFFF"});


}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 5);
    if(diceRoll==1) {
        generateBritney();
    } else {
        generatePipe();
    }
}

function clickHandler(event) {

}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
    labelScore.destroy();
    labelScore = game.add.text(20, 20, score.toString(),
        {font: "33px KaiTi", fill: "#FFFFFF"});
}

function moveRight() {
    player.x = player.x + 40
}

function moveLeft() {
    player.x = player.x - 40
}

function moveUp() {
    player.y = player.y - 20
}

function moveDown() {
    player.y = player.y + 20
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    for (var index = 0; index < pipes.length; index++) {
        game.physics.arcade
            .overlap(player,
            pipes,
            gameOver);
    }

    for (var index = stars.length - 1; index >= 0; index--) {
        //flag = 0;
        game.physics.arcade
            .overlap(player,
            stars[index],
            function(){
                stars[index].destroy();
                stars.splice(index,1);
                //if(flag == 0) {
                    changeScore();
                    //flag = 1;
                //}
            });
    }

    for (var index = britney.length - 1; index >= 0; index--) {
        //flag = 0;
        game.physics.arcade
            .overlap(player,
            britney[index],
            function(){
                britney[index].destroy();
                britney.splice(index,1);
                //if(flag == 0) {
                    changeScore();
                    changeScore();
                    //flag = 1;
                //}
            });
    }


    if (player.y > 400) {
        gameOver();
    }

    player.rotation = Math.atan(player.body.velocity.y / 200)

}
//
//function chooseSong() {
//    var song = game.rnd.integerInRange(0, 1);
//    if (song = 0) {
//        game.sound.play("toxic3.mp3")
//    }
//    else {
//        game.sound.play("ignition.mp3")
//    }
//}

function gameOver() {
    //location.reload();
    $("#score").val(score.toString());
    player.kill();
    game.time.events.remove(pipeEvents);
    $("#gameOver").show();
   stars = [];
}
function holdHandler() {
    moveUp();
}

function generatePipe_old() {
    // calculate a random position for the gap
    var gap = game.rnd.integerInRange(1, 2);
    // generate the pipes, except where the gap should be
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1) {
            addPipeBlock(gapSize, count * blockHeight);
        }
    }
    addStars();
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for(var y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }

    addStars(width, gapStart + (gapSize / 2) - (starHeight / 2));

    console.log(width);
    console.log(gapStart + (gapSize / 2) - (starHeight / 2));

    for(var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
}




function playerJump() {
    player.body.velocity.y = jumpPower;
}
$.get("/score", function(scores){
    console.log("Data: ",scores);

});

function start(){
    game.sound.play("score");
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight)

    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft)

    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp)

    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown)
    generatePipe();

    player.body.velocity.x = 0;
    player.body.velocity.y = -10;
    player.body.gravity.y = gameGravity;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

    var pipeInterval = 1.75;
    pipeEvents = game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);

game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.remove(start);

    splashDisplay.destroy();


}

function addStars(x, y){
    var star = game.add.sprite(x, y, "stars");
    star.alpha = 0;
    stars.push(star);
    game.physics.arcade.enable(star);
    star.body.velocity.x = gameSpeed;
   // star.body.velocity.y = 0;
}

function addPipeBlock(x, y) {
    //create a new pipe block
    var pipeBlock = game.add.sprite(x, y, "pipe")
    //insert it in the 'pipes' array
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = gameSpeed;
}

function generateBritney(){
    var bonus = game.add.sprite(width, height, "bonus");
    britney.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 225;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}