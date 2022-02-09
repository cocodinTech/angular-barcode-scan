# AngularBarcodeScan
Servicio Angular para manejar el plugin Cordova: `bardode-scan`
## install 
 - ionic cordova plugin add barcode-scan
 - npm install angular-barcode-scanner

 app.module.ts:
  `import { BarcodeScan,  BarcodeScanModule } from 'angular-barcode-scan';
  
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
   })`
