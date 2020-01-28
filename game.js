//--------------------DIV SELECTORS-------------------
//array of div id's for the div blocks that hold the play area pieces
const playSlots = document.querySelectorAll(".playAreaBackground");

//array of div id's for the div blocks that hold the play area pieces
const clickSlots = document.querySelectorAll(".playAreaInteractCols");

    //select div that displays the question
// const ques = document.querySelector("#question");
    //select div that displays the pieceIndicator
const bluePieces = document.querySelectorAll(".bluePieces");
const redPieces = document.querySelectorAll(".redPieces");
    //select div that displays the pieceIndicator
const bluePiecesBackground = document.querySelector(".bluePiecesBackground");
const redPiecesBackground = document.querySelector(".redPiecesBackground");
    //select div that displays the title
const title = document.querySelector("#title");
    //select div that display status messages
const message = document.querySelector("#message");
    //select start button
const start = document.querySelector("#startBtn");
    //select rules button
const rule = document.querySelector("#rulesBtn");
    //select the rules popup
const ruleScreen = document.querySelector("#rules");
const ret = document.querySelector("#returnBtn");
    //select name entry
const name = document.querySelector("#name");
    //select play button
// const playgame = document.querySelector("#play");
    //name entry field
    //game component
const game = document.querySelector("#game");
    //menu component
const menu = document.querySelector("#menu");
    //Button for playing against an AI
const vComp = document.querySelector('#lvl1');
    //Button for playing a 2 player game
const twoPlayer = document.querySelector('#lvl2');
//End Game Menu Buttons
const rematch = document.querySelector('#newGameButton');
const mainMenu = document.querySelector('#mainMenuButton');
    //lvl2 button
const endGameButton = document.querySelector('#returnMenu');
    //turn indicator
const turnIndicator = document.querySelector('#turnIndicatorFont');
    //subheading on menu
const sub = document.querySelector("#subtitles");
    //end game screen
const endGameMenu = document.querySelector('#endGameMenu');
    //end game screen return button
const endRet = document.querySelector('#returnBtnEnd');
    //select music element
const song = document.getElementById("music");
    //select music button
const musicbtn = document.querySelector("#playpause");

//----------------------------------------------------

//---------------------GLOBAL VARS--------------------

//which game is being played
//1 - VS. CPU, 2 - 2 PLAYER
var game_mode = 0;
//1 - PLAY, 2 = PAUSE
var musicstate = 1;
const m_range_y = window.innerHeight/30;
const m_range_x = window.innerWidth/30;
const viewport_y = window.innerHeight;
const viewport_x = window.innerWidth;
//current piece
var current_blue = 0;
var current_red = 0;
//game control variables
//whos turn is it -> 1 - Player 1, 2 - Player 2 or Computer
current_turn = 1;
moveLock = 0;
//board state( 0 = empty, 1 = blue, 2 = red )
//filledPiece holds reference to element in that slot, 0 if empty
let boardState = [];
let filledPiece = [];
for (var i = 0; i < 7; i++){
    boardState[i] = [];
    filledPiece[i] = [];
    for (var j = 0; j < 6; j++){
        boardState[i][j] = 0;
        filledPiece[i][j] = 0;
    }
}

//----------------------------------------------------

//--------------------GAME FUNCTIONS------------------
{
    function gameReset(mode){
        hideEndScreen();
        setTurnIndicatorBlue();
        //1 - VS. CPU, 2 - 2 PLAYER
        game_mode = mode;
        //1 - PLAY, 2 = PAUSE
        musicstate = 1;
        //current piece
        for (var i = 0; i < 21; i++){
            bluePieces[i].style.transition = "linear 0ms";
            redPieces[i].style.transition = "linear 0ms";
        }

        setTimeout(function(){
            for (var i = 0 ; i<21; i++)
            {
                bluePieces[i].style.top = "-10vmin";
                bluePieces[i].style.left = "50vw";
                redPieces[i].style.top = "-10vmin";
                redPieces[i].style.left = "50vw";
            }
        }, 20);
        setTimeout(function(){
            for (var i = 0 ; i<21; i++)
            {
                bluePieces[i].style.transition = "linear 300ms";
                redPieces[i].style.transition = "linear 300ms";
            }
        }, 50);

        current_blue = 0;
        current_red = 0;
        //game control variables
        //whos turn is it -> 1 - Player 1, 2 - Player 2 or Computer
        current_turn = 1;
        moveLock = 0;
        //board state( 0 = empty, 1 = blue, 2 = red )
        //filledPiece holds reference to element in that slot, 0 if empty
        for (var i = 0; i < 7; i++){
            for (var j = 0; j < 6; j++){
                boardState[i][j] = 0;
                filledPiece[i][j] = 0;
            }
        }
    }

    function showEndScreen(){
        endGameMenu.style.display = "block";
        setTimeout(() =>
        {
            endGameMenu.style.transition ="ease-out 2000ms";
            endGameMenu.style.top = "calc( 50vh - 10vw )";

        },50);
    }

    function hideEndScreen(){
        endGameMenu.style.display = "none";
        setTimeout(() =>
        {
            endGameMenu.style.transition ="ease-out 0ms";
            endGameMenu.style.top = "-100vh";

        },50);
    }

    function playAreaBackground(e){
        var Col = -1;
        for (var j = 0; j < 7; j++){
            if(clickSlots[j] == e.currentTarget)
            {
                col = j;
            }
        }

        row = playPieceGetRow(col,boardState);

        if( row >= 0 ){
            if (current_turn == 1 && moveLock == 0){
                boardState[col][row] = 1;
                current_turn = 2;
                piecePlayed = bluePieces[current_blue];
                current_blue++;
                piecePlayed.style.top = "calc( "+((playSlots[row*7+col].getBoundingClientRect().top-(vh(50) - (vmin(8) * 3) - vmin(5)))/vmin(50))*50+"vmin + 50vh - (8vmin * 3) - 5vmin)";
                piecePlayed.style.left = "calc( "+((playSlots[row*7+col].getBoundingClientRect().left-((vw(100)- vmin(70))/2))/vmin(60))*60+"vmin + ( 100vw - 70vmin ) / 2 )";
                moveLock=1;
                if(game_mode == 2 )
                {
                    setTimeout(function(){
                        if (checkVictoryCondition(col,row,boardState[col][row],boardState))
                        {
                            moveLock=1;
                            showEndScreen();
                            setWinIndicatorBlue();
                        } else {
                            moveLock=0;
                            setTurnIndicatorRed();
                        }
                    },500);
                } else {
                    moveLock=0;
                    if (checkVictoryCondition(col,row,boardState[col][row],boardState))
                    {
                        moveLock=1;
                        showEndScreen();
                        setWinIndicatorBlue();
                    }
                }
            }
        }

        //Computer Turn
        if(current_turn==2 && moveLock==0)
        {
            if(game_mode==1)
            {
                moveLock=1;
                setTurnIndicatorRed();
                var compCol = computerMove();
                var compRow = playPieceGetRow(compCol,boardState);
                boardState[compCol][compRow] = 2;
                piecePlayed = redPieces[current_red];
                current_red++;
                current_turn = 1;
                setTimeout(function(){
                    piecePlayed.style.top = "calc(50vh - (8vmin * 4) - 8vmin)";
                    piecePlayed.style.left = "calc("+playSlots[compRow*7+compCol].getBoundingClientRect().left+"px + 1vmin)";
                }, 1000);
                setTimeout(function(){
                    piecePlayed.style.top =  "calc( "+((playSlots[compRow*7+compCol].getBoundingClientRect().top-(vh(50) - (vmin(8) * 3) - vmin(5)))/vmin(50))*50+"vmin + 50vh - (8vmin * 3) - 5vmin)";
                    piecePlayed.style.left = "calc( "+((playSlots[compRow*7+compCol].getBoundingClientRect().left-((vw(100)- vmin(70))/2))/vmin(60))*60+"vmin + ( 100vw - 70vmin ) / 2 )";
                }, 2000);
                setTimeout(function(){
                    moveLock=0;
                    if (checkVictoryCondition(compCol,compRow,boardState[compCol][compRow],boardState))
                    {
                        moveLock=1;
                        showEndScreen();
                        setWinIndicatorRed();
                    } else {
                        setTurnIndicatorBlue();
                    }
                }, 2800);
            } else {
                boardState[col][row] = 2;
                piecePlayed = redPieces[current_red];
                moveLock = 1;
                current_red++;
                piecePlayed.style.top = "calc( "+((playSlots[row*7+col].getBoundingClientRect().top-(vh(50) - (vmin(8) * 3) - vmin(5)))/vmin(50))*50+"vmin + 50vh - (8vmin * 3) - 5vmin)";
                piecePlayed.style.left = "calc( "+((playSlots[row*7+col].getBoundingClientRect().left-((vw(100)- vmin(70))/2))/vmin(60))*60+"vmin + ( 100vw - 70vmin ) / 2 )";
                setTimeout(function(){
                    if (checkVictoryCondition(col,row,boardState[col][row],boardState))
                    {
                        moveLock=1;
                        showEndScreen();
                        setWinIndicatorRed();
                    } else {
                        current_turn = 1;
                        moveLock = 0;
                        setTurnIndicatorBlue();
                    }
                }, 200);
            }
        }
    }

    function vh(v) {
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        return (v * h) / 100;
    }

    function vw(v) {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        return (v * w) / 100;
    }

    function vmin(v) {
        return Math.min(vh(v), vw(v));
    }

    //This function returns -1 if column is full, otherwise returns row number piece is played to
    function playPieceGetRow(col, boardArray){
        for (var i = 5; i >= 0; i--){
            if( boardArray[col][i] == 0 ){
                return i;
            }
        }
        return -1;
    }

    function playAreaBackgroundHover(e){
        if(current_turn==1 && moveLock == 0)
        {
            bluePieces[current_blue].style.top = "calc(50vh - (8vmin * 4) - 8vmin)";
            bluePieces[current_blue].style.left = "calc("+e.currentTarget.getBoundingClientRect().left+"px + 1vmin)";
        }
        if(current_turn==2 && moveLock == 0 && game_mode == 2)
        {
                redPieces[current_red].style.top = "calc(50vh - (8vmin * 4) - 8vmin)";
                redPieces[current_red].style.left = "calc("+e.currentTarget.getBoundingClientRect().left+"px + 1vmin)";
        }
    }

    function checkVictoryCondition(col, row, playerType, boardArray){
        //This function is called every time a piece is placed to see if victory condition is reached
        victory = false;

        //Horizontal Check
        for(var i = 0; i<4; i++){
            var startCol = col-3+i;
            if (startCol < 0) continue;
            if ((startCol + 3) > 6) continue;

            if(boardArray[startCol][row] == playerType
                && boardArray[startCol+1][row] == playerType
                && boardArray[startCol+2][row] == playerType
                && boardArray[startCol+3][row] == playerType)
            {
                victory = true;
            }
        }

        //Bottomleft to Topright diagonal check
        for(var i = 0; i<4; i++){
            var startCol = col-3+i;
            var startRow = row+3-i;

            if (startCol < 0) continue;
            if ((startCol + 3) > 6) continue;
            if (startRow > 5) continue;
            if ((startRow - 3) < 0) continue;

            if(boardArray[startCol][startRow] == playerType
                && boardArray[startCol+1][startRow-1] == playerType
                && boardArray[startCol+2][startRow-2] == playerType
                && boardArray[startCol+3][startRow-3] == playerType)
            {
                victory = true;
            }
        }

        //Topleft to Bottomright diagonal check
        for(var i = 0; i<4; i++){
            var startCol = col-3+i;
            var startRow = row-3+i;

            if (startCol < 0) continue;
            if ((startCol + 3) > 6) continue;
            if (startRow < 0) continue;
            if ((startRow + 3) > 5) continue;

            if(boardArray[startCol][startRow] == playerType
                && boardArray[startCol+1][startRow+1] == playerType
                && boardArray[startCol+2][startRow+2] == playerType
                && boardArray[startCol+3][startRow+3] == playerType)
            {
                victory = true;
            }
        }

        //vertical check
        for(var i = 0; i<4; i++){
            var startCol = col;
            var startRow = row-3+i;
            if (startRow < 0) continue;
            if ((startRow + 3) > 5) continue;

            if(boardArray[startCol][startRow] == playerType
                && boardArray[startCol][startRow+1] == playerType
                && boardArray[startCol][startRow+2] == playerType
                && boardArray[startCol][startRow+3] == playerType)
            {
                victory = true;
            }
        }

        return victory;
    }
}

    function setTurnIndicatorBlue(){
        turnIndicator.innerHTML = "It's Blue's Turn!";
        turnIndicator.style.color = "#2ab7ca";
    }

    function setTurnIndicatorRed(){
        turnIndicator.innerHTML = "It's Red's Turn!";
        turnIndicator.style.color = "#fe4a49";
    }

    function setWinIndicatorBlue(){
        turnIndicator.innerHTML = "Blue Wins!";
        turnIndicator.style.color = "#2ab7ca";
    }

    function setWinIndicatorRed(){
        turnIndicator.innerHTML = "Red Wins!";
        turnIndicator.style.color = "#fe4a49";
    }

            //--------------------AI FUNCTIONS--------------------
    {
    function computerMove(){
        var moveScore = [];
        for(var i=0; i<7; i++){
            moveScore[i]=0;
        }
    //First Depth Check
    //Check for winning moves
    var winMoves = findWinners(deepCopy(boardState),2);
    if(winMoves >= 0){
        moveScore[winMoves] += 100000;
    }
    //Check for other player winning moves (to block)
    var loseMoves = findWinners(deepCopy(boardState),1)
    if(loseMoves >= 0){
        moveScore[loseMoves] += 10000;
    }


    for (var i = 0; i < 7; i++){
        var newBoardState=deepCopy(boardState);
        var row = playPieceGetRow(i,newBoardState);
        newBoardState[i][row] = 2;

        //check for 2s
        var endRow = row+1;
        var startRow = row-1;
        var endCol = i+1;
        var startCol = i-1;
        //Horz and Vert
        if (endRow <= 5)
            if (newBoardState[i][endRow] == 2) moveScore[i]+=1;
        if (startRow >= 0)
            if (newBoardState[i][startRow] == 2) moveScore[i]+=1;
        if (endCol <= 6)
            if (newBoardState[endCol][row] == 2) moveScore[i]+=1;
        if (startCol >= 0)
            if (newBoardState[startCol][row] == 2) moveScore[i]+=1;
        //Diagonals
        if (endRow <= 5 && endCol <=6)
            if (newBoardState[endCol][endRow] == 2) moveScore[i]+=1;
        if (endRow <= 5 && startCol >= 0)
            if (newBoardState[startCol][endRow] == 2) moveScore[i]+=1;
        if (startRow >= 0 && startCol >= 0)
            if (newBoardState[startCol][startRow] == 2) moveScore[i]+=1;
        if (startRow >= 0 && endCol <= 6)
            if (newBoardState[endCol][startRow] == 2) moveScore[i]+=1;


        //Check for "3 in a rows" with win possibilities for other player
        var newBoardState1b=deepCopy(newBoardState);
        //var row1b = playPieceGetRow(i,newBoardState1b);
        newBoardState1b[i][row] = 1;

        for (var n = 0; n < 7; n++)
        {
            var newBoardState1b2=deepCopy(newBoardState1b);
            var row1b2 = playPieceGetRow(n,newBoardState1b2);
            newBoardState1b2[n][row1b2] = 1;

            if (checkVictoryCondition(n,row1b2,1,newBoardState1b2)==true){
                moveScore[i]+=10;
            }
        }

        //Second Depth Check
        for (var j = 0; j < 7; j++){
            var newBoardState2=deepCopy(newBoardState);
            var row2 = playPieceGetRow(j,newBoardState2);
            newBoardState2[j][row2] = 1;



            //Check for "3 in a rows" with win possibilities
            for (var n = 0; n < 7; n++)
            {
                var newBoardState2b=deepCopy(newBoardState);
                var row2b = playPieceGetRow(n,newBoardState2b);
                newBoardState2b[n][row2b] = 2;

                if (checkVictoryCondition(n,row2b,2,newBoardState2b)==true){
                    moveScore[i]+=10;
                }
            }
            if (checkVictoryCondition(j,row2,1,newBoardState2)==true){
                moveScore[i] -= 10;
            } else {

                //Third Depth Check
                for (var k = 0; k < 7; k++){
                    var newBoardState3=deepCopy(newBoardState2);
                    var row3 = playPieceGetRow(k,newBoardState3);
                    newBoardState3[k][row3] = 2;
                    if (checkVictoryCondition(k,row3,2,newBoardState3)==true){
                        moveScore[i] += 10;
                    }
                }
            }
        }
    }

    //Decide which column to choose for Computer players move
    var highestScore =-9999;
    var dupScoreCount = 0;

    for(var i = 0; i<7; i++)
    {

        if(moveScore[i] == highestScore){
            dupScoreCount++;
            highScoreIds[dupScoreCount]=i;
        }

        if (moveScore[i] > highestScore){
            var highScoreIds = []
            highestScore=moveScore[i];
            dupScoreCount=0;
            highScoreIds[0]=i;
        }
    }

    if(dupScoreCount == 0)
    {
        return highScoreIds[0];
    } else {
        return Math.floor(Math.random() * (dupScoreCount+1));
    }

}

//AI Helper Functions
function findWinners(boardArray,playerType)
{
    for (var i = 0; i < 7; i++){
        var newBoardState=deepCopy(boardArray);
        var row = playPieceGetRow(i,newBoardState);
        newBoardState[i][row] = playerType;
        if(checkVictoryCondition(i,row,playerType,newBoardState)==true) return i;
    }
    return -1;
}

function deepCopy(arr){
    var len = arr.length,
    copy = new Array(len); // boost in Safari
    for (var i=0; i<len; ++i)
        copy[i] = arr[i].slice(0);

    return copy;
}


}
//----------------------------------------------------

//--------------------MENU FUNCTIONS------------------
{
    function showRules(){
        menu.style.display = "none";
        ruleScreen.style.display = "block";
    }

    function Set1(){
        gameReset(1);
        game.style.display = "block";
        menu.style.display = "none";
        // Play(true);
    }

    function Set2(){
        gameReset(2);
        game.style.display = "block";
        menu.style.display = "none";
        // Play(true);
    }

    function endGameButtonClick(){
        gameReset(game_mode);
        game.style.display = "none";
        ruleScreen.style.display = "none";
        // endgame.style.display = "none";
        menu.style.display = "block";
        // Play(true);
    }
}
//----------------------------------------------------

//------------------------MUSIC-----------------------
{
    function music(){
        song.play();
    }
    function play_pause(){
        if(musicstate == 1){
            musicstate = 2;
            song.pause();
        }
        else if(musicstate == 2){
            musicstate = 1;
            song.play();
        }
    }
}
//----------------------------------------------------

//-------------------EVENT LISTENERS------------------
window.addEventListener("load", music);
musicbtn.addEventListener("click", play_pause);
for (var i = 0; i < clickSlots.length; i++){
    clickSlots[i].addEventListener("mouseover", playAreaBackgroundHover, false);
    clickSlots[i].addEventListener("click", playAreaBackground);
}

vComp.addEventListener("click", Set1);
twoPlayer.addEventListener("click", Set2);
rematch.addEventListener("click", () => {gameReset(game_mode);});
mainMenu.addEventListener("click", endGameButtonClick);
endGameButton.addEventListener("click", endGameButtonClick);

//----------------------------------------------------

//--------------------CURSOR--------------------------

var $on = document.addEventListener.bind(document);
var xmouse, ymouse;
$on('mousemove', function (e) {
    xmouse = e.clientX || e.pageX;
    ymouse = e.clientY || e.pageY;
});
var followMouse = function followMouse() {
    music();
};

//-----------------ANIMATION MANAGER------------------

//Bouncing buttons
$(".animButton").mouseleave(function() {
    $(".animButton").bind('animationiteration', function() {
      $(this).removeClass("animated");
      $(".animButton").unbind('animationiteration');
    });
  });

  $(".animButton").mouseover(function() {
    $(this).addClass("animated");
  });

//Main menu particles
let bluePieceGen = [];
let redPieceGen = [];
for (var i = 0; i < 15; i++){
    setTimeout(() =>
    {
        bluePieceGen[i] = bluePiecesBackground.cloneNode(true);
        menu.appendChild(bluePieceGen[i]);
        initializePiece(bluePieceGen[i]);
        redPieceGen[i] = redPiecesBackground.cloneNode(true);
        menu.appendChild(redPieceGen[i]);
        initializePiece(redPieceGen[i]);
    }, 200*i);
}

function initializePiece(piece){
    piece.style.transition = "linear 0ms";
    piece.style.top = "-10vmin";
    piece.style.left = Math.random() * 94 + "vw";
    let respawnInterval = Math.floor(Math.random()*4000)+1000;
    setTimeout(() =>
    {
        piece.style.transition = "linear "+respawnInterval+"ms";
        piece.style.top = "110vh";
    }, 100)

    setTimeout(() => initializePiece(piece),respawnInterval);

}
