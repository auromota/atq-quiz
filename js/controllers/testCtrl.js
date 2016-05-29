/*
    Author: Auro Mota <auro@blueorc.com>
    (c) 2016 BlueOrc http://blueorc.com/
*/

(function() {
    'use strict';

    app.controller('testCtrl', testCtrl);

    testCtrl.$inject = ['$scope', '$stateParams', '$rootScope', 'answerService', 'questionService'];

    function testCtrl($scope, $stateParams, $rootScope, answerService, questionService) {

        function loadQuestion() {
            answerService.getById(parseInt($stateParams.answerId)).then(
                function(answers) {
                    if(answers.length) {
                        $scope.answer = answers[0];
                        questionService.getById($scope.answer.questionId).then(
                            function(questions) {
                                if(questions.length) {
                                    $scope.question = questions[0];
                                }
                            }
                        )
                    }
                }
            )
        }

        loadQuestion();

        $scope.hasAnswered = false;

        $scope.submit = function() {
            $scope.hasAnswered = true;
            if(parseInt($scope.answer.answer) == $scope.question.rightAnswer) {
                $scope.answer.right = true;
            } else {
                $scope.answer.right = false;
            }
            answerService.update($scope.answer).then(
                function() {
                    $rootScope.$broadcast('questionAnswered', $scope.answer);
                }
            );
        }
    }

})();