import { Component, OnInit, Inject } from '@angular/core';

import { Group } from '../../../../models/group-data.model';
import { GroupsService } from 'src/app/services/groups.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  styleUrls: ['./add-modify.component.scss']
})

export class AddModifyGroupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<AddModifyGroupComponent>,
    private groupServices: GroupsService,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  /**
  * Method reports about closing bottom sheet
  */
  abort(group?: Object) {
    this.dialogRef.close(group)
  }

  /**
  * Method saves data about a new or modified class
  * @param formValue - data about the class that we want to change or create
  */
  save(data: Object) {
    const group = new Group(data);
    this.groupServices.addGrup(group).subscribe((data) => {
      if (group.id === undefined  && !(data===undefined)) {
        this.abort(data);
        this.openSnackBar(
          `Клас ${data.className}  ${data.classYear} року створений`,
          'snack-class-success'
        );
      } else if (group.id && !(data===undefined)) {
        //console.log((data===undefined))
        this.abort();
        this.openSnackBar(
          `Клас ${data.className}  ${data.classYear} року. Зміни збережено`,
          'snack-class-success'
        );
      }else if (data===undefined){
        this.abort();
        this.openSnackBar(
          `НЕ ЗБЕРЕЖЕНО!!! Можливо даний клас вже існує`,
          'snack-class-fail'
        );
      }
    });
  }

  /**
  * Method opens the snack-bar with a message
  * @param message - message which must be displayed
  * @param classMessage - Extra CSS classes to be added to the snack bar container.
  */
  openSnackBar(message: string, classMessage: string) {
    const config = new MatSnackBarConfig();
    config.panelClass = [classMessage];
    config.duration = 4000;
    config.verticalPosition = 'top';
    this.snackBar.open(message, null, config);
  }
}