(function(){
    'use strict';
    angular.module('myApp')
        .directive('createTask', function() {
            return {
                restrict: 'AE',
                transclude: true,
                replace: true,
                templateUrl: 'app/templates/createTask.html'
            }
        });
})();