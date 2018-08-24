import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import firebase from 'firebase';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 
 */

var config = {
  apiKey: "AIzaSyAQ_vftCti886YY-mAcIfznxEsIwoc3Cew",
  authDomain: "shoppinglist4-1ab11.firebaseapp.com",
  databaseURL: "https://shoppinglist4-1ab11.firebaseio.com",
  projectId: "shoppinglist4-1ab11",
  storageBucket: "shoppinglist4-1ab11.appspot.com",
  messagingSenderId: "833854313761"
};


// declare var firebase;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  count=0;
  

  imageSource;
  employeePhoto;

  imageURI;
  stringPic;
  stringVideo;
  stringAudio;
  upload;
  uploadFile={
    name:'',
    downloadUrl:''
  }
  fire={
    downloadUrl:''
  };
  
  firebaseUploads;


  
    

  constructor(public navCtrl: NavController, public navParams: NavParams,private mediaCapture: MediaCapture, private platform : Platform, private f : File) {
    
    // this.imageSource = 'Ali';
    // this.getPhotoURL();




    firebase.initializeApp(config);
    this.upload = firebase.database().ref('/upload/');
    this.firebaseUploads = firebase.database().ref('/fireuploads/');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }
  uploads(type) {
    this.platform.ready().then(() => {
      let promise
      switch (type) {
        case 'camera':
          promise = this.mediaCapture.captureImage()
          break
        case 'video':
          promise = this.mediaCapture.captureVideo()
          break
        case 'audio':
          promise = this.mediaCapture.captureAudio()
          break
      }
      promise.then((mediaFile: MediaFile[]) => {
        console.log(mediaFile)
       // this.presentLoading();
        this.imageURI = mediaFile[0].fullPath
        var name = this.imageURI.substring(this.imageURI.lastIndexOf('/')+1, this.imageURI.length);
        console.log(name);
       // this.presentLoading();
        switch (type) {
          case 'camera':
            this.stringPic = this.imageURI;
            this.uploadFile.name ="Camera Image"
            this.uploadFile.downloadUrl =  this.stringPic;
           this.upload.push({name:"Camera Image",downloadUrl: this.stringPic});
            break
          case 'video':
          this.stringVideo = this.imageURI;
          this.uploadFile.name ="Video"
          this.uploadFile.downloadUrl =   this.stringVideo ;
         // this.upload.push({name:"Video",downloadUrl: this.stringVideo});
            break
          case 'audio':
          this.stringAudio = this.imageURI;
          this.uploadFile.name ="Audio"
          this.uploadFile.downloadUrl =  this.stringAudio;
         // this.upload.push({name:"Audio",downloadUrl: this.stringAudio});
            break
        }
        var directory: string = this.imageURI.substring(0, this.imageURI.lastIndexOf('/')+1);
        directory = directory.split('%20').join(' ')
        name = name.split('%20').join(' ')
        console.log(directory)
        console.log('About to read buffer')
        let seperatedName = name.split('.')
        let extension = ''
        if (seperatedName.length > 1) {
          extension = '.' + seperatedName[1]
        }
        return this.f.readAsArrayBuffer(directory, name).then((buffer: ArrayBuffer) => {
          console.log(buffer)
          console.log('Uploading file')
          var blob = new Blob([buffer], { type: mediaFile[0].type });
          console.log(blob.size);
          console.log(blob)
          const storageRef = firebase.storage().ref('files/' + new Date().getTime() + extension);
          return storageRef.put(blob).then((snapshot:any) => {
            console.log('Upload completed')
            //this.loader.dismiss;
            console.log(snapshot.Q)
             let  files = [];
            storageRef.getDownloadURL().then((url) => {
              this.fire.downloadUrl = url;
              this.firebaseUploads.push({downloadUrl: url});
              return this.fire.downloadUrl;
            });
            console.log(this.firebaseUploads);
            // switch (type) {
            //   case 'camera':
            //   this.files.picture = storageRef.getDownloadURL().toString();
            //   // this.uploadFile.name = "Camera Taken Picture";
            //   // this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
            //   console.log( "url",storageRef.getDownloadURL().toString());
            //   this.uploads.push(this.uploadFile);
            //     break
            //   case 'video':
            //   // this.files.video = storageRef.getDownloadURL().toString();
            //   // this.uploadFile.name = "Camera Taken Video";
            //   this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
            //   this.uploads.push(this.uploadFile);
            //   console.log( "url",storageRef.getDownloadURL().toString());
            //     break
            //   case 'audio':
            //   // this.files.audio = storageRef.getDownloadURL().toString();
            //   // this.uploadFile.name = "Audio Taken ";
            //  // this.uploadFile.downloadUrl = storageRef.getDownloadURL().toString();
            //   this.uploads.push(this.uploadFile);
            //   console.log( "url",storageRef.getDownloadURL().toString());
            //     break
            // }
             // this.presentMedia(type);
          })
          // return this.userService.saveProfilePicture(blob)
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
    })
  }





  

  // getPhotoURL(){

  //   firebase.storage().ref().child('files/'+this.imageSource+'.jpg').getDownloadURL().then((url)=>{
  //     this.employeePhoto = url;
  //   })
  // }
  b;
  imageView;
  images=[];
  
  displaycamera(){
    // firebase.storage().ref().child(this.imageURI).getDownloadURL().then((URL) => {
    //   this.zone.run(() => {
    //     this.imageView = URL;
    //   })
    // })
    firebase.database().ref('/fireuploads/').on("value",(snapshot) =>{
      snapshot.forEach((snap) =>{
        this.b = {keyname : snap.key, name :snap.val().downloadUrl};
        this.imageView =  this.b.name;
        // this.images.push(this.imageView);
        // if(this.count === 0){
        //   this.imageUrl = this.b.name;
        //   console.log("------------------>" + this.imageUrl);
        // }
        if(this.imageView.lastIndexOf('.jpg') >= 0){
          this.images.push(this.imageView);
      }
        console.log(snap.val().downloadUrl)
        this.count++;
        return false;
      })
    });
}




v;
videoView;
videos=[];
// count=0;
displayvideo(){
  // firebase.storage().ref().child(this.imageURI).getDownloadURL().then((URL) => {
  //   this.zone.run(() => {
  //     this.imageView = URL;
  //   })
  // })
  firebase.database().ref('/fireuploads/').on("value",(snapshot) =>{
    snapshot.forEach((snap) =>{
      this.v = {keyname : snap.key, name :snap.val().downloadUrl};
      this.videoView =  this.v.name;
      
      // if(this.count === 0){
      //   this.imageUrl = this.b.name;
      //   console.log("------------------>" + this.imageUrl);
      // }
      if(this.videoView.lastIndexOf('.mp4') >= 0){
          this.videos.push(this.videoView);
      }
      console.log(snap.val().downloadUrl)
    
      return false;
    })
  });
}




a;
audioView;
audios=[];
// count=0;
displayaudio(){
  // firebase.storage().ref().child(this.imageURI).getDownloadURL().then((URL) => {
  //   this.zone.run(() => {
  //     this.imageView = URL;
  //   })
  // })
  firebase.database().ref('/fireuploads/').on("value",(snapshot) =>{
    snapshot.forEach((snap) =>{
      this.a = {keyname : snap.key, name :snap.val().downloadUrl};
      this.audioView =  this.a.name;
      
      // if(this.count === 0){
      //   this.imageUrl = this.b.name;
      //   console.log("------------------>" + this.imageUrl);
      // }
      if(this.audioView.lastIndexOf('.m4a') >= 0){
          this.audios.push(this.audioView);
      }
      console.log(snap.val().downloadUrl)
    
      return false;
    })
  });
}






}




