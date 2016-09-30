/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('testDetailsCtrl', testDetailsCtrl);

    testDetailsCtrl.$inject = ['$scope', '$state', 'testService', 'answerService', 'questionService'];

    function testDetailsCtrl($scope, $state, testService, answerService, questionService) {

        $scope.data = {};

        function loadTest(id) {
            testService.getTestAndUser(id).then(loadAnswers, redirect);
        }

        function redirect() {
            $state.go('home');
        }

        function loadAnswers(data) {
            $scope.data.test = data.tests;
            $scope.data.user = data.users;
            answerService.getByTestId($scope.data.test.id).then(loadQuestions);
        }

        function loadQuestions(answers) {
            $scope.data.answers = answers;
            $scope.data.answers.forEach(loadQuestion);
            loadData();
        }

        function loadData() {
            calculateTotalTime();
        }

        function calculateTotalTime() {
            var time = 0;
            $scope.data.answers.forEach(sum);
            $scope.totalTime = time;

            function sum(answer) {
                time += answer.time;
            }
        }

        function loadQuestion(answer) {
            questionService.getById(answer.questionId).then(function (questions) {
                if (questions) {
                    answer.question = questions[0];
                }
            });
        }

        if ($state.params.testId) {
            loadTest($state.params.testId)
        } else {
            $state.go('logs');
        }

    }

})();
