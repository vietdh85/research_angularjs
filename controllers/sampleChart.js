/**
 * Created by vietdh on 10/14/2015.
 */

angular.module("sampleChart", ["highcharts-ng"])
    .controller("sampleChartCtrl", function($scope, $http){

        // Variable
        $scope.chartTypes = ["line", "bar", "column", "pie"];
        $scope.dataTypes = ["Default", "External"];

        $scope.selectedChartType = $scope.chartTypes[0];
        $scope.selectedDataType = $scope.dataTypes[0];

        $scope.internal = {
            categories : ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
            dauValues : [2002, 2505, 2201, 1908, 3005, 2066, 2205, 3990, 1449, 3089, 2988, 3788]
        };

        $scope.external = {
            categories : [],
            dauValues : []
        };

        $scope.categories = $scope.internal.categories;
        $scope.dauValues = $scope.internal.dauValues;

        // Functions
        $scope.changeType = function(newType){
            $scope.selectedChartType = newType;
            this.chartConfig.options.chart.type = $scope.selectedChartType;

            if(newType == "pie") {
                var data = [];
                for(var i=0; i<$scope.categories.length; i++){
                    data.push({name:$scope.categories[i], y:$scope.dauValues[i]});
                }

                this.chartConfig.series[0].data = data;
            } else {
                this.chartConfig.series[0].data = $scope.dauValues;
            }
        };

        $scope.changeDataType = function(newDataType){
            $scope.selectedDataType = newDataType;

            if($scope.selectedDataType == "Default") {
                $scope.categories = $scope.internal.categories;
                $scope.dauValues = $scope.internal.dauValues;
            } else {
                $scope.categories = $scope.external.categories;
                $scope.dauValues = $scope.external.dauValues;
            }

            this.chartConfig.xAxis.categories = $scope.categories;
            this.chartConfig.series[0].data = $scope.dauValues;

            // Transform data if pie chart
            if($scope.selectedChartType == "pie"){
                $scope.changeType($scope.selectedChartType);
            }
        }

        $scope.getClass = function(chartType){
            return $scope.selectedChartType == chartType ? "selected" : "";
        };

        var initChart = function(){
            return $scope.chartConfig = {
                title: {
                    text: 'REPORT 2014',
                },
                options: {
                    chart: {
                        type: $scope.selectedChartType
                    },
                    exporting: {
                        enabled: false
                    },
                },
                xAxis: {
                    categories: $scope.categories
                },
                yAxis: {
                    title: {
                        text: 'Users'
                    },
                    labels: {
                        formatter: function() {
                            return Highcharts.numberFormat(this.value, 0, ".", ",");
                        }
                    },
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'DAU',
                    data: $scope.dauValues
                }]
            }
        }

        $http.get("/data/sample_chart.json").then(function (response) {
            $scope.summaryData = response.data.q_sample_chart;

            initData()
        }, function () {
            $scope.summaryData = [{action: "Error"}];
        })

        var loadSummary = function() {
            return $scope.loadSummaryContent = function(summary) {
                var commonParams, param, queryCodes;
                $scope.summary = summary;

                queryCodes = ['q_weather'];
                commonParams = {};
                param = $scope.getQueryParam(summary, queryCodes, commonParams, {});
                return resources.summaryReport.calculate(param).$promise.then(function (result) {
                    $log.debug('ES:summary.get => ', result);
                    $scope.summaryData = result[queryCodes[0]];

                    initData();
                })["catch"](function (error) {
                    return $log.error('ERROR: SummaryReport Calculate', error);
                });
            }
        };

        var initData = function(){
            for(var i=0; i< $scope.summaryData.length; i++){
                $scope.external.categories.push($scope.summaryData[i][0]);
                $scope.external.dauValues.push(Number($scope.summaryData[i][1]));
            }
        }

        return (function() {
            //loadSummary();
            return initChart();
        })();
    });