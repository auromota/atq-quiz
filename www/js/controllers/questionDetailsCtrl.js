/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('questionDetailsCtrl', questionDetailsCtrl);

    questionDetailsCtrl.$inject = ['$scope', '$state', 'questionService'];

    function questionDetailsCtrl($scope, $state, questionService) {

        function loadQuestion(id) {
            questionService.getById(id).then(function (questions) {
                $scope.question = questions[0];
            }, redirect);
        }

        function redirect() {
            $state.go('home');
        }

        if ($state.params.id) {
            loadQuestion($state.params.id)
        } else {
            $state.go('settings');
        }

    }

})();
