$(document).ready(function() {

    let difficulty = 12;
    let diffRows = 3;
    let firstCard = {currentCard : 0};
    let secondCard = {currentCard : 0};
    let isTurnActive = false;
    let score = 0;
    let trys = 0;
    let timer = 0;
    let addSecondInterval;
    let board = []

    function random(limit) {
        return Math.floor(Math.random() * limit)
    }

    function clockFormatter(value){
        if(value.toString().length == 1){
            value = "0"+value;
        }
        return value;
    }

    function clock(time){

        let hora = Math.floor(time / 3600)
        let min = Math.floor(time / 60 % 60);
        let sec = Math.floor(time % 60);
     
        hora = clockFormatter(hora); min = clockFormatter(min); sec = clockFormatter(sec); 
     
        return (`${hora}:${min}:${sec}`) 
    }

    function clockHandler() {
        addSecondInterval = setInterval(() => {
          timer++;
          $(".timer").html(clock(timer))
        }, 1000);
    }

    function initialCards(n){
        let board = new Array(n).fill(0).map((e,i,a) => Math.floor((i/2)+1));
        board.forEach((e,i,a) => {
            let pos = random(n);
            [a[i], a[pos]] = [a[pos], e];
        });
        return board;
    }
        
    function flipCard(card){
        console.log("CLICKED: "+ JSON.stringify(card))
        assignedCard = $(card).attr('class').split(/\s+/); assignedCard = assignedCard.slice(-1)
        console.log(assignedCard)
    
        if(!isTurnActive && firstCard.currentCard == 0){
            console.log("first")
            $(card).html('<img src="static/images/'+assignedCard[0][0]+'.svg"  alt="sample'+assignedCard[0]+'" width="170px" height="170px"></img>')
            firstCard.currentCard = card; 
            $(firstCard.currentCard).off("click")
            isTurnActive = true
        }
        else if(isTurnActive && firstCard.currentCard != 0){
            trys++
            $(".tryCounter").html(trys)
            console.log("second")
            $(card).html('<img src="static/images/'+assignedCard[0][0]+'.svg"  alt="sample'+assignedCard[0]+'" width="170px" height="170px"></img>')
            secondCard.currentCard = card;
            $(secondCard.currentCard).off("click")
            
            if($(firstCard.currentCard).attr("id")[0] == $(secondCard.currentCard).attr("id")[0]){
                console.log("WIN")
                firstCard.currentCard = 0;
                secondCard.currentCard = 0;
                score++;
                isTurnActive = false;
                if(score == difficulty/2)setTimeout( () => {
                    endGame(false);
                }, 500);    
            }
            else{
                isTurnActive = false;
                setTimeout(function(){
                    coverCard(firstCard.currentCard)
                    coverCard(secondCard.currentCard)   
                    firstCard.currentCard = 0;
                    firstCard.currentCard = 0;
                }, 1000);        
            }
        }
    }
    
    function coverCard(card){
        $(card).html('<img src="static/images/backside.svg"  alt="placeholder" width="170px" height="170px">')
        $(card).click(function(e){
            console.log("click listener")
            flipCard(this)
        })
    }
    
    function endGame(isRestart){
        firstCard = {currentCard : 0};
        secondCard = {currentCard : 0};
        isTurnActive = false;
        trys = 0;
        score = 0;
        timer = 0;
        clearInterval(addSecondInterval);
        $(".tryCounter").html(trys)
        $(".timer").html("00:00:00")
        $("#mainContainer").children().remove()
        for(let i = 1; i <= difficulty; i++){
            $('<div id="container'+(i%diffRows)+'"></div>').appendTo("#mainContainer")
        }

        if(!isRestart){
            alert("FELICIDADES! HAS GANADO!!")
            restartGame(board,difficulty)
        }    
    }

    function restartGame(board,difficulty){
        clockHandler();
        board = initialCards(difficulty)
        let onBoard = []
        let flag = 0

        console.log(board)
        for(let i = 1; i <= difficulty; i++){
            if(onBoard.includes(board[i-1]))    flag = 1;
            else                                flag = 0;

            $('<div id='+board[i-1]+flag+' class="card '+board[i-1]+flag+'"><img src="static/images/backside.svg"  alt="placeholder" width="170px" height="170px"></div>').appendTo("#container".concat(i%diffRows))
            $("#"+board[i-1]+flag).click(function(e) {
                console.log("click listener")
                flipCard(this)
            })
            onBoard.push(board[i-1])
        }
    }

    ////MAIN////
    $(".restartButton").prop("disabled", true)
    $(".restartButton").hide()
    $("#diffContainer").prop("disabled", true)
    $("#diffContainer").hide()

    $(".startButton").click(function(e){
        e.preventDefault()
        restartGame(board, difficulty)
        $(".startButton").prop("disabled", true)
        $(".startButton").hide()
        $(".restartButton").prop("disabled", false)
        $(".restartButton").show()
        $("#diffContainer").prop("disabled", false)
        $("#diffContainer").show()

    })

    $(".restartButton").click(function(e){
        e.preventDefault()
        endGame(true)
        restartGame(board, difficulty)

    })

    $("#boardDiff").change(function() {
        difficulty = parseInt(($(this).val()),10);
        diffRows = difficulty/4;
        console.log("New diff:"+difficulty)
      });

});

