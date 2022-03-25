function startProblem() {
    $("#fiveRoundBonus").hide();
    if (levelNum % 5 === 0) {
        $("#fiveRoundBonus").show();
    } 
    currentPowerup = powerups.next();
    var problemString = "";
    $.getJSON("/problem",function(data) {
        $("#numProblems").text(powerups.total);
        if (data["type"] === "determinant") {
            problemString = "Find the determinant of the following matrix: $$ " + data["text"] + "$$ to ";
        } else if (data["type"] === "matrix_equation") {
            problemString = "Find the sum of all \\( x_i \\) in the solution to the following matrix equation: $$ " + data["text"] + "$$ to ";
        } else if (data["type"] === "inner_product") {
            problemString = "Find the inner product of the following vectors: $$ " + data["text"] + "$$ to ";
        } else if (data["type"] === "matrix_power") {
            problemString = "Find the sum of the values in the matrix resulting from the following expression: $$ " + data["text"] + "$$ to ";
        }
        problemString += powerups.keyEnglish(currentPowerup);
        $("#problemText").text(problemString);
        MathJax.typeset();
        $("#problemSubmit").prop("disabled", false);
        $("#answer").prop("disabled", false);
        game_state = "in_problem";
    });
}

$("#problemSubmit").on("click", function(){
    $("#problemResult").toggleClass("text-success",false);
    $("#problemResult").toggleClass("text-danger",false);
    $("#problemResult").toggleClass("text-warning",false);
    if ($("#answer").val() === "") {
        $("#problemResult").html("Your answer is blank!");
        $("#problemResult").show();
        $("#problemResult").toggleClass("text-warning",true);
        return;
    }
    $("#problemSubmit").prop("disabled", true);
    $("#answer").prop("disabled", true);
    $("#problemResult").html("");
    numSolved++;
    $.getJSON("/check?answer="+$("#answer").val(),function(data) {
        if (data["result"] == "correct") {
            $("#problemResult").toggleClass("text-success",true);
            $("#problemResult").html("Correct!");
            powerups.apply(currentPowerup,true);
            numCorrect++;
        } else {
            $("#problemResult").toggleClass("text-danger",true);
            $("#problemResult").html("Sorry, that's incorrect. The correct answer is " + data["actual"] + ". Better luck next time!");
            powerups.apply(currentPowerup,false);
        }
    });
    $("#problemResult").show();
    $("#continueProblem").show();
})

$("#startGameBtn").on("click", function(){
    startGame();
});

$("#continueProblem").on("click", function(){
    $("#problemResult").hide();
    $("#continueProblem").hide();
    $("#problemSubmit").prop("disabled", false);
    $("#answer").val("");
    $("#answer").prop("disabled", false);
    if (powerups.total === 0) {
        console.log("finished with problems!");
        game_state = "solving";
    } else {
        startProblem();
    }
});
