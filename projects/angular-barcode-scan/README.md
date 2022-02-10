# AngularBarcodeScan
Servicio Angular para manejar el plugin Cordova: `bardode-scan`
## install 
 - ionic cordova plugin add barcode-scan
 - npm install angular-barcode-scan

 ```Angular
 app.module.ts:
  import { BarcodeScan,  BarcodeScanModule } from 'angular-barcode-scan';
  
   @NgModule({
    declarations: [
      ...
    ],
    imports: [
      ...
      BarcodeScanModule
    ],
    providers: [
      ...
      BarcodeScan
      ...
    ],
   })

  app.component.html:
   <ion-app>
    <barcode-host-listener></barcode-host-listener>
   ...
   </ion-app>
  `