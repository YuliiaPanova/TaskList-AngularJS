(function(){
    'use strict';
    angular.module('myApp')
        .directive('createProject', function( ) {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                templateUrl: 'app/templates/createProject.html',
            }
        });
})();
