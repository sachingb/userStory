angular.module('authService', [])
                  //call back function with a http handler and a promise object
.factory('Auth', function($http, $q, AuthToken){

   var authFactory = {};

   authFactory.login = function(username, password){
      return $http.post('/api/login', {
         username: username,
         password: password
      })
      .success(function(data){
         AuthToken.setToken(data.token);
         return data;
      })
   }


   authFactory.logout = function(){
      AuthToken.setToken();
   }

   authFactory.isLoggedIn = function(){
      if(AuthToken.getToken())
         return true;

      return false;
   }


   authFactory.getUser = function(){
      if(AuthToken.getToken())
         return $http.get('/api/me');

      return $q.reject({message: "User has no token"});
   }

   return authFactory;
})



.factory('AuthToken', function($window){

   var authTokenFactory = {};

   authTokenFactory.getToken = function(){
      return $window.localStorage.getItem('token');
   }

   authTokenFactory.setToken = function(token){
      if(token){
         $window.localStorage.setItem('token', token);
      }else{
         $window.localStorage.removeItem('token');
      }
   }

   return authTokenFactory;
})


.factory('AuthInterceptor', function($q, $location, AuthToken){
   var interceptorFactory = {};

   interceptorFactory.request = function(config){
      var token = AuthToken.getToken();

      if(token){
         config.headers['x-access-token'] = token;
      }

      return config
   };

   interceptorFactory.responseError = function(response){
      if(response.status == 403){ //if forbidden take him back to the login page
         $location.path('/login')
      }
      return $q.reject(response);
   }

   return interceptorFactory;
});
