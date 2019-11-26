// global values
var admin_username,admin_password;
var download_link;
var firebaseConfig = {
    apiKey: "AIzaSyCTz9gyBF0SddLL5hCm1-3jS-R0nFwidZM",
    authDomain: "handyphoenix-623fa.firebaseapp.com",
    databaseURL: "https://handyphoenix-623fa.firebaseio.com",
    projectId: "handyphoenix-623fa",
    storageBucket: "handyphoenix-623fa.appspot.com",
    messagingSenderId: "229651722370",
    appId: "1:229651722370:web:daf1814ae10fe0995a449b"
};
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

window.onload = function (){
    var uploader= document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');
    //List
    fileButton.addEventListener('change', function(e){
      var file = e.target.files[0];
      var storageRef=firebase.storage().ref('folder_name/' +file.name );

      var task =storageRef.put(file); 
      task.on('state_changed',
      function progress(snapshot){
          var percentage= (snapshot.bytesTransferred/snapshot.totalBytes) * 100;        
          uploader.value=percentage;
          },
          function error (err){
          },
          function complete(){
            task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        download_link=downloadURL

      });
      });
    });
}
var fb_tblAdmin=firebase.database().ref().child("tbl_Admin");
 /// LOG IN /////
fb_tblAdmin.on("value",snap =>{
  admin_username=snap.child("username").val();
  admin_password=snap.child("password").val(); 
	
});

// LOGIN VERIFICATION //
function loginNow(){
      var username= document.getElementById("inputEmail").value;
      var password = document.getElementById("inputPassword").value;
      console.log(admin_username,admin_password);
      if (username==admin_username && password ==admin_password){
          console.log("SUCCESS");
          location.href = "admin_main.html";
          $('#success.toast').toast('show');
        }
      else{
          console.log("ISA PA LORD");   
			console.log("test:",admin_username,admin_password);		  
          $('#wrong.toast').toast('show');      
        }
  }

var fb_tblArticle=firebase.database().ref().child("tbl_article");

function insertStory(){  
      var today = new Date();
      var TitleStories = document.getElementById("txt_Title").value;	
      var Comment = document.getElementById("txt_Comment").value;
      var Content = document.getElementById("txt_Content").value;
      var  date= today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // This is for storing data
      var PushStories = {
        title_story: TitleStories,
        content_story: Content,
        comment_story: Comment,
        publish_date: date,
        publish_time: time,
        image_link : download_link	
        } 

      fb_tblArticle.push(PushStories);
}
function passVal(value){
	localStorage.setItem("stories",value)
	console.log("LETS: ",value);
	
	
}

var rootRef = firebase.database().ref().child("tbl_article");
  rootRef.on("child_added", snap =>
  {
	var image = snap.child("image_link").val();
    var comment_story = snap.child("comment_story").val();
    var content_story = snap.child("content_story").val();
    var publish_date=snap.child("publish_date").val();
    var publish_time=snap.child("publish_time").val();
    var title_story=snap.child("title_story").val();      
      
        var doc =  `  <div class="card mb-3" style="max-width: 50rem;">
        <img class="card-img-top" src="${image}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${title_story}</h5>
          <p class="card-text">${content_story.split(/\s+/).slice(0,10).join(" ") +"..."}</p>
          <input value="See more" class="btn btn-primary" onclick="passVal('Data')">
          <p class="card-text"><small class="text-muted">Published : ${publish_date} . ${publish_time} </small></p>
        </div>
      </div>  `
      
        $("#collect").append(doc);
  });
