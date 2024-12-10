/* eslint-disable @typescript-eslint/no-empty-function */
import { Component, effect, ElementRef, EventEmitter, inject, input, Input, OnInit, Optional, Output, Self } from '@angular/core';
import { AbstractControlDirective, ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IMaskModule } from 'angular-imask';
import { Subject } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nz-input-number',
  standalone: true,
  imports: [
    IMaskModule,
    FormsModule,
    NzInputModule
  ],
  templateUrl: './nz-input-number.component.html',
  styleUrl: './nz-input-number.component.scss',
  // providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NzInputNumberComponent), multi: true }],
  host: {
    "class": "ant-input",
    '[class.ant-input-number-focused]': 'isFocused'
  }
})
export class NzInputNumberComponent implements ControlValueAccessor, OnInit {
  private readonly _platform = inject(Platform);
  public mask: any = undefined;
  private _value = 0;
  isFocused = false;
  public disable = false;;
  public stateChanges = new Subject<void>();
  public ngControl: NgControl | AbstractControlDirective | null = null;
  public onChange = (_: any) => {};
  public onTouched = () => {};
  public empty = true;
  public decimals = input<number>(0);
  public type = input<"number" | "percentage">("number");
  public readonly readOnly = input<boolean>(false);
  @Output() valueChange = new EventEmitter<number>();

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() ngControl: NgControl
  ){
    if (ngControl){
      ngControl.valueAccessor = this;
      this.ngControl = ngControl;
    }

    if (this._platform.isBrowser){
      this.mask = { 
        mask: Number,  // enable number mask
        // other options are optional with defaults below
        scale: 0,  // digits after point, 0 for integers
        thousandsSeparator: '.',  // any single char
        padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
        normalizeZeros: true,  // appends or removes zeros at ends
        //radix: ',',  // fractional delimiter
        mapToRadix: ['.'],  // symbols to process as radix
        autofix: true,
      };
    }

    effect(() => {
      const decimals = this.decimals();
      this.mask = { 
        mask: Number,  // enable number mask
        // other options are optional with defaults below
        scale: decimals,  // digits after point, 0 for integers
        thousandsSeparator: '.',  // any single char
        padFractionalZeros: true,  // if true, then pads zeros at end to the length of scale
        normalizeZeros: true,  // appends or removes zeros at ends
        //radix: ',',  // fractional delimiter
        mapToRadix: ['.'],  // symbols to process as radix
        autofix: true,
      };
    })
  }
  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  

  private _inputValue = '0'
  public set inputValue(value: string){
    // const temp: string = value;
    this._inputValue = value;
    this.value = Number.parseFloat(value.replaceAll(".", "").replace(",", "."));
  }
  public get inputValue(){
    return this._inputValue;
  }

  @Input()
  get value(){
    return this._value;
  }

  set value(value: number){
    // this._value = value;
    if (this.type() == "percentage") {
      this.onChange(value / 100);
    } else {
      this.onChange(value);
    }
    // this.onChange(value);
  }
  
  public writeValue(obj: any): void {
    if (typeof obj == "number"){
      this.value = obj;
      this._inputValue = obj.toString().replace(".", ",");
    } else {
      this.value = 0;
      this._inputValue = "";
    }
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled;
  }


  focus(): void {
    this.isFocused = true;
  }

  blur(): void {
    this.isFocused = false;
    this._elementRef.nativeElement.blur();
  }
}
