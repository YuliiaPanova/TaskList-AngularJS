(function() {
    'use strict';

    angular.module('myApp')
        .controller('editTaskCtrl', ['$scope','AccountService','$rootScope','$routeParams','$location', 'ToastService',
            function ($scope,AccountService, $rootScope, $routeParams,$location, ToastService) {
                var self = this,
                    account = AccountService,
                    taskId = $routeParams.taskId,
                    sess = $rootScope.session,
                    projectId = $routeParams.projectId,
                    toast = ToastService;

                self.getTask = function () {
                    account.fetchTask(sess, taskId).then(
                        function (data) {
                            self.currentTask = data.Task;
                        },
                        function (data) {
                            toast.showToast('Task with id = '+ taskId +' not found');
                            console.log('Task with id = '+ taskId +' not found');
                            $location.path("project/" + projectId);
                        }
                    )
                };

                self.editTaskConfirm = function () {
                    account.updateTask(sess, taskId, self.currentTask.title, self.currentTask.description).then(
                        function (data) {
                            // $scope.$parent.taskList.getAllTasks();
                            $location.path("project/" + projectId);
                        }
                    );
                    $scope.$parent.main.closeEditTaskSidenav();
                };

                self.deleteTaskConfirm = function () {
                    account.fetchTask(sess, taskId).then(//reshresh project count
                        function (data) {
                            var taskTitle = data.Task.title;
                            toast.showToast('Task '+ taskTitle +' deleted!');
                            console.log('Task with id=' + taskId+ '('+ taskTitle +')'+' deleted!');
                            return taskTitle;
                        }
                    ).then(
                        account.deleteTask(sess, taskId).then(
                            function () {
                                $location.path("project/" + $routeParams.projectId);
                            }
                        )
                    ).then(
                        account.fetchProject(sess, projectId).then(//reshresh project count
                            function () {
                                $scope.$parent.main.fetchProjectData(sess, projectId, 'count');
                                return sess
                            }
                        )
                    );
                };

                if($scope.$parent.taskList.renderEditTaskSidenav){
                    self.getTask();
                }

            }]
        );
}());