(function(){
    'use strict';
    angular.module('myApp')
        .directive('editTask', function( ) {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                templateUrl: '../templates/editTask.html'
            }
        });
})();