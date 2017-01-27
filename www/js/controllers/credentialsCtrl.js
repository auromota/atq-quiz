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
            var params = {
                title: 'Pronto para começar?',
                text: 'Bem-vindo, ' + $scope.user.name + '! Qual tema deseja responder?',
                imageUrl: './img/icon-cerebro.png',
                imageSize: '202x202',
                showCancelButton: true,
                cancelButtonText: 'WCM - Controle de Qualidade',
                confirmButtonText: 'Qualidade e Segurança de Alimentos',
                confirmButtonColor: '#2c3e50',
                closeOnCancel: false,
                closeOnConfirm: false
            };
            SweetAlert.swal(params, function (isConfirm) {
                if (isConfirm) {
                    confirmUser(QSA);
                } else {
                    confirmUser(WCM);
                }
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
