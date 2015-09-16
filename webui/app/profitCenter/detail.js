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
            parseAllNodes(nodes);
            buildTree(nodes);
        }

        $http.get("https://ifd.wdf.sap.corp/sap/bc/bridge/GET_PROFIT_CENTER_HIERARCHY").then(function(response) {
            processHierarchy(response.data.DATA);
        });

    }
]);
