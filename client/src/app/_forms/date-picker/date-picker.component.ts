import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent implements ControlValueAccessor {

  @Input() label = '';
  @Input() maxDate: Date | undefined;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
    // Implement writeValue logic if needed
  }

  registerOnChange(fn: any): void {
    // Implement registerOnChange logic if needed
  }

  registerOnTouched(fn: any): void {
    // Implement registerOnTouched logic if needed
  }

  setDisabledState(isDisabled: boolean): void {
    // Implement setDisabledState logic if needed
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }
}
