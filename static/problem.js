/*
Copyright 2022 Steven Su

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
function startProblem() {
    $("#fiveRoundBonus").hide();
    if (levelNum % 5 === 0) {
        $("#fiveRoundBonus").show();
    } 
    currentPowerup = powerups.next();
    var problemString = "";
    $.getJSON("/problem?easy="+$("#2b2Matrices").prop("checked"),function(data) {
        $("#numProblems").text(powerups.total);
        if (data["type"] === "determinant") {
            problemString = "Find the determinant of the following matrix: $$ " + data["text"] + "$$ to ";
        } else if (data["type"] === "matrix_equation") {
            problemString = "Find the sum of all \\( x_i \\) in the solution to the following representation of a system of equations: $$ " + data["text"] + "$$ to ";
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
        var newAttempt = false;
        if (data["result"] == "correct") {
            $("#problemResult").toggleClass("text-success",true);
            $("#problemResult").html("Correct!");
            powerups.apply(currentPowerup,true);
            numCorrect++;
        } else {
            problemChances--;
            if ($("#moreProblemChances").prop("checked") && problemChances > 0) {
                $("#problemResult").toggleClass("text-danger",true);
                $("#problemResult").html("Sorry, that's incorrect. Try again! You have " + problemChances + " more attempts.");
                newAttempt = true;
            } else {
                $("#problemResult").toggleClass("text-danger",true);
                $("#problemResult").html("Sorry, that's incorrect. The correct answer is " + data["actual"] + ". Better luck next time!");
                powerups.apply(currentPowerup,false);
            }
        }
        $("#problemResult").show();
        if (!newAttempt) {
            $("#continueProblem").show();
        } else {
            $("#continueProblem").hide();
            $("#problemSubmit").prop("disabled", false);
            $("#answer").prop("disabled", false);
        }
    });
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
        problemChances = 3;
        startProblem();
    }
});
