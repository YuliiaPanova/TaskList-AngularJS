(function() {
    'use strict';

    angular.module('myApp')
        .controller('editProjectCtrl', ['$scope','AccountService','$routeParams','$rootScope',
            function ($scope,AccountService, $routeParams,$rootScope) {
                var account = AccountService,
                    self = this,
                    sess = $rootScope.session;

                self.projectId = $routeParams.projectId;

                self.getParam = function () {
                    return 3;
                };

                function getProject() {
                    account.fetchProject(sess, self.projectId).then(
                        function (data) {
                            self.projectTitle = data.Project.title;
                            return sess
                        }
                    );
                }

                self.updateProjectConfirm = function () {
                    account.updateProject(sess, self.projectId, self.projectTitle).then(
                        function (data) {
                            $scope.$parent.main.toggleEditProjectSidenav();
                            $scope.$parent.main.fetchProjectData(sess, self.projectId, 'name');
                        }
                    )
                };

                getProject();

            }]
        );
}());