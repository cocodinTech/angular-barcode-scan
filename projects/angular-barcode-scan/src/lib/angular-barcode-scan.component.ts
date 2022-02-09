import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'lib-angular-barcode-scan',
  template: ``,
  styles: [
  ]
})
export class AngularBarcodeScanComponent implements OnInit {

  private static readonly KEYDOWN_EVENT = 'document:keydown';
  private static readonly KEYUP_EVENT = 'document:keyup';
  private static readonly KEYPRESS_EVENT = 'document:keypress';

  constructor() {
    console.log('%c se construye el componente!!!', 'color:purple');
  }


  @HostListener(AngularBarcodeScanComponent.KEYUP_EVENT, ['$event']) handleKeyboardEventKeyUp(event: KeyboardEvent) {
    console.log('%cKeyboard ' + AngularBarcodeScanComponent.KEYUP_EVENT + ' event: ' + event.keyCode, 'color:orange');
    return false; //prevent event to be fired repeteadly in devices with physical keyboard (android 5-> unitech)
  };

  @HostListener(AngularBarcodeScanComponent.KEYPRESS_EVENT, ['$event']) handleKeyboardEventKeypress(event: KeyboardEvent) {
    console.log('%cKeyboard ' + AngularBarcodeScanComponent.KEYPRESS_EVENT + ' event: ' + event.keyCode, 'color:orange');
  };


  @HostListener(AngularBarcodeScanComponent.KEYDOWN_EVENT, ['$event']) handleKeyboardEventKeydown(event: KeyboardEvent) {
    console.log('%cKeyboard ' + AngularBarcodeScanComponent.KEYDOWN_EVENT + ' event: ' + event.keyCode, 'color:orange');
    const src: any = event.srcElement;
    const isPhysicalKeyboard = !src.type; //!src.type -> event from physycal keyboard without input focused
    const isInputNumberType = (src && src.type && src.type.indexOf(['number']) >= 0); //event for input type=number and focused
    //let isNumberKeyCode = event.keyCode >= 48 && event.keyCode<= 57;
    if (isPhysicalKeyboard || isInputNumberType) {
      //prevent event to be fired repeteadly in devices with physical keyboard (android 5-> unitech)
      event.preventDefault();
    }
    // TODO  this.events.publish(Constants.KEYDOWN_EVENT, event);
    if (isPhysicalKeyboard || isInputNumberType) {
      //prevent event to be fired repeteadly in devices with physical keyboard (android 5-> unitech)
      return false; //return false to prevent event bubble up
    }
    return true;
  }
  ngOnInit() {
    console.log('%c se construye el componente!!!', 'color:purple');
  }

}
