/*jslint browser: true */ /*global sigma*/
angular.module('app.jenkins').controller('app.jenkins.controller', ['$scope', '$http', '$location' , '$q',
    function ($scope, $http, $location, $q) {

    var dependancyGraph = { nodes: [],
                            edges: []
                        };
    var dependancyData = { dependancy: [] };
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
        for(var nodeIndex in dependancyGraph.nodes) {
            if(fromNode === dependancyGraph.nodes[nodeIndex].label){
                return dependancyGraph.nodes[nodeIndex].id;
            }
        }
    };

    var formNodes = function(dependancy){
        for(var nodeIndex in dependancy) {
               dependancyGraph.nodes.push({
                                        id: dependancy[nodeIndex].from + nodeIndex,
                                        label: dependancy[nodeIndex].from,
                                        x: Math.random(),
                                        y: Math.random(),
                                        size: 10,
                                        color: getColor(dependancy[nodeIndex].colorFrom)
                                      }
                                    );
            dependancyGraph.nodes.push({
                                        id: dependancy[nodeIndex].to + nodeIndex,
                                        label: dependancy[nodeIndex].to,
                                        x: Math.random(),
                                        y: Math.random(),
                                        size: 10,
                                        color: getColor(dependancy[nodeIndex].colorTo)
                                      });
        }

        dependancyGraph.nodes = removeDuplicate(dependancyGraph.nodes);

        for(var dependancyIndex in dependancy) {
            dependancyGraph.edges.push({
                                            id: "e" + dependancyIndex,
                                            source: getNodeId(dependancy[dependancyIndex].from),
                                            target: getNodeId(dependancy[dependancyIndex].to),
                                            type: "arrow",
                                            arrowSizeRatio: 10,
                                            color: "#707070"
                                          }
                                        );
        }

        sigma.renderers.def = sigma.renderers.canvas;
        var s = new sigma({
              graph: dependancyGraph,
              type: "canvas",
              container: "container"
            });

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

    var getDependancyData = function(job){
        var promisses = [];
        var level = 0;
            for(var edgeIndex in job.downstreamProjects) {
            dependancyData.dependancy.push({
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
        $http({ method: 'GET', url: '/api/get?url=' + encodeURIComponent(url + "api/json"), withCredentials: false })
            .success(function(result) {
                getDependancyData(result).then(function(){
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
        $http({ method: 'GET', url: '/api/get?url=' + encodeURIComponent(url + "/api/json"), withCredentials: false })
            .success(function(result) {
                    parentJob = result;
                    findParentNodeJob(result).then(function(){
                        deferred.resolve();
                    });
            }).error(function() {
                deferred.reject();
            });
        return deferred.promise;
    };

    $scope.detailJobView = function(url){
            $location.path("/detail/job/");
            $http({ method: 'GET', url: '/api/get?url=' + encodeURIComponent(url + "/api/json"), withCredentials: false }).
                success(function(data) {
                    if(data.upstreamProjects.length >= 1){
                        findParentNodeJob(data).then(function(){
                            getDependancyData(parentJob).then(function(){
                                formNodes(dependancyData.dependancy);
                            });
                        });
                    }else if(data.downstreamProjects.length >= 1){
                        getDependancyData(data).then(function(){
                            formNodes(dependancyData.dependancy);
                        });
                    }else{
                            dependancyGraph.nodes.push({
                                        id: "n1",
                                        label: data.name,
                                        x: 0,
                                        y: 0,
                                        size: 10,
                                        color: data.color
                                      }
                                    );
                            var s = new sigma({
                                      graph: dependancyGraph,
                                      container: "container"
                                    });
                    }
                }).
                error(function() {
                    // console.log("GET for url : "+ url + " didnot work with status : " + status);
                });
    };
}]);
