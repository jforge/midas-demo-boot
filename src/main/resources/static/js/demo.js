/*
 * Copyright 2015 picturesafe media/data/bank GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

angular.module('demo', ['ui.bootstrap']).controller('demoController', function($scope, $http) {
    $scope.textarea_empty = true;
    $scope.textToAnalyse = articleText;
    $scope.analysedText = '';

    $scope.categories = [];
    $scope.locations = [];
    $scope.keywords = [];

    $scope.showCategories = false;
    $scope.showLocations = false;
    $scope.showKeywords = false;

    $scope.$watch('textToAnalyse', function() {
        $scope.textarea_empty = !($scope.textToAnalyse && $scope.textToAnalyse.length);
    });

    $scope.$watch('analysedText', function() {
        for (var i = 0; i < $scope.categories.length; i++) {
            if ($scope.categories[i].checked && !S($scope.analysedText).include('#' + $scope.categories[i].name)) {
                $scope.categories[i].checked = false;
            } else if (!$scope.categories[i].checked && S($scope.analysedText).include('#' + $scope.categories[i].name)) {
                $scope.categories[i].checked = true;
            }
        }

        for (var i = 0; i < $scope.locations.length; i++) {
            if ($scope.locations[i].checked && !S($scope.analysedText).include('#' + $scope.locations[i].name)) {
                $scope.locations[i].checked = false;
            } else if (!$scope.locations[i].checked && S($scope.analysedText).include('#' + $scope.locations[i].name)) {
                $scope.locations[i].checked = true;
            }
        }

        for (var i = 0; i < $scope.keywords.length; i++) {
            if ($scope.keywords[i].checked && !S($scope.analysedText).include('#' + $scope.keywords[i].name)) {
                $scope.keywords[i].checked = false;
            } else if (!$scope.keywords[i].checked && S($scope.analysedText).include('#' + $scope.keywords[i].name)) {
                $scope.keywords[i].checked = true;
            }
        }
    });

    $scope.startAnalyse = function() {
        $http.post('/analyse', {text: $scope.textToAnalyse}).success(function(data) {
            $scope.categories = [];
            if (data.categories && data.categories.length > 0) {
                for (var i = 0; i < data.categories.length; i++) {
                    $scope.categories.push({name: data.categories[i], checked: false});
                }
            }
            $scope.showCategories = $scope.categories.length > 0;

            $scope.locations = [];
            if (data.locations && data.locations.length > 0) {
                for (var i = 0; i < data.locations.length; i++) {
                    $scope.locations.push({name: data.locations[i], checked: false});
                }
            }
            $scope.showLocations = $scope.locations.length > 0;

            $scope.keywords = [];
            if (data.keywords && data.keywords.length > 0) {
                for (var i = 0; i < data.keywords.length; i++) {
                    $scope.keywords.push({name: data.keywords[i], checked: false});
                }
            }
            $scope.showKeywords = $scope.keywords.length > 0;

            for (var i = 0; i < $scope.categories.length; i++) {
                var tagCandidate = ' ' + $scope.categories[i].name;
                var tagReplacement = ' #' + $scope.categories[i].name;
                data.text = S(data.text).replaceAll(tagCandidate, tagReplacement);
                if (S(data.text).include(tagCandidate) || S(data.text).include(tagReplacement)) {
                    $scope.categories[i].checked = true;
                }
            }

            for (var i = 0; i < $scope.locations.length; i++) {
                var tagCandidate = ' ' + $scope.locations[i].name;
                var tagReplacement = ' #' + $scope.locations[i].name;
                data.text = S(data.text).replaceAll(tagCandidate, tagReplacement);
                if (S(data.text).include(tagCandidate) || S(data.text).include(tagReplacement)) {
                    $scope.locations[i].checked = true;
                }
            }

            for (var i = 0; i < $scope.keywords.length; i++) {
                var tagCandidate = ' ' + $scope.keywords[i].name;
                var tagReplacement = ' #' + $scope.keywords[i].name;
                data.text = S(data.text).replaceAll(tagCandidate, tagReplacement);
                if (S(data.text).include(tagCandidate) || S(data.text).include(tagReplacement)) {
                    $scope.keywords[i].checked = true;
                }
            }

            $scope.analysedText = S(data.text).ensureRight('\n\n');

            $('#collapseOne').collapse('hide');
            $('#collapseTwo').collapse('show');
        });
    };

    $scope.$watch('categories|filter:{checked:true}', function(nv) {
        var selections = nv.map(function(category) {
            return category.name;
        });
        tagify(selections, $scope.categories);
    }, true);

    $scope.$watch('locations|filter:{checked:true}', function(nv) {
        var selections = nv.map(function(location) {
            return location.name;
        });
        tagify(selections, $scope.locations);
    }, true);

    $scope.$watch('keywords|filter:{checked:true}', function(nv) {
        var selections = nv.map(function(keyword) {
            return keyword.name;
        });
        tagify(selections, $scope.keywords);
    }, true);

    var tagify = function(selections, tags) {
        for (var i = 0; i < tags.length; i++) {
            var index = selections.indexOf(tags[i].name);

            $scope.analysedText = S($scope.analysedText).replaceAll('#' + tags[i].name, tags[i].name);

            if (index > -1 && tags[i].checked) {
                $scope.analysedText = S($scope.analysedText).replaceAll(tags[i].name, '#' + tags[i].name);
            }
        }
    };
});