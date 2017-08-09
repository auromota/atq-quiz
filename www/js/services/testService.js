/*
    Author: Auro Mota <auro@blueorc.com>
*/

(function () {
    'use strict';

    app.factory('testService', testService);

    testService.$inject = ['$q', 'dbService', 'crudService'];

    function testService($q, dbService, crudService) {
        var service = {
            getByUserId: getByUserId,
            add: add,
            remove: remove,
            update: update,
            getById: getById,
            getAllTestsAndUsers: getAllTestsAndUsers,
            getTestAndUser: getTestAndUser,
            removeAll: removeAll,
            getByUserIdAndTheme: getByUserIdAndTheme
        }

        return service;

        function add(test) {
            var deferred = $q.defer();
            crudService.insert(test, 'tests').then(
                function (test) {
                    deferred.resolve(test);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getByUserId(userId) {
            var deferred = $q.defer();
            crudService.find(userId, 'tests', 'userId').then(
                function (tests) {
                    deferred.resolve(tests);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getByUserIdAndTheme(userId, theme) {
            var deferred = $q.defer();
            try {
                dbService.db.select()
                    .from(dbService.tests)
                    .where(lf.op.and(
                        dbService.tests.userId.eq(userId),
                        dbService.tests.theme.eq(theme)
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

        function update(test) {
            var deferred = $q.defer();
            crudService.update(test.id, test, 'tests').then(
                function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getById(id) {
            var deferred = $q.defer();
            crudService.find(id, 'tests', 'id').then(
                function (tests) {
                    deferred.resolve(tests[0]);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function getAllTestsAndUsers(filter) {
            var deferred = $q.defer();
            try {
                if (filter) {
                    if (filter.dateFrom && filter.dateTo) {
                        var where = dbService.tests.completedOn.between(filter.dateFrom, filter.dateTo);
                    } else {
                        var where = dbService.tests.completedOn.isNotNull();
                    }
                    var or = null;
                    if (filter.wcm && filter.qsa) {
                        where = lf.op.and(where, lf.op.or(dbService.tests.theme.eq(1), dbService.tests.theme.eq(2)));
                    } else {
                        if (filter.wcm) {
                            var where = lf.op.and(where, dbService.tests.theme.eq(1));
                        } else if (filter.qsa) {
                            var where = lf.op.and(where, dbService.tests.theme.eq(2));
                        } else {
                            var where = lf.op.and(where, lf.op.and(dbService.tests.theme.neq(1), dbService.tests.theme.neq(2)));
                        }
                    }
                }
                dbService.db.select()
                    .from(dbService.tests)
                    .innerJoin(dbService.users, dbService.tests.userId.eq(dbService.users.id))
                    .where(where)
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

        function getTestAndUser(id) {
            var deferred = $q.defer();
            try {
                dbService.db.select()
                    .from(dbService.tests)
                    .innerJoin(dbService.users, dbService.tests.userId.eq(dbService.users.id))
                    .where(dbService.tests.id.eq(id))
                    .exec().then(
                    function (test) {
                        deferred.resolve(test[0]);
                    }, function (err) {
                        deferred.reject(err);
                    }
                    );
            } catch (err) {
                deferred.reject(err);
            }
            return deferred.promise;
        }

        function remove(id) {
            var deferred = $q.defer();
            crudService.remove(id, 'tests', 'id').then(
                function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }

        function removeAll() {
            var deferred = $q.defer();
            crudService.removeAll('tests').then(
                function (result) {
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err);
                }
            );
            return deferred.promise;
        }
    }

})();
