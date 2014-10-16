/**
 * Created by d056670 on 01.08.14.
 */

/*eslint global-strict:0*/
'use strict';

/* Services */
angular.module('app.sirius')
    .factory('app.sirius.taskFilterConstants', function () {

        var _constants = {};
        _constants.ANY_USERS = 'ANY';
        _constants.ANY_STATUS = 'ANY';
        _constants.OPEN_STATUS = 'OPEN';
        _constants.IN_PROCESS_STATUS = 'PROC';
        _constants.NOT_APPLICABLE_STATUS = 'NA';
        _constants.COMPLETED_STATUS = 'COMP';
        _constants.CRITICAL_STATUS = 'CRIT';
        _constants.USER_ID_EMPTY = 'EMPTY';

        return {
            any_users: function () {
                return _constants.ANY_USERS;
            },
            any_status: function () {
                return _constants.ANY_STATUS;
            },
            open_status: function () {
                return _constants.OPEN_STATUS;
            },
            in_process_status: function () {
                return _constants.IN_PROCESS_STATUS;
            },
            not_applicable_status: function () {
                return _constants.NOT_APPLICABLE_STATUS;
            },
            completed_status: function () {
                return _constants.COMPLETED_STATUS;
            },
            critical_status: function () {
                return _constants.CRITICAL_STATUS;
            },
            user_id_empty: function () {
                return _constants.USER_ID_EMPTY;
            }
        };
    });
