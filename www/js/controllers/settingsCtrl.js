/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('settingsCtrl', settingsCtrl);

    settingsCtrl.$inject = ['$scope', '$state', 'testService', 'questionService'];

    function settingsCtrl($scope, $state, testService, questionService) {

        function loadQuestions() {
            questionService.getAll().then(
                function (questions) {
                    $scope.questions = questions;
                });
        }

        loadQuestions();

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
            testService.removeAll().then(function () {
                alert('deu certo')
            });
        }

        $scope.edit = function (question) {
            $state.go('questionDetails', question);
        }
    }

})();
