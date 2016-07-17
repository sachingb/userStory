angular.module('MyApp', [ 'mainCtrl','userCtrl', 'storyCtrl','userService', 'authService','storyService', 'appRoutes', 'ngResource', 'reverseDirective'])

.config(function($httpProvider){
   $httpProvider.interceptors.push('AuthInterceptor');
})
