/*jslint browser: true*/ /*global sigma*/
angular.module("app.jenkins").controller("app.jenkins.controller", ["$scope", "$http", "$location" , "$q",
    function ($scope, $http, $location, $q) {

    var dependencyGraph = { nodes: [], edges: [] };
    var dependencyData = { dependency: [] };
    var parentJob = [];



    var removeDuplicate = function(nodes){
        var newNodes = [];
        var found, label2, label2Length, label1, labelLength;
        for (var x = 0; x < nodes.length; x++) {
            found = undefined;
            label1 = nodes[x].label;
            labelLength = label1.length;
            label1.slice(0,(labelLength - 1));
            for (var y = 0; y < newNodes.length; y++) {
                label2 = newNodes[y].label;
                label2Length = label2.length;
                label2.slice(0,label2Length - 1);
                if (label2 === label1) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newNodes.push(nodes[x]);
            }
        }
        return newNodes;
    };

    var getColor = function(color){
            if(color === "red"){
                return "#D53F26";
            }else if(color === "yellow"){
                return "#FCB517";
            }else if(color === "blue" || color === "green"){
                return "#4EA175";
            }else{
                return "#707070";
            }
        };


    var getNodeId = function(fromNode){
        for(var nodeIndex in dependencyGraph.nodes) {
            if(fromNode === dependencyGraph.nodes[nodeIndex].label){
                return dependencyGraph.nodes[nodeIndex].id;
            }
        }
    };

    var formNodes = function(dependency){
        for(var nodeIndex in dependency) {
               dependencyGraph.nodes.push({
                                        id: dependency[nodeIndex].from + nodeIndex,
                                        label: dependency[nodeIndex].from,
                                        x: Math.random(),
                                        y: Math.random(),
                                        size: 10,
                                        color: getColor(dependency[nodeIndex].colorFrom)
                                      }
                                    );
            dependencyGraph.nodes.push({
                                        id: dependency[nodeIndex].to + nodeIndex,
                                        label: dependency[nodeIndex].to,
                                        x: Math.random(),
                                        y: Math.random(),
                                        size: 10,
                                        color: getColor(dependency[nodeIndex].colorTo)
                                      });
        }

        dependencyGraph.nodes = removeDuplicate(dependencyGraph.nodes);

        for(var dependencyIndex in dependency) {
            dependencyGraph.edges.push({
                                            id: "e" + dependencyIndex,
                                            source: getNodeId(dependency[dependencyIndex].from),
                                            target: getNodeId(dependency[dependencyIndex].to),
                                            type: "arrow",
                                            arrowSizeRatio: 10,
                                            color: "#707070"
                                          }
                                        );
        }

        sigma.renderers.def = sigma.renderers.canvas;
        /*eslint-disable new-cap*/
        var s = new sigma({
              graph: dependencyGraph,
              type: "canvas",
              container: "container"
            });
        /*eslint-enable new-cap*/

        // Neighbour showing
        s.bind("clickNode", function(ev) {
          var nodeIdx = ev.data.node.id;
          var neighbors = [];
          s.graph.edges().forEach(function(edge) {
            if ((edge.target === nodeIdx) || (edge.source === nodeIdx)) {
              edge.color = "#0000CD";
              neighbors.push(edge.target);
              neighbors.push(edge.source);
            } else {
              edge.color = "#e6e6e6";
            }
          });
          s.refresh();
        });

        sigma.plugins.dragNodes(s, s.renderers[0]);
    };

    /*eslint-disable no-use-before-define*/
    var getDependencyData = function(job){
        var promisses = [];
        var level = 0;
            for(var edgeIndex in job.downstreamProjects) {
            dependencyData.dependency.push({
                                from: job.name,
                                to: job.downstreamProjects[edgeIndex].name,
                                level : level,
                                colorFrom : job.color,
                                colorTo   : job.downstreamProjects[edgeIndex].color
                              }
                            );
            level = level + 1;
            promisses.push(getDownstreamJobs(job.downstreamProjects[edgeIndex].url));

            }
        return $q.all(promisses);
    };

    var getDownstreamJobs = function(url){
        var deferred = $q.defer();
        $http({ method: "GET", url: "/api/get?url=" + encodeURIComponent(url + "api/json"), withCredentials: false })
            .success(function(result) {
                getDependencyData(result).then(function(){
                    deferred.resolve();
                });

            }).error(function() {
                deferred.reject();
            });
        return deferred.promise;
    };


    var findParentNodeJob = function(job){
        var promisses = [];
        for(var index in job.upstreamProjects){
            var jobUrl = job.upstreamProjects[index].url;
            promisses.push(getJob(jobUrl));
        }
        return $q.all(promisses);
    };

    var getJob = function(url){
        var deferred = $q.defer();
        $http({ method: "GET", url: "/api/get?url=" + encodeURIComponent(url + "/api/json"), withCredentials: false })
            .success(function(result) {
                    parentJob = result;
                    findParentNodeJob(result).then(function(){
                        deferred.resolve();
                    });

            }).error(function(){
                deferred.reject();
            });
        return deferred.promise;
    };
    /*eslint-enable no-use-before-define*/

    $scope.detailJobView = function(url){
            $location.path("/detail/job/");
            $http({ method: "GET", url: "/api/get?url=" + encodeURIComponent(url + "/api/json"), withCredentials: false }).
                success(function(data) {
                    if(data.upstreamProjects.length >= 1){
                        findParentNodeJob(data).then(function(){
                            getDependencyData(parentJob).then(function(){
                                formNodes(dependencyData.dependency);
                            });
                        });
                    }else if(data.downstreamProjects.length >= 1){
                        getDependencyData(data).then(function(){
                            formNodes(dependencyData.dependency);
                        });
                    }else{
                        dependencyGraph.nodes.push({
                                        id: "n1",
                                        label: data.name,
                                        x: 0,
                                        y: 0,
                                        size: 10,
                                        color: data.color
                                      }
                                    );
                            /*eslint-disable*/
                            new sigma({
                                graph: dependencyGraph,
                                container: "container"
                            });
                            /*eslint-enable*/
                    }
                }).
                error(function() {
                });
    };
}]);
