(function(){
    'use strict';
    angular.module('myApp', [ 'ngMaterial', 'ngRoute', 'ngCookies' ])
    .controller('MainController', [
        'AccountService', '$mdSidenav', '$q','$rootScope','$location','$routeParams','ToastService',
        MainController
    ])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider',
        function($locationProvider, $routeProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('!');
        $mdThemingProvider.disableTheming();

        $routeProvider
            .when("/",{
                templateUrl:"app/templates/noMatchProject.html"
            })
            .when("/project/:projectId", {
                templateUrl:"app/templates/taskList",
                controller: "taskListCtrl",
                controllerAs:"taskList"
            })
            .when("/project/:projectId/task/:taskId", {
                templateUrl:"app/templates/taskList",
                controller: "taskListCtrl",
                controllerAs:"taskList"
            })
            .otherwise({
                redirectTo:"/"
            })
        ;

    }]);

    function MainController(AccountService, $mdSidenav,  $q, $rootScope,$location,$routeParams,ToastService) {
        var self = this,
            toast = ToastService,
            account = AccountService;

        self.session = null;
        self.user = null;
        
        self.isActive = function (project) {
            var path = $location.path();
            var str = path.substr(path.indexOf('project'));
            if (path.indexOf('task') > 0) {
                str = path.substring(path.indexOf('project'), path.indexOf('task')-1);
            }
            if (str.match(project)) {
                    return true;
                } else {
                    return false;
                }
        };

        self.toggleLeftMenu = function() {
            $mdSidenav('left').toggle();
        };
        self.toggleCreateTaskSidenav = function() {
            $mdSidenav('createTask').toggle();
        };
        self.closeEditTaskSidenav = function() {
            $mdSidenav('editTask').close()
        };

        self.openEditTaskSidenav = function() {
            $mdSidenav('editTask').open();
        };
        self.toggleCreateProjectSidenav = function() {
            $mdSidenav('createProject').toggle();
            //clear inputs
        };
        self.toggleEditProjectSidenav = function() {
            $mdSidenav('editProject').toggle();
            //clear inputs
        };

        // drop-down menu
        self.openMenu = function($mdOpenMenu, ev) {
            $mdOpenMenu(ev);
        };

        
        self.deleteProject = function () {
            var projectName;
            self.fetchProjectData(self.session,$routeParams.projectId, 'name')
                .then(
                function (data) {
                    projectName = data;
                    console.log(data);
                    account.deleteProject(self.session, $routeParams.projectId).then(
                        function () {
                            toast.showToast('Project '+projectName+' deleted.');
                            $location.url('/');
                            account.getAllProjects(self.session).then(
                                function (projects) {
                                    self.projects = projects.projects;
                                }
                            );
                            return true;
                        }
                    );
                }
            );
        };

        self.fetchProjectData = function (session, projectId, type) {
            return account.fetchProject(session, projectId).then(
                function (data) {
                    for (var i = 0; i < (self.projects.length ); i++){
                        if (self.projects[i].Project.id == projectId){break}
                    }
                    if (type == 'count'){
                        self.projects[i].Project.task_count = data.Project.task_count;
                    }
                    if (type == 'name'){
                        self.projects[i].Project.title = data.Project.title;
                        return self.projects[i].Project.title;
                    }
                    return session
                }
            );
        };

        $rootScope.contentLoading = true;
        account.getSession()
            .then(
                function (session) {
                    return session.session;
                },
                function (res) {
                    return account.createUser().then(
                        function(data) {
                            return data.session;
                        }
                    )
                        .then(
                            function (session) {
                                account.storeSessionToCookie(session);
                                return session
                            }
                        );
                }
            ).then(
                function (session) {
                    self.session = session;
                    var deferred = $q.defer();
                    $rootScope.session = session;
                    account.getUser(session).then(
                        function (user) {
                            self.user = user.Account;
                            deferred.resolve(session);
                        }
                    );
                    return deferred.promise;
                }
        ).then(
            function (session) {
                var deferred = $q.defer();
                account.getAllProjects(session).then(
                    function (projects) {
                        self.projects = projects.projects;
                        deferred.resolve(session);
                    }
                );

                return deferred.promise;
            }
        ).then(
            function () {
                $rootScope.contentLoading=false;
            }
        );
    }
})();