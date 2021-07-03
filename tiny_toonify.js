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
        document.body.appendChild(img);

        const endpoint = "https://09f9lidrb1.execute-api.us-east-1.amazonaws.com/stage"
        const success_msg = `
        <div align="center">
          Your image has been submitted successfully. 
          Admire it in all its glory here 
        </div>
        `

        // NOTE: replace with your personal DeepAI api-key here 
        // deepai.setApiKey('577d6aaa-276b-4844-87af-6f009ebd49e8');

        // call the Toonify API via DeepAI and wait for the response in 
        // an async func because Toonify takes several seconds to complete
        
//         let payload = `{
//             "image_uri": photoURL
//         }`

//         jQuery.ajax({
//             type: 'POST',
//             url: endpoint,
//             data: payload,
//             headers:{
//                 "Content-Type":"application/json",
//                 "Access-Control-Allow-Origin":"*"
//             }
//             dataType: 'json',
//             success: function(responseData, textStatus, jqXHR) {
//                 let value = responseData.body.result;
//                 var toonImg = document.createElement('img');            
//                 toonImg.src = value.output_url;
//                 document.body.appendChild(toonImg);
//                 // document.write(success_msg)
//                 // document.write(`<img src="${img}"/>`);
//             },
//             error: function (responseData, textStatus, errorThrown) {
//               alert('POST failed.')
//             }
//         })

//         // document.write(success_msg)
//         // document.write(`<img src="${img}"/>`);
//     }
// }
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
                document.body.appendChild(toonImg);
            })

            // const Http = new XMLHttpRequest();
            // const url = "https://09f9lidrb1.execute-api.us-east-1.amazonaws.com/stage";
            // var data = "{\"image_uri\" : \"" + photoURL + "\"}"
            // Http.open("POST", url, true);
            // Http.setRequestHeader('Content-type', 'application/json');

            // resp = await Http.send(data);
            // console.log(resp);
            // var resp = await deepai.callStandardApi("toonify", {
            //         image: photoURL,
            //         // add other API parameters here
            // });
            
            // display the API response
            // if (resp) {
            //     console.log(resp);
            //     toonPhotoURL = resp.output_url; // URL of the toonified image
            
            //     // display the toonified image
            //     var toonImg = document.createElement('img');            
            //     toonImg.src = toonPhotoURL;
            //     document.body.appendChild(toonImg);
                
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
    $("photoURL").focus();
};
