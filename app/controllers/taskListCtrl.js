(function() {
    'use strict';

    angular.module('myApp')
        .controller('taskListCtrl', ['$scope','AccountService','$routeParams','$rootScope','$location','ToastService',
            function ($scope,AccountService, $routeParams,$rootScope,$location,ToastService) {
                var account = AccountService,
                    self = this,
                    showEditTaskSidenav = 'false',
                    sess = $rootScope.session,
                    toast = ToastService;

                self.projectId = $routeParams.projectId;
                self.renderEditTaskSidenav = true ;

                if(!$routeParams.taskId){
                   self.renderEditTaskSidenav = false;//if task not defined Sidenav for edit task will not render
                };

                self.getAllTasks = function() {
                    account.getTasks(sess, self.projectId, 20, 0).then(
                        function (data) {
                            // self.tasks = data.tasks;
                            //-------tasks sorting to format             Arr = [
                                                                    //      0:[{1},{2},{3}],
                                                                    //      1:[{1},{2}] ,
                                                                    //      2:[{1},{2},{3}]
                                                                    //   ]
                            self.tasks = data;
                            if ($routeParams.taskId){
                                $scope.$parent.main.openEditTaskSidenav()
                            }
                            return sess
                        }
                    );
                }

                self.deleteTask = function ($event, taskId) {
                    if (confirm("Mark the task " + taskId + " as DONE?")) {
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
                                    if($routeParams.taskId){
                                        $location.path("project/" + self.projectId);//need to redirect
                                    }else{
                                        self.getAllTasks();
                                    }
                                    account.fetchProject(sess, self.projectId).then(//reshresh project count
                                        function () {
                                            $scope.$parent.main.fetchProjectData(sess, self.projectId, 'count');
                                            return sess
                                        }
                                    );
                                }
                            )
                        );
                    }
                    $event.preventDefault();
                    $event.stopImmediatePropagation();
                };


                $scope.mdItemContentClickInterceptor = function($event){
                    $event.preventDefault();
                    $event.stopImmediatePropagation();
                };

                $scope.openTask = function(e,taskList,Task){
                    showEditTaskSidenav = 'true';
                    $location.path("project/" + taskList.projectId + "/task/" + Task.Task.id);
                    $scope.$parent.main.openEditTaskSidenav();
                };

                self.getAllTasks();
            }]
        );
}());