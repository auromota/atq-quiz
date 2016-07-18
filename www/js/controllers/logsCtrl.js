/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('logsCtrl', logsCtrl);

    logsCtrl.$inject = ['$scope', '$state', 'SweetAlert', 'testService', 'dbService'];

    function logsCtrl($scope, $state, SweetAlert, testService, dbService) {

        $scope.maxCollapsed = true;
        $scope.minCollapsed = true;
        $scope.filter = {};
        $scope.results = null;

        var range = {
            dateFrom: undefined,
            dateTo: undefined
        }

        function loadTests() {
            testService.getAllTestsAndUsers(range).then(function (tests) {
                if (tests && tests.length) {
                    updateResults(tests);
                } else {
                    $scope.results = null;
                }
                $scope.tests = tests;
            }, function (err) {
                $state.go('home');
            });
        }

        function updateResults(tests) {
            var sumPercentage = 0;
            var max = {
                tests: {
                    percentage: -1
                }
            };
            var min = {
                tests: {
                    percentage: 101
                }
            }

            tests.forEach(calculate);

            $scope.results = {
                average: sumPercentage / tests.length,
                minTest: min,
                maxTest: max
            };

            function calculate(test) {
                sumPercentage += test.tests.percentage;
                checkMax(test);
                checkMin(test);
            }

            function checkMin(test) {
                if (test.tests.percentage < min.tests.percentage) {
                    min = test;
                }
            }

            function checkMax(test) {
                if (test.tests.percentage > max.tests.percentage) {
                    max = test;
                }
            }
        }

        $scope.details = function (id) {
            $state.go('testDetails', { testId: id });
        }

        $scope.$watch('filter.dateFrom', function (newValue, oldValue) {
            range.dateFrom = newValue;
            loadTests();
        });

        $scope.$watch('filter.dateTo', function (newValue, oldValue) {
            if (newValue) {
                range.dateTo = new Date(1900 + newValue.getYear(), newValue.getMonth(), newValue.getDate(), 23, 59, 59)
                loadTests();
            }
        });

    }

})();
