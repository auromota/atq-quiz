/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.factory('questionService', questionService);

    questionService.$inject = ['$q', 'dbService', 'crudService'];

    function questionService($q, dbService, crudService) {
        var service = {
            getAll: getAll,
            getById: getById,
            getAllByStatus: getAllByStatus,
            getAllByStatusAndTheme: getAllByStatusAndTheme
        }

        return service;

        function getAll() {
            var deferred = $q.defer();
            crudService.findAll('questions').then(
                function (questions) {
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            crudService.find(id, 'questions', 'id').then(
                function (questions) {
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getAllByStatus(status) {
            var deferred = $q.defer();
            crudService.find(status, 'questions', 'status').then(
                function (questions) {
                    deferred.resolve(questions);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getAllByStatusAndTheme(status, theme) {
            var deferred = $q.defer();
            try {
                dbService.db.select()
                    .from(dbService.questions)
                    .where(lf.op.and(
                        dbService.questions.status.eq(status),
                        dbService.questions.theme.eq(theme)
                    ))
                    .exec().then(
                    function (tests) {
                        deferred.resolve(tests);
                    }, function (err) {
                        deferred.reject(err);
                    }
                    );
            } catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }
    }

})();
