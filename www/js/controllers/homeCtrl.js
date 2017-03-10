/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function() {
    'use strict';

    app.controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$scope', '$rootScope'];

    

    function homeCtrl($scope, $rootScope) {
        $rootScope.$broadcast('homeInitialized');
    }

})();
