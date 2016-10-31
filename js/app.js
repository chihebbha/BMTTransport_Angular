
angular.module('transport', ['ngRoute', 'transport.controllers', 'transport.services', 'ngCookies', 'facebook', 'ngResource', 'flexcalendar', 'pascalprecht.translate'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'templates/index.html' 
      }).
      when('/subscriptions', {
        templateUrl: 'templates/subscriptions.html',
        controller: 'getSubscriptionCtrl'
      }).
    when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'authentificationCtrl'
      }).
    when('/password_forgot', {
        templateUrl: 'templates/password_forgot.html',
        controller: 'passwordForgotCtrl'
      }).
    
    when('/reservations', {
        templateUrl: 'templates/listReserv.html',
        controller: 'ReservationController'
      }).
	when('/Addreservations', {
        templateUrl: 'templates/addReserv.html',
        controller: 'ReservationController'
      }).
    
        when('/weather', {
        templateUrl: 'templates/weather.html',
        controller: 'weatherController'

      }).
     when('/inscription', {
        templateUrl: 'templates/signup.html',
        controller: 'inscriptionCtrl'
      }).
    
    when('/Taxi', {
        templateUrl: 'templates/Taxi.html',
        controller: 'contactInfoCtrl'
      }).
    when('/Recommendation', {
        templateUrl: 'templates/Racommendation.html',
        controller: 'taskController'
      }).
   
     when('/Calculator', {
        templateUrl: 'templates/Calculator.html',
        controller: 'CalculatorCtr'

      }).
    
    
    when('/reclamations', {
        templateUrl: 'templates/ListReclamation.html',
        controller: 'ReclamationCtrl'
      }).
    when('/AddReclamations', {
        templateUrl: 'templates/AddReclamation.html',
        controller: 'ReclamationController'
      }).
    when('/plannings', {
        templateUrl: 'templates/ListPlanning.html',
        controller: 'PlanningCtrl'
      }).
    
    when('/agenda', {
        templateUrl: 'templates/calender2.html',
        controller: 'MainController'
      }).
    
    
        when('/listBus', {
        templateUrl: 'templates/ListFleet.html',
        controller: 'VehicleCtrl'
        
      }).
	
     when('/stat', {
        templateUrl: 'templates/stat.html',
        controller :'VehicleCtrl'
        
      }).
      when('/contact', {
        templateUrl: 'templates/contact.html'
        
      }).
    
      otherwise({
        redirectTo: '/'
      });
  }])

  .config([
    'FacebookProvider',
    function(FacebookProvider) {
     var myAppId = '1623367964551536';
     
     // You can set appId with setApp method
     // FacebookProvider.setAppId('myAppId');
     
     /**
      * After setting appId you need to initialize the module.
      * You can pass the appId on the init method as a shortcut too.
      */
     FacebookProvider.init(myAppId);
     
    }
  ])

