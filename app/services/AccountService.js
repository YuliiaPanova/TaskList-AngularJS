(function(){
'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp')
    .factory('AccountService',[ '$q','$http', '$cookies', '$cookieStore',
        function($q,$http, $cookies, $cookieStore) {

        var formatingTaskList= function (initialArr) {
            //-------tasks sorting to format   Arr = [
            //     //                                      0:[{1},{2},{3}],
            //     //                                      1:[{1},{2}] ,
            //     //                                      2:[{1},{2},{3}]
            //     //                                  ]
            var arrA = [],
                regExpDate = /2...-..-../ig,
                j = 0,
                key = '',
                arrB = [];                            //
            for (var i = 0; i < (initialArr.tasks.length ); i++){
                var date = initialArr.tasks[i].Task.created_at.match(regExpDate)[0];
                if( !arrA[date]){arrA[date] = [];}
                if(arrA[date]){arrA[date].push(initialArr.tasks[i])}
            }
            for (key in arrA ){
                arrB[j]= {'innerTasks': arrA[key], 'created_at': key};
                j++;
            }
            arrA = [];
            return arrB;
        };
        var service =
        {
            //---session
            getSession: function () {
                var deferred = $q.defer();

                var session = service._getSessionFromCookie();

                if( !session ){
                    // if session not exists

                    deferred.reject(false);
                } else {
                    deferred.resolve(session);
                }

                return deferred.promise;
            },
            storeSessionToCookie: function (session) {

                $cookieStore.put( 'sessionObj', {'session': session} )
            },
            _getSessionFromCookie: function () {
                var session = "";

                try {
                    session = $cookieStore.get( 'sessionObj' );
                } catch (e){
                    console.log(e)
                }

                return session;
            },
            //---user
            createUser: function(){
                var deferred = $q.defer();
                $http.post('https://api-test-task.decodeapps.io/signup', {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            getUser: function (session) {
                var deferred = $q.defer();
                $http.get('https://api-test-task.decodeapps.io/account?session='+session, {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            //---project
            getAllProjects: function (session) {
                var deferred = $q.defer();
                $http.get('https://api-test-task.decodeapps.io/projects?session='+session, {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            fetchProject: function (session, project_id) {
                var deferred = $q.defer();
                $http.get('https://api-test-task.decodeapps.io/projects/project?session='+session+'&project_id='+ project_id, {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            createProject: function(session, projectName){
                var deferred = $q.defer();
                var body = {
                    "Project":{
                        "title" : projectName
                    },
                    "session":session
                };
                var config = {
                    headers : {
                        'Content-Type': 'application/json;'
                    }
                };
                $http.post('https://api-test-task.decodeapps.io/projects/project', body, config)
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            deleteProject: function (session, project_id) {
                var deferred = $q.defer();
                $http.delete('https://api-test-task.decodeapps.io/projects/project?session='+session+'&project_id='+ project_id, {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            updateProject: function (session,idProject, projectName) {
                var deferred = $q.defer(),
                    body =
                    {
                        "Project": {
                            "title": projectName,
                            "id": idProject
                        },
                        "session": session
                    },
                    config = {
                        headers : {
                            'Content-Type': 'application/json;'
                        }
                    };
                $http.post('https://api-test-task.decodeapps.io/projects/project', body, config)
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            //---task
            getTasks: function (session, project_id, paging_size, paging_offset) {
                var deferred = $q.defer();
                $http.get('https://api-test-task.decodeapps.io/tasks?session='+session+'&project_id='+ project_id + '&paging_size='+ paging_size+'&paging_offset='+paging_offset, {})
                    .then(function (res) {
                        deferred.resolve(formatingTaskList(res.data));

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            createTask: function (session,idProject, taskName, taskDescription) {
                var deferred = $q.defer(),
                    body = {
                        "Project": {
                            "id": idProject
                        },
                        "Task": {
                            "title": taskName,
                            "description": taskDescription
                        },
                        "session": session
                    },
                    config = {
                        headers : {
                            'Content-Type': 'application/json;'
                        }
                    };
                $http.post('https://api-test-task.decodeapps.io/tasks/task', body, config)
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            updateTask: function (session,idTask, taskName, taskDescription) {
                var deferred = $q.defer(),
                    body =
                    {
                        "Task": {
                            "title": taskName,
                            "id": idTask,
                            "description": taskDescription
                        },
                        "session": session
                    },
                    config = {
                        headers : {
                            'Content-Type': 'application/json;'
                        }
                    };
                $http.post('https://api-test-task.decodeapps.io/tasks/task', body, config)
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            deleteTask: function (session, task_id) {
                var deferred = $q.defer();
                $http.delete('https://api-test-task.decodeapps.io/tasks/task?session='+session+'&task_id='+ task_id, {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            },
            fetchTask: function (session, task_id) {
                var deferred = $q.defer();
                $http.get('https://api-test-task.decodeapps.io/tasks/task?session='+session+'&task_id='+ task_id, {})
                    .then(function (res) {
                        deferred.resolve(res.data);

                    }, function (res) {
                        deferred.reject(res);
                    });
                return deferred.promise;
            }
        };

        return service;
    }]);
})();