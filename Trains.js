


    // Initialize Firebase
    var config = {
    apiKey: "AIzaSyDXrRItvl6dw1moEtQf4agfuGYzbBWF99E",
    authDomain: "trainscheduler-7a22b.firebaseapp.com",
    databaseURL: "https://trainscheduler-7a22b.firebaseio.com",
    projectId: "trainscheduler-7a22b",
    storageBucket: "",
    messagingSenderId: "64700213973"
  };
  firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // Initial Values
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";
    var tMinutesTillTrain = "";
    var nextTrain = "";


    // Capture Button Click
    $("#add-train").on("click", function(event) {
      event.preventDefault();
      
      // Grabbed values from text-boxes
      trainName = $("#train-name-input").val().trim();
      destination = $("#destination-input").val().trim();
      trainTime = $("#train-time-input").val().trim();
      frequency = $("#frequency-input").val().trim();

      

      if (moment.unix(trainTime).format()== "hh:mm a"){
        console.log("time format is incorrect.")
      }

      console.log(moment.unix(trainTime).format('hh:mm a'));

      // Code for "Setting values in the database"
      database.ref().push({
        trainName: trainName,
        destination: destination,
        trainTime: trainTime,
        frequency: frequency
      });

      //clear inputs afterwards
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#train-time-input").val("");
      $("#frequency-input").val("");

    });
    
    
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

        // Store everything into a variable.
        var ctrainName = childSnapshot.val().trainName;
        var cdestination = childSnapshot.val().destination;
        var ctrainTime = childSnapshot.val().trainTime;
        var cfrequency = childSnapshot.val().frequency;

  

       processTime(ctrainTime, cfrequency);
      

      ctrainTime = moment.unix(ctrainTime).format("hh:mm a");

        $("#train-table > tbody").append("<tr><td>" + ctrainName + "</td><td>" + cdestination + "</td><td>" +
        cfrequency + "</td><td>" + moment(nextTrain).format("LT")  + "</td><td>" + tMinutesTillTrain + "</td></tr>");

      // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    
function processTime(firstTime, frequency){
  
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);

  // Minute Until Train
   tMinutesTillTrain = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
   nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

};
