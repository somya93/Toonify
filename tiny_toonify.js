/*

    Introduction to Cloud Computing
    Summer 2021
    Carnegie Mellon University
    
    File: tiny_toonify.js
    
    Program: tiny_toonify
    
    This script get the user's photo location and call the Toonify API
    to convert a human face to a cartoonized face.
    
    By Mike Chiang (MC)
    
    Change History:
    
    VER  DATE        BY  DESCRIPTION
    ===  ====        ==  ===========
    1.0  05/30/2021  MC  Forked from Mike's 2020 project
    1.1  06/02/2021  MC  Updated S3 endpoint

    Student personal extra credit work:
    1. Add time-stamp prefix to input & output files
    2. Upload input & output to S3 bucket
    3. Use additional parameters to get different caricatures
*/

"use strict";

var $ = function(id) {
    return document.getElementById(id);
};

var processPhotoURL = function() {
    var photoURL = $("photoURL").value,
        toonPhotoURL;

    // check the URL points to a valid image file
    // TBD; assume the URL is good for now
    var isValid = true;

    if (isValid) {
        // display the original image
        var img = document.createElement('img');
        img.src = photoURL;            
        img.id = "original-image"
        document.getElementById("result-display").appendChild(img);
        
        // calling the AWS API Gateway endpoint which will trigger the lambda function to call the Toonify API
        fetch("https://09f9lidrb1.execute-api.us-east-1.amazonaws.com/stage", {
            method: 'POST',
            body: JSON.stringify({
                "image_uri":photoURL
            }),
            headers: {
                "Content-Type":"application/json"
            }
        })
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log(data)
            var toonImg = document.createElement('img');            
            toonImg.src = data.output_url;
            toonImg.id = "toonified-image"
            document.getElementById("result-display").appendChild(toonImg);
        })

            //     // save both the original & toonified images to S3
            //     savePhotoToS3(photoURL, toonPhotoURL);
            // }
        // })()
    }
};

function savePhotoToS3(photoURL, toonedURL) {
    var myUrl = window.location,
        s3Endpoint = myUrl.protocol + "//" + myUrl.host + "/", // bucket url
        filename = photoURL.split('/').pop(),
        photoFilename = s3Endpoint + "input/" + filename,
        toonFilename = s3Endpoint + "output/toon_" + filename;
        
//     console.log(photoURL);
//     console.log(toonedURL);
    
//     var filename = photoURL.split('/').pop(),
//         photoFilename = s3Endpoint + "input/" + filename,
//         toonFilename = s3Endpoint + "output/toon_" + filename;
        
    console.log(filename);  
    console.log(photoFilename);
    console.log(toonFilename);
    
    /*
    PERSONAL EXTRA EXERCISE
    
    The code for uploading files to an S3 bucket is left for
    your own exploration.
    
    To help you get started, here is one reference:
    https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photo-album-full.html
    
    */    
    
};

var clearEntries = function() {
	$("photoURL").value = "";
};

window.onload = function() {
    $("toonify").onclick = processPhotoURL;
    $("clear").onclick = clearEntries;
	// $("photoURL").ondblclick = clearEntries; // double click to clear
    // $("photoURL").focus();
};
