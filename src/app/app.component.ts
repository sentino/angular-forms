import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Icpc2Service } from '../shared/services/icpc2.service';
import { IIcpc2 } from '../shared/interfaces/icpc2.interface';
import { Icpc2 } from '../shared/models/Icpc2';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const asFormControl = (ctrl: AbstractControl | null): FormControl | any => {
  if (!ctrl) {
    console.error('control is undefined');
    return null;
  }
  return ctrl as FormControl;
};

export const asFormArray = (ctrl: AbstractControl | null): FormArray | any => {
  if (!ctrl) {
    console.error('array is undefined');
    return null;
  }
  return ctrl as FormArray;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef)

  public readonly asFormControl = asFormControl;
  public readonly asFormArray = asFormArray;

  public textareaForJson: FormControl = new FormControl({value: '', disabled: true});
  public form: FormGroup = new FormGroup({
    date: new FormControl('', [Validators.required]),
    icpc2: new FormArray([])
  })
  public minDate: Date = new Date();
  public icpc2: Icpc2 | undefined;

  constructor(private icpc2Service: Icpc2Service) {
  }

  ngOnInit(): void {
    this.addIcpc2Group();

    this.icpc2Service.getIcpc2().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((res: IIcpc2) => {
      this.icpc2 = new Icpc2(res);
    })
  }

  private dateParser() {
    const data: any =
      {
        encounter: {
          date : this.form.get('date')?.value
        },
        conditions: []
      }

    const icpc2 = asFormArray(this.form.get('icpc2'));
    if (icpc2?.length) {
      for (let i = 0; i < icpc2.length; i++) {
        const fullDataIcpc2 = this.icpc2?.getFullDataByID(icpc2.controls[i].get('diagnosis').value);
        data.conditions.push({
            id: icpc2.controls[i].get('id').value,
            context: {
              identifier: {
                type: {
                  coding: [
                    {
                      "system": "eHealth/resources",
                      "code": "encounter"
                    }
                  ]
                },
                value: icpc2.controls[i].get('diagnosis').value
              }
            },
            code: {
              coding: [
                {
                  system: "eHealth/ICPC2/condition_codes",
                  code: fullDataIcpc2?.code
                }
              ]
            },
            notes: icpc2.controls[i].get('notes').value,
            onset_date: this.form.get('date')?.value
          })
      }
    }

    return JSON.stringify(data);
  }

  public addIcpc2Group(): void {
    const icpc2Array = asFormArray(this.form.get('icpc2'));
    const newGroup = new FormGroup({
      diagnosis: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      id: new FormControl(Math.random()) // for a real project you will need to connect a module or generate an ID on the backend
    })
    icpc2Array?.push(newGroup);
  }

  public deleteIcpc2Group(index: number): void {
    const icpc2Array = asFormArray(this.form.get('icpc2'));
    icpc2Array?.removeAt(index);

    if (!icpc2Array.length) {
      this.addIcpc2Group();
    }

    this.form.updateValueAndValidity();
  }

  public generateJSON(): void {
    if (this.form.invalid) {
      this.form.get('date')?.markAsTouched();

      const icpc2 = asFormArray(this.form.get('icpc2'));
      if (icpc2?.length) {
        for (let i = 0; i < icpc2.length; i++) {
          icpc2.controls[i].get('diagnosis').markAsTouched();
        }
      }

      this.form.markAsDirty();
      this.form.updateValueAndValidity();
      this.textareaForJson.setValue('');
      return;
    }

    const result = this.dateParser();
    this.textareaForJson.setValue(result);
  }
}
