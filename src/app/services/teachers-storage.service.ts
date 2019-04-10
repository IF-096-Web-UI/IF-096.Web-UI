import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class TeachersStorageService {
  public modalsId: number;
  public editMode: boolean;
  public defaultAvatar = 'assets/default-avatar.svg';
  teachersChanged = new Subject();

  constructor(private httpClient: HttpClient) {}

  /**
   * Method fetches from server an array of teachers
   * passes it to the subject teachersChanged.
   */
  getTeachers() {
    this.httpClient
      .get<any>('/teachers')
      .pipe(
        map(response => {
          const teachers = response.data;
          for (const teacher of teachers) {
            if (!teacher.avatar) {
              teacher.avatar = this.defaultAvatar;
            }
          }
          return teachers;
        })
      )

      .subscribe(
        teachers => {
          this.teachersChanged.next(teachers);
        },
        error => console.log(error)
      );
  }

  /**
   * Method fetches from the server a single
   * teacher object by provided id
   * @param id - number representing id of requested teacher.
   * @returns - object representing teacher.
   */
  getTeacher(id) {
    return this.httpClient.get<any>(`/teachers/${id}`).pipe(
      map(response => {
        const teacher = response.data;
        teacher.dateOfBirth = teacher.dateOfBirth
          .split('-')
          .reverse()
          .join('.');
        if (!teacher.avatar) {
          teacher.avatar = this.defaultAvatar;
        }
        return teacher;
      })
    );
  }

  /**
   * Method gets id of the teacher to be changed and an object
   * with new values. Then passes it to the server in put request.
   * @param id - number representing id of the teacher.
   * @param teacher - object with new values.
   * @returns - object representing teacher.
   */
  updateTeacher(id, updTeacher) {
    return this.httpClient.put<any>(`/admin/teachers/${id}`, updTeacher).pipe(
      map(response => {
        const teacher = response.data;
        if (!teacher.avatar) {
          teacher.avatar = this.defaultAvatar;
        }
        return teacher;
      })
    );
  }

  /**
   * Method gets id of the teacher to be deleted
   * and passes it to the server in patch request.
   * @param id - number representing id of the teacher.
   * @returns - object representing deleted teacher.
   */
  deleteTeacher(id) {
    return this.httpClient.patch<any>(`/users/${id}`, { observe: 'response' });
  }

  /**
   * Method gets object representing a teacher to be created
   * and passes it to the server in post request
   * @param newTeacher - object with new values.
   * @returns - object representing newly created teacher.
   */
  addTeacher(newTeacher) {
    return this.httpClient.post(`/teachers`, newTeacher);
  }

  /**
   * Method fetches journal by given id, groups subjects by classes
   * and returns the result.
   * @param teacherId - number representing id of the journal.
   * @returns - an array of objects with subjects grouped by classes.
   */
  getTeacherJournal(teacherId) {
    return this.httpClient.get<any>(`/journals/teachers/${teacherId}`).pipe(
      map(response => {
        const journalData = {};
        for (const item of response.data) {
          if (journalData[item.idClass]) {
            journalData[item.idClass].subjectName.push(item.subjectName);
            continue;
          }
          journalData[item.idClass] = {
            className: item.className,
            subjectName: [item.subjectName],
            academicYear: item.academicYear
          };
        }

        return Object.values(journalData);
      })
    );
  }
}
