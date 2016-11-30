(function() {
    'use strict';

    angular.module('myApp')
        .controller('createProjectCtrl', ['$scope','AccountService','$rootScope',
            function ($scope,AccountService, $rootScope) {
                var self = this,
                    account = AccountService,
                    sess = $rootScope.session;

                self.createProjectConfirm = function() {
                    account.createProject(sess, self.projectName)
                        .then(
                        function (data) {
                            account.getAllProjects(sess).then(
                                function (data) {
                                    $scope.$parent.main.projects = data.projects;
                                    //--close sidenav
                                    $scope.$parent.main.toggleCreateProjectSidenav();
                                }
                            );

                            return sess
                        }
                    );
                };

            }]
        );
}());