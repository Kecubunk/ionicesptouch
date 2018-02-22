import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Toast } from '@ionic-native/toast';

declare var esptouch;
declare var WifiWizard;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ssid;
  password;
  started = false;

  constructor(public navCtrl: NavController, private network: Network, private toast: Toast) {
    var self = this;
    WifiWizard.getCurrentSSID(ssidHandler, fail);//removed 'this'
    function ssidHandler(s) {//declare inside the constructor locally
      console.log(s)
      self.ssid = s.replace('"', '').replace('"', '');
    }
    function fail(e) {//declare inside the constructor locally
      this.showMessage("Please connect to your local WIFI");
    }
  }

  showMessage (msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  onButton() {
    if (this.network.type === 'wifi') {
      if (this.started) {
        esptouch.stop(res => { console.log(res) }, err => { console.log(err) });
      }
      console.log("ESP Touch start...");
      console.log("ssid = " + this.ssid + " password = " + this.password);
      esptouch.start(this.ssid, "00:00:00:00", this.password, "NO", 1,
        res => { this.configComplete(res) },
        err => { this.configError(err) });

      this.started = true;
    }
    else {
      this.showMessage("WIFI not started so no action.");
    }
  }

  configComplete(res) {
    console.log(res);
    esptouch.stop(res => { console.log(res) }, err => { console.log(err) });
    this.showMessage("ESP Touch stop with success!");
    this.started = false;
  }

  configError(res) {
    console.log(res);
    esptouch.stop(res => { console.log(res) }, err => { console.log(err) });
    this.showMessage("ESP Touch stop with error!");
    this.started = false;
  }

}
