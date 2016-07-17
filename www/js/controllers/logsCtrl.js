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
        var range = {
            dateFrom: undefined,
            dateTo: undefined
        }

        function loadTests() {
            testService.getAllTestsAndUsers(range).then(function (tests) {
                $scope.tests = tests;
            }, function (err) {
                $state.go('home');
            });
        }

        $scope.clear = function () {
            var params = {
                title: 'Você tem certeza?',
                text: 'Se você continuar, todos os testes, inclusive os que estiverem em progresso, serão apagados.',
                type: 'warning',
                confirmButtonColor: '#d62c1a',
                confirmButtonText: 'Apagar',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                closeOnConfirm: true,
                closeOnCancel: true
            };
            SweetAlert.swal(params, function (isConfirm) {
                if (isConfirm) {
                    removeTests();
                }
            });
        }

        function removeTests() {
            testService.removeAll().then(loadTests);
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
