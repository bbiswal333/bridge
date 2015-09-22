angular.module('app.profitCenter').controller('app.profitCenter.detailcontroller', ['$scope', '$http',
    function ($scope, $http) {
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
                    nodesById[node.PATH].controller = node.CONTROLLER_FIRST_NAME + node.CONTROLLER_LAST_NAME;
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

        /*function openNodesUntilMoreThan1Option(nodes) {
            nodes.map(function(node) {
                if(nodesById[node.PATH].children.length === 1) {
                    if(nodesById[node.PATH].children[0].isProfitCenter) {
                        return;
                    }
                    nodesById[node.PATH].collapsed = false;
                } else {
                    nodesById[node.PATH].collapsed = false;
                    nodesById[node.PATH].children.map(function(subNode) {
                        subNode.collapsed = true;
                    });
                }
            });
            $scope.treeData[0].children.map(function(node) {
                node.collapsed = true;
            });
        }*/

        function processHierarchy(nodes) {
            parseAllNodes(nodes);
            buildTree(nodes);
            //openNodesUntilMoreThan1Option(nodes);
        }

        $http.get("https://ift.wdf.sap.corp/sap/bc/bridge/GET_PROFIT_CENTER_HIERARCHY").then(function(response) {
            processHierarchy(response.data.DATA);
        });

    }
]);
