function startProblem() {
    $.getJSON("/problem",function(data) {
        $("#numProblems").text(numberNewBalls);
        if (data["type"] === "determinant") {
            $("#problemText").html("Find the determinant of the following matrix: $$ " + data["text"] + "$$ to get 1 extra ball.");
            MathJax.typeset();
        } else if (data["type"] === "matrix_equation") {
            $("#problemText").html("Find the sum of all \\( x_i \\) in the solution to the following matrix equation: $$ " + data["text"] + "$$ to get 1 extra ball.");
            MathJax.typeset();
        }
        $("#problemSubmit").prop("disabled", false);
        $("#answer").prop("disabled", false);
        game_state = "in_problem";
    });
}

$("#problemSubmit").on("click", function(){
    $("#problemSubmit").prop("disabled", true);
    $("#answer").prop("disabled", true);
    numberNewBalls--;
    numSolved++;
    $.getJSON("/check?answer="+$("#answer").val(),function(data) {
        if (data["result"] == "correct") {
            balls.push(new Ball());
            $("#problemResult").toggleClass("text-success",true);
            $("#problemResult").toggleClass("text-danger",false);
            $("#problemResult").html("Correct!");
            numCorrect++;
        } else {
            console.log(data);
            $("#problemResult").toggleClass("text-success",false);
            $("#problemResult").toggleClass("text-danger",true);
            $("#problemResult").html("Sorry, that's incorrect. The correct answer is " + data["actual"] + ". Better luck next time!");
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
    if (numberNewBalls === 0) {
        console.log("finished with problems!");
        game_state = "solving";
    } else {
        startProblem();
    }
});
