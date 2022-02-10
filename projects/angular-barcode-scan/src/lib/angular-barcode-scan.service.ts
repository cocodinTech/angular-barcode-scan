/* eslint-disable max-len */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Subject } from 'rxjs';

declare const cordova: any;
export interface IScanEvent {
  flag: string;
  result: any;
}

export interface ISubscriber {
  id: string;
  subscriber: any;
}

/**
 *  @name BarcodeScan
 *  
 *  @description
 *  Servicio Angular para manejar el plugin Cordova: `bardode-scan`
 * 
 *  @usage
 * ```typescript
 * app.module.ts
 *  import { BarcodeScan,  BarcodeScanModule } from 'angular-barcode-scan';
 * 
 *  @NgModule({
 *   declarations: [
 *     ...
 *   ],
 *   imports: [
 *     ...
 *     BarcodeScanModule
 *   ],
 *   providers: [
 *     ...
 *     BarcodeScan
 *     ...
 *   ]
 * 
 *  app.component.html
 *  <ion-app>
 *    <barcode-host-listener></barcode-host-listener>
 *    ...
 *  </ion-app>
 * 
 *          ---------------------------------
 * 
 *  import { Device } from '@awesome-cordova-plugins/device/ngx';
 *  import { BarcodeScan } from 'angular-barcode-scanner';
 *  
 *  constructor(
 *    private barcodeScan: BarcodeScan,
 *    private device: Device
 *    ) {}
 *
 *  ...
 *  await this.barcodeScan.setBarcodeDevice(this.device.model);
 * 
 *  ...
 *  this.scannerProvider.scanBarcode().then((result)=>{
 *       console.log(result);
 *    });
 * 
 *  
 *  ...
 *  this.barcodeScan.subscrbeToScan(this.subscribeKey,
 *     async (value) => {
 *       this.callbackFunction(value.result);
 *     }, (err) => {
 *       console.log(err);
 *     });
 * 
 *  ...
 *  this.barcodeScan.unSubscrbeToScan(this.subscribeKey);
 * 
 */
@Injectable()
export class BarcodeScan {
  /**
   * flags de los eventos
   */
  public static readonly EVENT_SCAN: string = 'barcode-scanner-scan';
  public static readonly EVENT_ENABLE: string = 'barcode-scanner-enable';
  public static readonly EVENT_DISABLE: string = 'barcode-scanner-disable';
  public static readonly EVENT_GET_DEVICES: string = 'barcode-scanner-get-devices';

  // lista de los modelos del plugin, y nuevos modelos asociados con alguno de los anteriores
  private readonly compatibleHardware: any[] = [
    // modelos del plugin
    { model: 'c4050', index: 1 },
    { model: 'NQuire300', index: 2 },
    { model: 'EDA50K', index: 3 },
    { model: 'ZebraMC33', index: 4 },
    { model: 'UnitechEA300', index: 5 },
    // modelos correlativos
    { model: 'EA300', index: 5 },
    { model: 'NQ300', index: 2 },
    { model: 'TC20', index: 4 }
  ];

  private scanSubject = new Subject<IScanEvent>();
  private subscribes: any = {};
  private hardware = 'camera';

  constructor(
    private platform: Platform,
    private ngZone: NgZone
  ) { }

  /**
   * Selecciona el tipo de scanner según el modelo del dispositivo (this.device.model) y habilita el lector dedidado.
   * Se declara un objeto Subject<IScanEvent> al que podemos subscribirnos con .subscrbeToScan(...)
   * 
   * @param device el modelo del disposivo proporcionado por 'cordova-plugin-device'
   */
  public async setBarcodeDevice(model: string): Promise<any> {
    this.hardware = await this.getPluginModel(model);
    return await this.enableScan(this.hardware);
  }



  /**
   * Inicia una lectura del hardware dedicado o lanza la camara para usarla como lector.
   * Cada vez que se produce un escaneo se propaga un Subject<IScanEvent>
   * 
   * @returns la lectura del scanner 
   */
  public async scanBarcode(): Promise<string> {
    return await this.scan(this.hardware);
  }

  /**
   * Declara un nuevo observable para escuchar los eventos del scanner
   * @param id id único para declarar el observable. 
   * Si el id fue utilizado anteriormente y la subscripción aun está activa se aborta la operación
   * @param callbackFunction 
   * @param errorFunction 
   */
  public subscrbeToScan(id: string, callbackFunction: any, errorFunction: any): void {
    try {
      const element = this.subscribes[id];
      let subscriber: any;
      if (!element || (element.key === id && element.subscriber.closed)) {
        subscriber = this.scanSubject.asObservable().subscribe((value) => {
          this.ngZone.run(() => {
            callbackFunction(value);
          });
        });
        this.subscribes[id] = {
          subscriber: subscriber,
          key: id
        };
      }
    } catch (err) {
      errorFunction(err);
    }
  }

  /**
   * Se cierra el subscribe declarado con el id proporcionado
   * @param id id del observable para cancelar la subscripción
   */
  public unSubscrbeToScan(id: string): void {
    if (this.subscribes[id] && !this.subscribes[id].subscriber.closed) {
      this.subscribes[id].subscriber.unsubscribe();
      delete this.subscribes[id];
    };
  }



  /*********************************************************************************************************/

  private async getPluginModel(nativeModel: string): Promise<string> {
    await this.platform.ready();
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.platform.is('cordova')) {
          const msg = 'Scanner plugin not available';
          reject(msg);
        }
        if (this.platform.is('cordova')) {
          let model = 0; // TODO comprobar que el dispositivo tiene camara
          const pluginDevices: any = await this.getDevices();
          const result = this.compatibleHardware.find(element => element.model === nativeModel);
          if (result) {
            model = result.index;
          }
          resolve(pluginDevices[model]);
        }
      } catch (err) {
        reject(err);
      }
    });
  }


  private getDevices(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (!this.platform.is('cordova')) {
        const msg = 'Scanner plugin not available';
        reject(msg);
      }
      if (this.platform.is('cordova')) {
        cordova.plugins.BarcodeScan.getDevices((res: any) => {
          this.scanSubject.next({ flag: BarcodeScan.EVENT_GET_DEVICES, result: res });
          resolve(res);
        }, (err: any) => {
          reject(err);
        });
      }
    });
  }


  private enableScan(device: any): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (!this.platform.is('cordova')) {
        const msg = 'Scanner plugin not available';
        reject(msg);
      }
      if (this.platform.is('cordova')) {
        cordova.plugins.BarcodeScan.enable(device, async (value: any) => {
          console.log('%c enableScan: ' + JSON.stringify(value), 'color:purple');
          if (device !== 'camera' && value.text) {
            this.scanSubject.next({ flag: BarcodeScan.EVENT_ENABLE, result: value.text });
          }
          resolve(true);
        }, (err: any) => {
          reject(err);
        });
      }
    });
  }

  private disableScan(device: any): Promise<boolean> {
    return new Promise((resolve: any, reject: any) => {
      if (!this.platform.is('cordova')) {
        const msg = 'Scanner plugin not available';
        reject(msg);
      }
      cordova.plugins.BarcodeScan.enable(device, (res: any) => {
        this.scanSubject.next({ flag: BarcodeScan.EVENT_DISABLE, result: res });
        resolve(true);
      }, (err: any) => {
        reject(err);
      });
    });
  }

  private scan(device: any): Promise<string> {
    return new Promise((resolve: any, reject: any) => {
      if (!this.platform.is('cordova')) {
        const msg = 'Scanner plugin not available';
        reject(msg);
      }
      if (this.platform.is('cordova')) {
        cordova.plugins.BarcodeScan.scan(device, (value: any) => {
          console.log('%c Scan: ' + JSON.stringify(value), 'color:green');
          if (value.text) {
            this.scanSubject.next({ flag: BarcodeScan.EVENT_SCAN, result: value.text });
          }
          resolve(value.text);
        }, (err: any) => {
          reject(err);
        });
      }
    });
  }




}
