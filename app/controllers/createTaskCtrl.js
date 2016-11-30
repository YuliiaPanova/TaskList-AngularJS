(function() {
    'use strict';

    angular.module('myApp')
        .controller('createTaskCtrl', ['$scope','AccountService','$rootScope','$routeParams',
            function ($scope,AccountService, $rootScope, $routeParams) {
                var self = this,
                    account = AccountService,
                    sess = $rootScope.session,
                    projectId = $routeParams.projectId;

                self.createTaskConfirm = function() {
                    account.createTask(sess, projectId, self.taskName, self.taskDescription)
                    .then(
                        function (data) {
                            //refresh all tasks
                            account.getTasks(sess, projectId, 20, 0).then(
                                function (data) {
                                    $scope.$parent.taskList.tasks = data;
                                    return sess
                                }
                            );


                            //fetch task's count of current project
                            account.fetchProject(sess, projectId).then(
                                function (data) {
                                    $scope.$parent.main.fetchProjectData(sess, projectId, 'count');
                                    return sess
                                }
                            );
                            $scope.$parent.main.toggleCreateTaskSidenav();
                            return sess
                        }
                    );
                };
            }]
        );
}());