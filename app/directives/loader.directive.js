(function(){
    'use strict';
    angular.module('myApp')
        .directive('loader', function( ) {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                templateUrl: '../templates/loader.html'
            }
        });
})();
