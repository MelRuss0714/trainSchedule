$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCW1Hm9PqlWHZbberOlcisWV0BpV2zuf74",
        authDomain: "train-schedule-7d0b1.firebaseapp.com",
        databaseURL: "https://train-schedule-7d0b1.firebaseio.com",
        projectId: "train-schedule-7d0b1",
        storageBucket: "train-schedule-7d0b1.appspot.com",
        messagingSenderId: "497035447934"
    };
    firebase.initializeApp(config);
    // Create a variable to reference the database
    var database = firebase.database();

    //Intial Values
    

    //On click event trigger when submit button is pushed that generates rows
    $("#submit").on("click", function (event) {
        
         // Don't refresh the page!
        event.preventDefault();
        //create row
        // YOUR TASK!!!
        // Code in the logic for storing and retrieving the most recent user.
        // Don't forget to provide initial data to your Firebase database.
        var name = $("#trainInput").val().trim();
        var destination = $("#destinationInput").val().trim();
        var inputTime = $("#timeInput").val().trim();
        console.log("input" + inputTime);
        var frequency = $("#frequencyInput").val().trim();
        var newtrain = {
            name: name,
            destination: destination,
            inputTime: inputTime,
            frequency: frequency,
        };
        database.ref().push(newtrain);

    });

    // Firebase watcher + initial loader HINT: .on("value")
    database.ref().on("child_added", function (childSnapshot) {
        var frequency = childSnapshot.val().frequency;
        var startTime = moment.unix(childSnapshot.val().inputTime).format("hh:mm a");
        console.log("startTime" + startTime);
        // First Time (pushed back 1 year to make sure it comes before current time)
        var startTimeConverted = moment(startTime, "hh:mm a").subtract(1, "years");
        console.log(startTimeConverted);
    
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
        // Difference between the times
        var diffTime = moment().diff(moment(startTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
    
        // Time apart (remainder)
        var tRemainder = diffTime % (childSnapshot.val().frequency);
        console.log(tRemainder);
    
        // Minute Until Train
        var tMinutesTillTrain = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Log everything that's coming out of snapshot
        console.log(childSnapshot.val().name);
        console.log(childSnapshot.val().destination);
        console.log(childSnapshot.val().startTime);
        console.log(childSnapshot.val().frequency);


        // full list of items to the well

        $("#tbody").append("<tr><th scope='row'>" + childSnapshot.val().name +
            " </th><td> " + childSnapshot.val().destination +
            " </td><td> " + childSnapshot.val().frequency +
            " </td><td> " + moment(nextTrain).format("hh:mm a") +
            " </td><td> " + tMinutesTillTrain + " </td></tr>");

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);

        // Handle the errors
    })

    // Time is 3:30 AM
    

})