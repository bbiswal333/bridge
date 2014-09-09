/**
 * Created by d056670 on 01.08.14.
 */
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
            ANY_USERS: function () {
                return _constants.ANY_USERS;
            },
            ANY_STATUS: function () {
                return _constants.ANY_STATUS;
            },
            OPEN_STATUS: function () {
                return _constants.OPEN_STATUS;
            },
            IN_PROCESS_STATUS: function () {
                return _constants.IN_PROCESS_STATUS;
            },
            NOT_APPLICABLE_STATUS: function () {
                return _constants.NOT_APPLICABLE_STATUS;
            },
            COMPLETED_STATUS: function () {
                return _constants.COMPLETED_STATUS;
            },
            CRITICAL_STATUS: function () {
                return _constants.CRITICAL_STATUS;
            },
            USER_ID_EMPTY: function () {
                return _constants.USER_ID_EMPTY;
            }
        }
    });

