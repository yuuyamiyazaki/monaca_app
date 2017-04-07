// This is a JavaScript file
var app = angular.module('myApp',['onsen', 'ui.router'])
            .config(['$stateProvider',function($stateProvider){
                $stateProvider
                .state('top', {
                    templateUrl: 'top.html',
                })
                .state('game', {
                    templateUrl: 'game.html'
                })
                .state('result', {
                    templateUrl: 'result.html'
                })
                .state('score', {
                    templateUrl: 'Score.html'
                })
            }]);
app.value("Scores", []);

// 正解数
var score = 0;

// 現在回答した問い
var questionNowNum = 1;

// 問いの総数
var questionAllNum = 3;

// 単語リストの問題番号
var wordListNo = 0;

// 単語リスト
var wordList =
[
 	{  "japanese" : "歴史",  "english" : "history",  },
	{  "japanese" : "りんご",  "english" : "apple",  },
];

app.controller('MainCtrl',function($state){
    this.init_func = function() {
        $state.go("top");
    }
});

app.controller('topCtrl',function($state){
    this.gameStart = function(){
        $state.go("game");
    }
    this.hogeStart = function(){
        $state.go("score");
    }
});

app.controller('gameCtrl',function($state){
    this.init_func = function() {
        this.renderQuestion();
    }

    this.renderQuestion = function(){
        //問題数表示
        document.getElementById("question_no").innerHTML = questionNowNum + "/" + questionAllNum + "問目";

        // 乱数を発生
        var rand = Math.floor( Math.random() * wordList.length ) ;
        wordListNo = rand;

        // 次の問題がある場合は、表示する
        document.getElementById("question").innerHTML = wordList[wordListNo].japanese;               
    }

    // 入力された回答の正誤判定を行う
    this.judge = function() {
        var answer = document.getElementById("answer").value;
        if(answer == wordList[wordListNo].english) {
            document.getElementById("gazou").innerHTML = '<img src="images/106370.jpg"width="720" height="360">';
            score++;
        } else {
            document.getElementById("gazou").innerHTML = '<img src="images/106371.jpg"width="720" height="360">';
        }
        
        // 次の問題を表示
        questionNowNum++;

        if(questionNowNum <= questionAllNum) {
            this.renderQuestion();
        } else {
            //保存されたスコアを読み込む
            var scores = JSON.parse(localStorage.getItem("Scores"));
            
            if(scores == null) {
                scores = new Array();
            }

            //スコアを追加
    		scores.push({
    		    message: "test",
    		    point: score
    		});
    		
    		//スコアを上書き保存する
    		localStorage.setItem("Scores", JSON.stringify(scores));

            $state.go("result");
        }
    }
});

app.controller('resultCtrl',function($state){
    this.init_func = function() {
        if(score == questionAllNum) {
            // 全問正解の場合
            document.getElementById("resultMessage").innerHTML = "全問正解！よくできました！";
            document.getElementById("resultImage").src = "";
        } else if(score >= questionAllNum * 0.6) {
            // 6割以上正解の場合
            document.getElementById("resultMessage").innerHTML = "惜しい！あともう一歩でした！";
            document.getElementById("resultImage").src = "";
        } else {
            // 6割未満の場合
            document.getElementById("resultMessage").innerHTML = "もう少しがんばりましょう。";
            document.getElementById("resultImage").src = "";
        }
    }

    this.moveToTop = function() {
        //スコアをリセット
        score = 0;
        questionNowNum = 1;
        
        $state.go("top");
    }
});

app.controller("ShowScoresController", function($scope, $state){
    this.init_func = function() {
        //ViewにScoresデータを渡す
    	$scope.scores = JSON.parse(localStorage.getItem("Scores"));
    }

    this.moveToTop = function() {
        $state.go("top");
    }
});
