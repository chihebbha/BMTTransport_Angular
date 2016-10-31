var controllers = angular.module('transport.controllers', []);


controllers.controller('verifCtrl', function ($scope, $cookies){
    
    $scope.login = false;
    $scope.logout = true;
    
    $scope.usermail = $cookies.get('mail');
    
    $scope.usernomprenom = $cookies.get('nom')+" "+$cookies.get('prenom');
    
        if($cookies.get('mail') == undefined){
            //alert($cookies.get('mail'));
            $scope.login = true;
            $scope.logout = false;
        }
    
});

controllers.controller('authentificationCtrl', function ($scope, authentificationFactory, $location, $cookieStore, $cookies){
    
    $cookies.remove('id');
    $cookies.remove('mail');
    $cookies.remove('nom');
    $cookies.remove('prenom');
    
    $scope.authentification = function (username, password){
        
        authentificationFactory.login(username, password).success(function (data){
            
            if(data != null){
                alert("Welcome "+data.prenom_Person)
                $location.path('/');
                
                $cookies.put('id', data.id_Person);
                $cookies.put('mail', data.email_Person);
                $cookies.put('nom', data.nom_Person);
                $cookies.put('prenom', data.prenom_Person);
                console.log($cookies.get('mail')+" / "+$cookies.get('id'));
               
            }
            
            
            
        });
    }
});

controllers.controller('getSubscriptionCtrl', function ($scope, getSubscriptionFactory, $location, $cookies, newSubscriptionFactory, sendMailFactory){
    

    $scope.user = $cookies.get('prenom')+" "+$cookies.get('nom');
    
    //$scope.usermail = $cookies.get('mail');
    
   $scope.getSubscriptions = function (){
        
        getSubscriptionFactory.getSubscription($cookies.get('id')).success(function (data){

            
            
            if(data.numCarte_Subscripton == null){
                alert("You have no subscription\nPlease click on subscribe now to subscribe");
            }
            else{
                console.log(data);
                $scope.datasub = data;
                
                var myDate = new Date(data.date_Subscripton);
                var y = myDate.getFullYear()+1;
                var d = myDate.getDate();
                var m = myDate.getDay();
               
            
                $scope.datesub = m+"/"+d+"/"+y;
            }
        });   
    } 
   
   /***************************/
       $scope.verifBeforeAddsubscription = function (){
        
        getSubscriptionFactory.getSubscription($cookies.get('id')).success(function (data){
           
            if(data.numCarte_Subscripton == null){
                
                /* SEND MAIL */
                
                sendMailFactory.get({param: $cookies.get('mail')});
                alert("Your subscription has been successfully created, for more details consult your mailbox");
                
                /*sendMailFactory.sendMail($cookies.get('mail')).success(function (){
                        alert("Mail envoyé");
                });*/
                
                /* ADD SUBSCRIPTION */
                $scope.subscriptionNew = {};

                
                    var subscription = $scope.subscriptionNew;

                  var text = "";
                  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                  for( var i=0; i < 15; i++ )
                    text += possible.charAt(Math.floor(Math.random() * possible.length));

                    subscription.date_Subscripton = new Date();
                    subscription.numCarte_Subscripton = text;

                    person = { id_Person : $cookies.get('id') };
                    subscription.customer = person;

                    newSubscriptionFactory.addSubscription(subscription).success(function(data) {
                      $scope.subscriptionNew = {};
                    });
                
                /*******************/
                
            }
            else {
            
                //alert("You are already registered at :"+data.date_Subscripton);
                $scope.alert = data;
                $scope.message= "You are already registered at :";
                
            }
            
        });
        
    }
   /***************************/
    
});






controllers.controller('FacebookController', function($scope, $timeout, Facebook, $location, $cookies, addCustomerforFacebook) {
      
    
    /****************** Facebook Auth ************/
    
      // Define user empty data :/
      $scope.user = {};
      
      // Defining user logged status
      $scope.logged = false;
      
      // And some fancy flags to display messages upon user status change
      $scope.byebye = false;
      $scope.salutation = false;
      
      /**
       * Watch for Facebook to be ready.
       * There's also the event that could be used
       */
      $scope.$watch(
        function() {
          return Facebook.isReady();
        },
        function(newVal) {
          if (newVal)
            $scope.facebookReady = true;
        }
      );
      
      var userIsConnected = false;
      
      Facebook.getLoginStatus(function(response) {
        if (response.status == 'connected') {
          userIsConnected = true;
        }
      });
      
      /**
       * IntentLogin
       */
      $scope.IntentLogin = function() {
        if(!userIsConnected) {
          $scope.login();
        }
      };
      
      /**
       * Login
       */
       $scope.login = function() {
         Facebook.login(function(response) {
          if (response.status == 'connected') {
            $scope.logged = true;
            $scope.me();
          }
        
        });
       };
       
       /**
        * me 
        */
        $scope.me = function() {
          Facebook.api('/me', function(response) {
            /**
             * Using $scope.$apply since this happens outside angular framework.
             */
            $scope.$apply(function() {
              $scope.user = response;
                
                alert("welcome "+response.first_name);
                
                $location.path('/');
                
                //$cookies.put('id', response.id);
                $cookies.put('mail', response.email);
                $cookies.put('nom', response.last_name);
                $cookies.put('prenom', response.first_name);
                
                var CustomerResource = addCustomerforFacebook;
                
                var Customer = new CustomerResource;
                
                Customer.email_Person = $cookies.get('mail');
                Customer.nom_Person = $cookies.get('nom');
                Customer.prenom_Person = $cookies.get('prenom');
           
                
                Customer.$save(function (response){
                    $cookies.put('id', response[0]);
                    console.log(response[0]);
                }); 
                
                
                
                
                
                
            });
            
          });
        };
      
      /**
       * Logout
       */
      $scope.logout = function() {
        Facebook.logout(function() {
          $scope.$apply(function() {
            $scope.user   = {};
            $scope.logged = false;  
          });
        });
      }
      
      /**
       * Taking approach of Events :D
       */
      $scope.$on('Facebook:statusChange', function(ev, data) {
        console.log('Status: ', data);
          
        if (data.status == 'connected') {
          $scope.$apply(function() {
            $scope.salutation = true;
            $scope.byebye     = false;    
          });
        } else {
          $scope.$apply(function() {
            $scope.salutation = false;
            $scope.byebye     = true;
            
            // Dismiss byebye message after two seconds
            $timeout(function() {
              $scope.byebye = false;
            }, 2000)
          });
        }
        
        
      });
      
      
    }
  )
  
  /**
   * Just for debugging purposes.
   * Shows objects in a pretty way
   */
  .directive('debug', function() {
		return {
			restrict:	'E',
			scope: {
				expression: '=val'
			},
			template:	'<pre>{{debug(expression)}}</pre>',
			link:	function(scope) {
				// pretty-prints
				scope.debug = function(exp) {
					return angular.toJson(exp, true);
				};
			}
		}
	})
  
  ;




/****************************************/

//-----work chiheb-------////
controllers.controller('ReservationController', function ($scope, Entry, Entry1, Entry2, $http, $location, $cookies, sendMailChiheb) {


	$scope.itineraires = Entry2.query();
	$scope.cuss = Entry1.query();
	$scope.reservations = Entry.query();
	$scope.open = function () {
			window.open("../pdf.pdf", '_system', 'location=yes');
		}
		//________________________________________

	$scope.supprimer = function (id_Reservation, index) {

		Entry.delete({
			id: id_Reservation
		}, function () {
			$scope.reservations.splice(index, 1);
		});

	};

	$scope.ajouter = function (prix, itinerary_id, arret, moyenDeTransp) {
		$scope.entry= new Entry();

		$scope.entry.date_Reservation = new Date();
		$scope.entry.prix_Reservation = Math.round(prix * 100) / 100;
		$scope.entry.customer = {
			"id_Person": $cookies.get('id')
		};
		$scope.entry.itinerary = {
			"id_Itinerary": itinerary_id,
			"arret_Itinerary": arret
		};

		Entry.save($scope.entry, function () {
			sendMailChiheb.sendMail($cookies.get('mail'), 'bus', $scope.entry.date_Reservation, $scope.entry.itinerary.arret_Itinerary, $scope.entry.prix_Reservation, moyenDeTransp);
			$location.path('/reservations');

		}); //saves an entry. Assumi 

	};





})




.controller("localise", function ($scope) {




	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {

			var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			var geocoder = geocoder = new google.maps.Geocoder();
			geocoder.geocode({
				'latLng': latlng
			}, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						//	callback(results[1].formatted_address);
						//initialize(results[1].formatted_address)
						alert("Vous êtes à " + results[0].formatted_address.substring(0, results[0].formatted_address.indexOf(",")) + " , " + results[1].formatted_address);




					}

				}
			});


		});

	}




});

controllers.controller('deviseCtrl', function($scope, $timeout,$resource,$rootScope,$location) {
    
    var BourseResource=$resource('http://bassemchagra.com/bourse.php');
	 
    $scope.bourses=BourseResource.query();});

//-----END work chiheb-------////




//----- $$$$$$$$$$$$$$$$$$$$$   work cyrine $$$$$$$$$$$$$$$-------////

//-----    weather-------////

  
	controllers.controller('weatherController', function($scope, $http){

    $scope.location = '';
    
    $scope.initial = function(){
      navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        $http.jsonp("http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&APPID=a8f5261ee6863849df5a45497bb27163&callback=JSON_CALLBACK").
        success(function(data){
          $scope.weatherData = data;
          console.log(data);
          $('.loading').hide();
        }).
        error(function(){
          $('.loading').hide();
          $('.error').show().html("Sorry there has been an error connecting to the API");
        });

      }); 
    };

    $scope.initial();  

    $scope.refresh = function(){
      $('.loading').show();
      if($scope.location != ''){ 
        $http.jsonp("http://api.openweathermap.org/data/2.5/weather?q="+$scope.location+"&APPID=a8f5261ee6863849df5a45497bb27163&callback=JSON_CALLBACK").
        	success(function(data){
            $scope.weatherData = data;
            console.log(data);
            $('.loading').hide();
        	}).
          error(function(){
            $('.loading').hide();
            $('.error').show().html("Sorry there has been an error connecting to the API");
          });
      } else {
        $scope.initial();
      }
    };
    
	});//End Controller
  


//-----   end weather-------////


//-----    inscription-------////




controllers.controller('inscriptionCtrl', function($scope,inscriptionFactory,$location,$cookies, $location) {
    
             
	 $scope.inscription=function(nom_Person,prenom_Person,email_Person,dateNaissance_Person,login_Person,password_Person,cin_Person,adresse_Person){
     $scope.entry=new inscriptionFactory();
  
     $scope.entry.nom_Person= nom_Person;
     $scope.entry.prenom_Person=prenom_Person;
     $scope.entry.email_Person=email_Person;
     $scope.entry.dateNaissance_Person=dateNaissance_Person;
     $scope.entry.login_Person=login_Person;
     $scope.entry.password_Person=password_Person;         
     $scope.entry.cin_Person=cin_Person;
     $scope.entry.adresse_Person=adresse_Person;
     
         

inscriptionFactory.save($scope.entry, function() {
	
    
	
  }); //saves an entry. Assumi 
   
  };
});
//-----   end  inscription-------////

//-----    Aloooo Taxi-------////



// controllers


controllers.controller('navCtrl', function ($scope) {
  $scope.nav = {
    navItems: ['call me '],
    selectedIndex: 0,
    navClick: function ($index) {
      $scope.nav.selectedIndex = $index;
    }
  };
})

controllers.controller('homeCtrl', function ($scope, ContactService){
  $scope.contacts = ContactService.getContacts();

  

})

controllers.controller('contactInfoCtrl', function ($scope, $routeParams, ContactService){
  var index = $routeParams.contact_index;
  $scope.currentContact = $scope.contacts[index];
})



// directives
.directive('contact', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'contact.html'
  }
})




//-----  End Aloooo Taxi  -------////

//-----  Recommendation  -------////


controllers.controller('taskController', function($scope) {
    $scope.today = new Date();
    $scope.saved = localStorage.getItem('taskItems');
    $scope.taskItem = (localStorage.getItem('taskItems')!==null) ? 
    JSON.parse($scope.saved) : [ {description: "Why not add a task?", date: $scope.today, complete: false}];
    localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    
    $scope.newTask = null;
    $scope.newTaskDate = null;
    $scope.categories = [
        {name: 'Bus'},
        {name: 'train'},
        {name: 'Traim'},
        {name: 'Other'}
    ];
    $scope.newTaskCategory = $scope.categories;
    $scope.addNew = function () {
        if ($scope.newTaskDate == null || $scope.newTaskDate == '') {
            $scope.taskItem.push({
                description: $scope.newTask,
                date: "No deadline",
                complete: false,
                category: $scope.newTaskCategory.name
            }) 
        } else {
            $scope.taskItem.push({
                description: $scope.newTask,
                date: $scope.newTaskDate,
                complete: false,
                category: $scope.newTaskCategory.name
            })
        };
        $scope.newTask = '';
        $scope.newTaskDate = '';
        $scope.newTaskCategory = $scope.categories;
        localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    };
    $scope.deleteTask = function () {
        var completedTask = $scope.taskItem;
        $scope.taskItem = [];
        angular.forEach(completedTask, function (taskItem) {
            if (!taskItem.complete) {
                $scope.taskItem.push(taskItem);
            }
        });
        localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    };
    
    $scope.save = function () {
        localStorage.setItem('taskItems', JSON.stringify($scope.taskItem));
    }
});

//-----  End Recommendation  -------////

//-----  Calculator  -------////
controllers.controller('CalculatorCtr', ['$scope', Calculator]);

function Calculator($scope) {
  $scope.console = 0;
  
  var _total = 0;
  var _state = null;
  
  function _resolveState(){
    switch(_state) {
      case 'ADD':
        _total +=  parseFloat($scope.console);
        $scope.console = 0;
        break;
      case 'SUB':
        _total -=  parseFloat($scope.console);
        $scope.console = 0;
        break;
      case 'MULT':
        _total *=  parseFloat($scope.console);
        $scope.console = 0;
        break;
      case 'DIV':
        _total /=  parseFloat($scope.console);
        $scope.console = 0;
        break;

      default:
         _total = parseFloat($scope.console);
        $scope.console = 0;
         break;
        
    }
  }  
  $scope.add = function() {
 		_resolveState();
    _state = 'ADD';
  }
  
  $scope.subtract = function() {
 		_resolveState();
    _state = 'SUB';
  }
  
  $scope.multiply = function() {
 		_resolveState();
    _state = 'MULT';
  }
  
  $scope.divide = function() {
 		_resolveState();
    _state = 'DIV';
  }
  
  $scope.equal = function() {
 		_resolveState();
    $scope.console = _total;
    _state = 'EQ';
  }
  
  $scope.print = function(n) {
    if($scope.console.toString() == "0" || _state == 'EQ'){
      $scope.console = "";
    }
    if( _state == 'EQ'){
      _state = null;
    }
    $scope.console = $scope.console + n;
  }
  
  $scope.changePositivity = function() {
    $scope.console = (parseFloat($scope.console) * -1).toString();
  }
  
  $scope.getPercentage = function() {
    $scope.console = (parseFloat($scope.console) * .01).toString();
  }
  
  $scope.clearTotal = function() {
    $scope.console = 0;   
    _total = 0;
    _state = null;
  }
  
}

//-----  End Calculator  -------////
//----- $$$$$$$$$$$$$$$$$$$$$  end work cyrine $$$$$$$$$$$$$$$-------////






//----- work raja-------////

controllers.controller('ReclamationCtrl', function($scope,Entry3,$cookies) {
    
         
       $scope.utilisateur=$cookies.get('prenom');
         $scope.reclamations=Entry3.query();
         
         
     $scope.supprimer = function(id_Reclamation,index) {   
     Entry3.delete({ id: id_Reclamation }, function() {
      $scope.reclamation.splice(index,1); 
  });
       
                          
  }; 
         })




.controller('ReclamationController', function ($scope,AddReclamations,$cookies){
    
    
    $scope.ajouter=function(sujet,message){
       
     reclamation=new AddReclamations();
  
    reclamation.dateRec_Reclamation=new Date();
    reclamation.sujet_Reclamation=sujet;
    reclamation.message_Reclamation=message;
    
     reclamation.customer = {
			"id_Person": $cookies.get('id')
		};
     
    reclamation.$save();
    console.log("okkkk");
  }; 
   
  }
    
    
  
    
    
    
    
    
    
    
    
)
   
    
    
;


//----- work raja Planning-------////




controllers.controller('PlanningCtrl', function($scope,Entry6,$cookies) {
    
       
 $scope.utilisateur=$cookies.get('prenom');
         $scope.plannings=Entry6.query();
         
         
    
         
   
    
});

controllers.controller('MainController', function($scope,$http) {
    $scope.options = {
    defaultDate: "2016-01-01",
    minDate: "2015-01-01",
    maxDate: "2017-12-31",
    disabledDates: [
        "2015-06-22",
        "2015-07-27",
        "2015-08-13",
        "2015-08-15"
    ],
    dayNamesLength: 1, // 1 for "M", 2 for "Mo", 3 for "Mon"; 9 will show full day names. Default is 1.
    mondayIsFirstDay: true,//set monday as first day of week. Default is false
    eventClick: function(date) {
      
        
      
        
    },
    dateClick: function(date) {
     
         var url=  $http.get("http://localhost:18080/pitwin-web/rest/plannings/date/"+date.day+"/"+date._month+"/"+date.year).success(function(response)
    {

             console.log(response);
             
             $scope.items = response;
             
        }); 
        
      
        
        
    },
    changeMonth: function(month, year) {
      console.log(month, year);
    },
  };

  $scope.events = [
    {foo: 'bar', date: "2015-08-18"},
    {foo: 'bar', date: "2015-08-20"}
  ];
})





//-----END work raja-------////




//-- ---------------work khalil  --------------//



.controller('VehicleCtrl', function($scope, BusFactory, MetroFactory, TrainFactory  ){
      $scope.dataMetro = MetroFactory.query();
     $scope.dataTrain = TrainFactory.query();
     $scope.databus = BusFactory.query();
    $scope.tableau=[];
    
    ///////////////////////
      databus=$scope.databus;
    var key, count = 0; countt=0; counttt=0;
for(id_Vehicle in databus) {
  if(databus.hasOwnProperty(id_Vehicle)) {
    count++;
  }
}
    console.log(count);
   
    ///////////////////////
    
    
    ////////////////////////
     dataTrain=$scope.dataTrain;
    var key;
for(id_Vehicle in dataTrain) {
  if(dataTrain.hasOwnProperty(id_Vehicle)) {
    countt++;
  }
}
    console.log(countt);
    ///////////////////////
    
    
    
      ////////////////////////
     dataTrain=$scope.dataTrain;
    var key;
for(id_Vehicle in dataTrain) {
  if(dataTrain.hasOwnProperty(id_Vehicle)) {
    counttt++;
  }
}
    console.log(counttt);
    ///////////////////////
    
    
    databus=$scope.databus.length;
    
   // $scope.test =" [BusFactory.query().length, BusFactory.query().length, BusFactory.query().length,BusFactory.query().length]";
    
   
    
    
  
  
 
   
    $scope.tableau.push(count+1);
    $scope.tableau.push(countt+3);
    $scope.tableau.push(counttt+2);
    
})


.directive('chart', ['$http', function($http) {
  return {
    restrict: 'EA',
    scope: {
      data: '=data',
      outerR: '=outerR',
      innerR: '=innerR',
      fontSize: '=fontSize',
      displayNumber: '=displayNumber',
      innerString: '=innerString',
      innerStringFontSize: '=innerStringFontSize',
      url: '=src',
    },
    
    link: function($scope, elements, attrs){
      
      //TODO ALSO A WORK IN PROGRESS
      if ($scope.url) {
        $http.get($scope.url).success(function(response) {
       	 response;
        })
      }
		 if($scope.data){
        var data = $scope.data;    
      } else {
      	var data = [35, 45, 50, 60];
      } 
      
      var color = d3.scale.ordinal().range(["red", "blue", "orange", "green", "yellow", "purple", "violet", "grey", "pink"]); //Color of the data
      
      if($scope.outerR){
        var outerR = $scope.outerR; 
      } else {
        var outerR = 100;
      }
      
      if($scope.innerR){
        var innerR = $scope.innerR;
      } else {
        var innerR = 50;
      }      
      
      if($scope.fontSize){
        var fontSize = $scope.fontSize;
      } else {
        var fontSize = 17 * outerR / 100;
      }
      
      if($scope.innerStringFontSize){
        var innerStringFontSize = $scope.innerStringFontSize;
      } else {
        var innerStringFontSize = innerR / 3;
      }
      
      //Creates the Chart
      var canvas = d3.select("body").append("svg").attr("width", outerR * 2).attr("height", outerR * 2); // Creates the paintable canvas
      var group = canvas.append("g").attr("transform", "translate(" + outerR + "," + outerR + ")"); // Sets the location
      var arc = d3.svg.arc().innerRadius(innerR).outerRadius(outerR); // Creates the donut look
      var pie = d3.layout.pie();
      var arcs = group.selectAll(".arc").data( pie(data) ).enter().append("g").attr("class", "arc");
      arcs.append("path").attr("d", arc).attr("fill", function(d) { return color(d.data); } );
      if($scope.displayNumber != false){
      	arcs.append("text").attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; } ).attr("text-anchor","middle").attr("font-size",fontSize + "px").text(function (d) {return d.data;} );
      }
      //TODO THIS IS A WORK IN PROGRESS TO HAVE TEXT BE IN THE MIDDLE
      var text = canvas.selectAll("text").data($scope.innerString)
      							.enter()
      							.append("text")
      							.attr("font-size", innerStringFontSize + "px")
      							.attr("x", function(d) { return outerR; })
                        .attr("y", function(d) { return outerR + innerStringFontSize / 2; })//TODO outerR - font size
                        .text( function (d) { return $scope.innerString; });    
    }
  };
}]);
   







//----------END Work Khaliiil  ---------- //






/*********************************************/








    
    
