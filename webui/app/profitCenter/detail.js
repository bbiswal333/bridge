angular.module('app.profitCenter').controller('app.profitCenter.detailcontroller', ['$scope', '$http', '$timeout',
    function ($scope, $http, $timeout) {
        var nodesById = {};

        function parseAllNodes(nodes) {
            nodes.map(function(node) {
                nodesById[node.PATH] = {
                    id: node.PATH,
                    label: node.PROFIT_CENTER_NAME,
                    children: [],
                    collapsed: true
                };
                nodesById[node.PATH].isProfitCenter = (node.IS_LEAF === 'X' ? true : false);
                if(nodesById[node.PATH].isProfitCenter) {
                    nodesById[node.PATH].leafClass = 'profitCenterLeafClass';
                    nodesById[node.PATH].profitCenterId = node.PROFIT_CENTER_ID;
                    nodesById[node.PATH].controller = node.CONTROLLER_FIRST_NAME + " " + node.CONTROLLER_LAST_NAME;
                }
            });
        }

        function buildTree(nodes) {
            nodes.map(function(node) {
                if (!node.PARENT_PATH) {
                    $scope.treeData = [nodesById[node.PATH]];
                } else {
                    nodesById[node.PARENT_PATH].children.push(nodesById[node.PATH]);
                }
            });
        }

        function processHierarchy(nodes) {
            if(nodes && nodes.length > 0) {
                parseAllNodes(nodes);
                buildTree(nodes);
            }
        }

        $http.get("https://ifp.wdf.sap.corp/sap/bc/bridge/GET_PROFIT_CENTER_HIERARCHY").then(function(response) {
            processHierarchy(response.data.DATA);
        });

        $timeout(function() {
            $scope.treeLoadFinished = true;
        }, 5000);
    }
]);
