'use strict';

window.app.controller('expressCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.item = {};
	$scope.updating = false;

	function successHandler(data) {
		$scope.items = data;
		console.log(data);
	}
	function errorHandler(data) {
		console.log('Error: ' + data);
	}
	
	$http.get('/items')
		.success(successHandler)
		.error(errorHandler);

	$scope.add = function () {
		$http.post('/items', $scope.item)
		.success(function (data) {
			$scope.item = {};
			$scope.items = data;
		})
		.error(errorHandler);
	};
	$scope.check = function (i) {
		var url = '/items/delete/' + i._id;
		console.log(url);
		$http.delete(url)
			.success(successHandler)
			.error(errorHandler);
	};
	$scope.edit = function () {
		var url = '/items/' + $scope.upateId;
		$http.put(url, $scope.item)
		.success(function (data) {
			$scope.item = {};
			$scope.items = data;
			$scope.updating = false;
		})
		.error(errorHandler);
	}

	
	$scope.update = function (data, i) {
		$scope.item.text = data;
		$scope.upateId = i;
		$scope.updating = true;
	};
	$scope.cancel = function () {
		$scope.item = {};
		$scope.updating = false;
	}
}]);