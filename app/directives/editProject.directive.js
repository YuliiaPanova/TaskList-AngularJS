(function(){
    'use strict';
    angular.module('myApp')
        .directive('editProject', function( ) {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                templateUrl: 'templates/editProject.html',
            }
        });
})();