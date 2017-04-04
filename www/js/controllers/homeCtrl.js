/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$rootScope', '$state'];

    function homeCtrl($scope, $rootScope, $state) {
        $scope.user = {};
        $scope.showError = false;

        $rootScope.$broadcast('homeInitialized');

        $scope.login = function() {
            $('#loginModal').modal('show');
        }

        $scope.executeLogin = function() {
            if (($scope.user.email == "naiara.bianchetti@unilever.com" || $scope.user.email == "valeria.toratti@unilever.com")
             && $scope.user.password == "mtsqc") {
                $('#loginModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
                $scope.user = {};
                $scope.showError = false;
                $state.go('logs', {});
             }else{
                 alert("E-mail e/ou senha errado(s)...");
             }
        }
    }

})();
