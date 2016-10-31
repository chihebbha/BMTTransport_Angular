var services = angular.module('transport.services', []);


/*services.factory('Entry', function ($resource){
    
     return function(apiKey){
        return $resource('http://localhost:18080/pitwin-web/rest/subscrips/getSubscByidCustomer/:id', {id:'@id'}, {
          query: { method: 'GET', headers: {'Authorization': apiKey} }
        });
      }
});*/



services.factory('addCustomerforFacebook', function ($resource){
   return $resource('http://localhost:18080/pitwin-web/rest/subscrips/getIdUserByMail'); 
});


services.factory('authentificationFactory', ['$http', function ($http){
    
    var dataFactory = {};
    
    dataFactory.login = function (username, password){
        return $http.get('http://localhost:18080/pitwin-web/rest/autentification/connect/'+password+'/'+username);
    };
    
    return dataFactory;
    
}]);

services.factory('getSubscriptionFactory', ['$http', function ($http){
    
    var dataFactory = {};
    
    dataFactory.getSubscription = function (id){
        return $http.get('http://localhost:18080/pitwin-web/rest/subscrips/getSubscByidCustomer/'+id);
    };
    
    return dataFactory;

}]);

services.factory('sendMailFactory' , function ($resource){
    
    return $resource('http://localhost:18080/pitwin-web/rest/subscriptions/mail/bmt.transportpublic@gmail.com/azerty100/BMTRANSPORT/Your subscription has been successfully created./:param/null')
    
});

services.factory('newSubscriptionFactory', function ($http){
   
    var dataFactory = {};
    dataFactory.addSubscription = function (subscription){
        return $http.post('http://localhost:18080/pitwin-web/rest/subscrips/ajoutSub', subscription);
    }
    return dataFactory;
});

/********************/


//------------work chiheb -----///

services.filter('currentdate', ['$filter', function ($filter) {
    return function () {
        return $filter('date')(new Date(), 'EEEE  dd/MM/yyyy ');
    };
}])


    .factory('Entry', function ($resource) {
        return $resource('http://localhost:18080/pitwin-web/rest/reservation/:id'); // Note the full endpoint address
    })

.factory('Entry1', function ($resource) {
    return $resource('http://localhost:18080/pitwin-web/rest/transport/customer/:id'); // Note the full endpoint address
})

.factory('Entry2', function ($resource) {
    return $resource('http://localhost:18080/pitwin-web/rest/transport/itineraire/:id'); // Note the full endpoint address
})


.factory('sendMailChiheb' , function ($http){
   var dataFactory = {};    
    
    dataFactory.sendMail = function (mail,objet,date,arret,prix,moyenDeTransp){
        return $http.get('http://localhost:18080/pitwin-web/rest/subscriptions/mail/bmt.transportpublic@gmail.com/azerty100/Réservation pour '+objet+'/Le '+date+' vous avez reserver '+moyenDeTransp+' pour l itiniraire de '+arret+' et le prix de cette réservation est : '+prix+' /'+mail+'/null');
    };
    return dataFactory;
});




//------------END-work chiheb -----///




//------------work cyrine -----///

services.factory('inscriptionFactory', function ($resource) {
        return $resource('http://localhost:18080/pitwin-web/rest/CustomerService/add/:id'); // Note the full endpoint address
    });






// services
services.factory('ContactService', [function () {
  var factory = {};

  factory.getContacts = function () {
    return contactList;
  }

  // contact list, usually would be a separate database
  var contactList = [
    {id: 0, name: 'Arbi Taxi ', email: 'ned@winterfell.com', phone: '74 258 569', url: 'SFAX', notes: 'Winter is coming.'},
    {id: 1, name: 'Taxi Driver', email: 'tgreyjoy@winterfell.com', phone: '71 234 789', url: 'TUNIS', notes: 'Reluctant to pay price.'},
    {id: 2, name: 'Taxios Taxi', email: 'starly@castleblack.com', phone: '74 258 569', url: 'SFAX', notes: 'Loyal brother of the watch.'},
    {id: 3, name: 'jlidi Taxi', email: 'jsnow@castleblack.com', phone: '73 123 123', url: 'djerba', notes: 'Knows nothing.'},
    {id: 4, name: 'Taxios Stark', email: 'waterdancer@winterfell.com', phone: '74 123 567', url: 'nabeul', notes: 'Has a  names.'},
    {id: 5, name: 'Jora TAXI', email: 'khaleesifan100@gmail.com', phone: '21 567 789', url: 'TUNIS', notes: 'Lost in the friend-zone.'},
    {id: 6, name: 'Tyrion Taxi', email: 'tyrion@lannister.com', phone: '34 678 789', url: 'sousse', notes: 'Currently drunk.'},
    {id: 7, name: 'Taxi Sicosico', email: 'onetrueking@dragonstone.com', phone: '21 456 789', url: 'Gafsa', notes: 'Nobody.'},
    {id: 8, name: 'Hodor Taxi', email: 'hodor@hodor.com', phone: '45 678 890', url: 'djerba', notes: 'Hodor? Hodor... Hodor!'},
    {id: 9, name: 'Taxi Tyrell', email: 'mtyrell@highgarden.com', phone: '23 567 890', url: 'Tunis ', notes: 'Keeper of kings.'},
    {id: 10, name: 'Cyrine of Taxi', email: 'oathkeeper@gmail.com', phone: '34 678 098', url: 'mestir', notes: 'Do cross her.'},
    {id: 11, name: 'Taxi Ballouchi', email: 'petyr@baelishindustries.com', phone: '23 456 708', url: 'eljam ', notes: 'Do not trust anyone.'},
  ];
  
  return factory;
}]);


//------------END-work cyrine -----///




//------------work raja -----///
services.factory('Entry3', function ($resource) {
    return $resource('http://localhost:18080/pitwin-web/rest/reclamations/:id'); // Note the full endpoint address


 })

 .factory('AddReclamations', function ($resource) {
        return $resource('http://localhost:18080/pitwin-web/rest/reclamations/ajoutRc'); // Note the full endpoint address

})

.factory('Entry6', function($resource)
         { return $resource('http://localhost:18080/pitwin-web/rest/plannings/:id');
         
         
         })




;
//------------END-work raja -----///



 //------------work khalil --------//


services.factory('BusFactory', function ($resource) {
    return $resource('http://localhost:18080/pitwin-web/rest/vehicles/Bus'); // Note the full endpoint address
});

services.factory('TrainFactory', function ($resource) {
    return $resource('http://localhost:18080/pitwin-web/rest/vehicles/Train'); // Note the full endpoint address
});

services.factory('MetroFactory', function ($resource) {
    return $resource('http://localhost:18080/pitwin-web/rest/vehicles/Metro'); // Note the full endpoint address
});
//------------end work khalil -------------//





/**********************/


