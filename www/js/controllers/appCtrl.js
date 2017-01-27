/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('appCtrl', appCtrl);

    appCtrl.$inject = ['$scope', '$state', 'SweetAlert', 'testService', 'answerService', 'questionService', 'utilService'];

    function appCtrl($scope, $state, SweetAlert, testService, answerService, questionService, utilService) {
        $scope.user = {};
        $scope.test = {};
        $scope.theme;
        $scope.background = 'background';

        $scope.$on('testSelected', function (event, data) {
            $scope.user = angular.copy(data.user);
            $scope.theme = data.theme;
            getUserTests($scope.theme);
        });

        $scope.$on('questionAnswered', function (event, answer) {
            $scope.answers.forEach(updateAnswer);
            pickAnotherQuestion();

            function updateAnswer(a, i) {
                if (a.id == answer.id) {
                    $scope.answers[i] = angular.copy(answer);
                }
            }
        });

        $scope.$on('testLeft', function (event) {
            $scope.background = 'background';
        });

        $scope.$on('testInitialized', function(event) {
            $scope.background = 'background2';
        });

        $scope.$on('logsInitialized', function(event) {
            $scope.background = 'background-logs';
        });

        function getUserTests(theme) {
            testService.getByUserIdAndTheme($scope.user.id, theme).then(checkTests);
        }

        function continueTest(testId) {
            var params = {
                title: 'Teste em progresso!',
                text: 'Você já tem um teste em progresso. Deseja continuá-lo?',
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Novo teste',
                confirmButtonText: 'Continuar',
                confirmButtonColor: '#2c3e50'
            };
            SweetAlert.swal(params, function (isConfirm) {
                if (isConfirm) {
                    loadTest(testId);
                } else {
                    restartTest(testId);
                }
            });
        }

        function checkTests(tests) {
            var testId = checkForIncompleteTests(tests);
            if (testId) {
                continueTest(testId);
            } else {
                showNewTest();
            }
        }

        function showNewTest() {
            var params = {
                title: '',
                text: 'Vamos lá, mostre o seu melhor! ;)',
                imageUrl: './img/good-luck.png',
                imageSize: '202x202',
                confirmButtonText: 'Partiu',
                confirmButtonColor: '#91BB21'
            }
            SweetAlert.swal(params, createNewTest);
        }

        function checkForIncompleteTests(tests) {
            var testId;
            tests.forEach(checkTest);
            return testId;

            function checkTest(test) {
                if (!test.completedOn) {
                    testId = test.id;
                }
            }
        }

        function loadTest(testId) {
            testService.getById(testId).then(loadAnswers);
        }

        function loadAnswers(test) {
            if (test) {
                $scope.test = angular.copy(test);
                answerService.getByTestId(test.id).then(goToAnswers);
            }
        }

        function goToAnswers(answers) {
            $scope.answers = angular.copy(answers);
            pickAnotherQuestion();
        }

        function restartTest(testId) {
            $scope.test = {
                id: testId,
                userId: $scope.user.id
            };
            answerService.deleteByTestId(testId).then(addRandomQuestionsToTest);
        }

        function createNewTest() {
            $scope.test = {
                userId: $scope.user.id,
                theme: $scope.theme
            }
            testService.add($scope.test).then(
                function (test) {
                    $scope.test = angular.copy(test);
                    addRandomQuestionsToTest();
                }
            )
        }

        function addRandomQuestionsToTest() {
            questionService.getAllByStatusAndTheme(true, $scope.theme).then(
                function (questions) {
                    var positions = utilService.generateRandomArray(questions.length);
                    var answers = [];
                    positions.forEach(function (pos, i) {
                        var answer = {
                            testId: $scope.test.id,
                            questionId: questions[pos].id,
                            time: 0,
                            order: i + 1
                        }
                        answers.push(answer);
                    })
                    answerService.addAll(answers).then(initializeTest);
                }
            )
        }

        function initializeTest(answers) {
            $scope.answers = answers;
            var test = {
                id: $scope.test.id,
                total: $scope.answers.length
            };
            testService.update(test).then(function () {
                goToQuestion(answers[0].id);
            });
        }

        function goToQuestion(answerId) {
            var answeredCount = 0;
            $scope.answers.forEach(function (answer) {
                if (answer.answer) {
                    answeredCount++;
                }
            })
            var params = {
                answerId: answerId,
                answered: answeredCount,
                total: $scope.answers.length
            };
            $state.go('test', params);
        }

        function pickAnotherQuestion() {
            var id;
            var i = 0;
            if ($scope.answers.length) {
                while (!id) {
                    if (i >= $scope.answers.length) break;
                    if ($scope.answers[i].answer == null) {
                        id = $scope.answers[i].id;
                    }
                    i++;
                }
                if (id) {
                    goToQuestion(id);
                } else {
                    endTest();
                }
            } else {
                addRandomQuestionsToTest();
            }
        }

        function countRightAnswers() {
            var rightCount = 0;
            $scope.answers.forEach(function (answer) {
                if (answer.right) {
                    rightCount++;
                }
            });
            return rightCount;
        }

        function endTest() {
            var rightCount = countRightAnswers();
            var percentage = utilService.getPercetange(rightCount, $scope.answers.length);
            var test = {
                id: $scope.answers[0].testId,
                completedOn: new Date(),
                percentage: percentage,
                right: rightCount
            };
            testService.update(test).then(goToTestCompleted);
        }

        function goToTestCompleted() {
            $scope.background = 'background';
            $state.go('testCompleted', { testId: $scope.test.id });
        }

    }

})();
