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
        $scope.filter = {
            wcm: true,
            qsa: true
        };
        $scope.results = null;

        var filter = {
            dateFrom: undefined,
            dateTo: undefined,
            wcm: true,
            qsa: true
        }

        function loadTests() {
            testService.getAllTestsAndUsers(filter).then(function (tests) {
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
            filter.dateFrom = newValue;
            loadTests();
        });

        $scope.$watch('filter.dateTo', function (newValue, oldValue) {
            if (newValue) {
                filter.dateTo = new Date(1900 + newValue.getYear(), newValue.getMonth(), newValue.getDate(), 23, 59, 59)
                loadTests();
            }
        });

        $scope.$watch('filter.wcm', function (newValue) {
            if (newValue != undefined) {
                filter.wcm = newValue;
                loadTests();
            }
        })

        $scope.$watch('filter.qsa', function (newValue) {
            if (newValue != undefined) {
                filter.qsa = newValue;
                loadTests();
            }
        })

    }

})();
