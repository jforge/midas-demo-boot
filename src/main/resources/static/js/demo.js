angular.module('demo', ['ui.bootstrap']).controller('demoController', function($scope, $http) {
    $scope.textarea_empty = true;
    $scope.textToAnalyse = 'Die Emotionen, die am späten Abend des 12. Juni vergangenen Jahres in der Familie Y. hochkochten, dürften für viele nachvollziehbar sein. Da sitzt die eigene Tochter, die eigene Schwester weinend auf einem Polizeirevier in Müllheim im Markgräflerland, im äußersten Südwesten Deutschlands. Das Auge blutunterlaufen, der Rücken voller Hämatome, die Arme mit Kratzern übersät.';
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

            for (var i = 0; i < $scope.locations.length; i++) {
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