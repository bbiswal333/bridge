angular.module("app.cats").service('app.cats.configService', function(){
	this.loaded = false;
	this.catsItems = [];
	this.favoriteItems = [];
});