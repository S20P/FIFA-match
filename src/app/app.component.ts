import {  Component,
  OnInit,
  EventEmitter,
  Output } from '@angular/core';

  import { PushNotificationService } from './service/push-notification/push-notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title1 = 'app';

  loading;


  private title: string = 'Browser Push Notifications!';

     constructor(private _notificationService: PushNotificationService) {
      this.loading = "none";
      this._notificationService.requestPermission();
  }

     ngOnInit() {
     // this.notify();

     // var permission = Notification['permission'];

     // console.log("permission",permission);
      if ("Notification" in window) {
        var permission = Notification['permission'];
        console.log("permission",permission);
           if (permission === "denied") { 
          console.log("permition is denied");
          return;
          } else if (permission === "granted") { 
            console.log("permition is granted");
        //  this.notify();
           }
          }


      // if ("Notification" in window) {
      //   var permission = Notification['permission'];
        
      //   if (permission === "denied") { 
      //     console.log("permition is denied");
      //     return;
      //   } else if (permission === "granted") { 
      //    console.log("permition is granted");
      //     return checkVersion();
      //   }
        
      //   Notification.requestPermission().then(function() {
      //     checkVersion();
      //   });
      // }
    
      // function checkVersion() {
        
      //   var latestVersion = document.querySelector(".js-currentVersion").textContent;
      //   var currentVersion = localStorage.getItem("conciseVersion");
      //   if (currentVersion === null || semverCompare(currentVersion, latestVersion) === -1 ) {      
      //     displayNotification(
      //       `Click to see what's new in v${latestVersion}`,
      //       "https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/concise-logo.png",
      //       "A new version of Concise is available",
      //       `https://github.com/ConciseCSS/concise.css/releases/v${latestVersion}`,
      //       4000
      //     );
          
      //     localStorage.setItem("conciseVersion", latestVersion);
      //   }
      // }
    
      // function displayNotification(body, icon, title, link, duration) {
      //   link = link || 0; 
      //   duration = duration || 5000; 
    
      //   var options = {
      //     body: body,
      //     icon: icon
      //   };
    
      //   var n = new Notification(title, options);
    
      //   if (link) {
      //     n.onclick = function () {
      //       window.open(link);
      //     };
      //   }
    
      //   setTimeout(n.close.bind(n), duration);
      // }

      // Web Notification end




    }


    notify() {
      let data: Array < any >= [];
      data.push({
          'title': 'Approval',
          'alertContent': 'This is First Alert -- By Debasis Saha'
      });
      data.push({
          'title': 'Request',
          'alertContent': 'This is Second Alert -- By Debasis Saha'
      });
      data.push({
          'title': 'Leave Application',
          'alertContent': 'This is Third Alert -- By Debasis Saha'
      });
      data.push({
          'title': 'Approval',
          'alertContent': 'This is Fourth Alert -- By Debasis Saha'
      });
      data.push({
          'title': 'To Do Task',
          'alertContent': 'This is Fifth Alert -- By Debasis Saha'
      });
      this._notificationService.generateNotification(data);
  }







}
