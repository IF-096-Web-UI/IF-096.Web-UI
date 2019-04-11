import { Component, OnInit } from '@angular/core';
import { TeacherService } from "src/app/services/teacher.service";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder} from '@angular/forms';
import { StudentsService } from 'src/app/services/students.service';
import { ClassService } from 'src/app/services/class.service';
import { FormsModule }   from '@angular/forms';
import { MatFormFieldModule } from '@angular/material';
import { ReactiveFormsModule }   from '@angular/forms';
import { from } from 'rxjs';
import { SubjectService } from 'src/app/services/subject.service';
import { RestService } from 'src/app/services/rest.service';

@Component({
  selector: 'app-teacher-connection',
  templateUrl: './teacher-connection.component.html',
  styleUrls: ['./teacher-connection.component.scss']
})
export class TeacherConnectionComponent implements OnInit {

  public title = "Приєднання вчителя до журналу";
  teachers;
  subjects;
  classes; 

  constructor(
    private teacherService: TeacherService, 
    private classService: ClassService,
    private subjectService: SubjectService,
    private fb: FormBuilder,
    private jornalServise: RestService
    ) {
    
  }

  myForm=this.fb.group({
    classId: ['', Validators.required],
    subjectId: ['', Validators.required],
    teacherId:['', Validators.required],
  });

  onSubmit(data){
    this.jornalServise.sentDataTojornal(data, data.teacherId, data.classId, data.subjectId).subscribe(res=>console.log(res))

    console.log(data);

  }
  
  
  ngOnInit() {
    this.teacherService.getTeachers()
      .subscribe(teachers => this.teachers = teachers);
    
    this.subjectService.getSubjects()
      .subscribe(subjects => this.subjects = subjects);

    this.classService.getClasses("all")
      .subscribe(classes => this.classes = classes);

    
 }

}