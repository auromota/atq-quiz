/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$stateParams', '$rootScope', '$state', '$timeout', '$interval', 'SweetAlert', 'answerService', 'questionService', 'securityService', 'utilService'];

    function testCtrl($scope, $stateParams, $rootScope, $state, $timeout, $interval, SweetAlert, answerService, questionService, securityService, utilService) {

        var user = securityService.getUser();
        var time = 0;
        var hasAnswered = false;
        $rootScope.$broadcast('testInitialized');

        $scope.go = function (state) {
            $rootScope.$broadcast('testLeft');
            $state.go(state);
        }

        $scope.firstAnswerRight = '';
        $scope.secondAnswerRight = '';
        $scope.thirdAnswerRight = '';
        $scope.fourthAnswerRight = '';
        $scope.confirmBtn = 'btn-answer';

        if (user.id) {
            loadAnswers();
        } else {
            $state.go('home');
        }

        $scope.enableButton = false;

        function loadAnswers() {
            if ($stateParams.answerId) {
                var id = parseInt($stateParams.answerId);
                answerService.getById(id).then(loadQuestion);
            } else {
                $state.go('home');
            }
        }

        function loadQuestion(answers) {
            if (answers.length) {
                $scope.answer = answers[0];
                questionService.getById($scope.answer.questionId).then(updateProgressBar);
            }
        }

        function updateProgressBar(questions) {
            if (questions.length) {
                $scope.question = questions[0];
                var percentage = utilService.getPercetange($state.params.answered, $state.params.total);
                $scope.$emit('percentageReady', percentage);
                startTimeCounter();
            }
        }

        function startTimeCounter() {
            $interval(function () {
                time += 0.005;
            }, 5);
        }

        function getTime() {
            $scope.answer.time = angular.copy(time);
        }

        function checkAnswer() {
            if (!$scope.answer.answer) return null;
            var answer = parseInt($scope.answer.answer);
            if (answer === $scope.question.rightAnswer) {
                return true;
            }
            return false;
        }

        $scope.submit = function () {
            if (hasAnswered) {
                $rootScope.$broadcast('questionAnswered', $scope.answer);
            } else {
                var answer = checkAnswer();
                if (answer !== null) {
                    hasAnswered = true;
                    $scope.enableButton = true;
                    getTime();
                    $scope.answer.right = checkAnswer();
                    answerService.update($scope.answer).then(showResult);
                }
            }
        }

        function showResult() {
            var params = {};
            var audio;
            if ($scope.answer.right) {
                audio = document.getElementById('audio-correct');
                params.title = '';
                params.text = '';
                params.imageUrl= './img/correct-answer.png',
                params.imageSize= '226x264',
                params.type = 'success';
                params.confirmButtonColor = '#44649B';
                SweetAlert.swal(params, doBroadcast);
            } else {
                audio = document.getElementById('audio-wrong');
                params.title = '';
                params.text = '';
                params.imageUrl= './img/wrong-answer-2.png',
                params.imageSize= '256x288',
                params.type = 'error';
                params.confirmButtonColor = '#44649B';
                SweetAlert.swal(params, showRightAnswer)
            }
            audio.play();
        }

        function showRightAnswer() {
            switch ($scope.question.rightAnswer) {
                case 1: $scope.firstAnswerRight = true;
                    break;
                case 2: $scope.secondAnswerRight = true;
                    break;
                case 3: $scope.thirdAnswerRight = true;
                    break;
                case 4: $scope.fourthAnswerRight = true;
                    break;
                default:
                    break;
            }
            $scope.confirmBtn = 'btn-continue';
            $scope.enableButton = false;
        }

        function doBroadcast() {
            $rootScope.$broadcast('questionAnswered', $scope.answer);
        }
    }

})();