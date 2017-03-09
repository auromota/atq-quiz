/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.controller('credentialsCtrl', credentialsCtrl);

    credentialsCtrl.$inject = ['$scope', '$rootScope', '$timeout', 'SweetAlert', 'userService', 'securityService'];

    function credentialsCtrl($scope, $rootScope, $timeout, SweetAlert, userService, securityService) {
        $scope.user = {};

        var WCM = 1;
        var QSA = 2;

        $scope.submit = function () {
            $('#myModal').modal('show');

            $(".btnWCM").click(function(){
                $('#myModal').modal('hide');
                confirmUser(WCM);
            });
            $(".btnQSA").click(function(){
                $('#myModal').modal('hide');
                confirmUser(QSA)
            });
        }

        function confirmUser(theme) {
            userService.save($scope.user).then(
                function (user) {
                    securityService.login(user);
                    $rootScope.$broadcast('testSelected', { user: user, theme: theme });
                }
            );
        }

    }

})();
