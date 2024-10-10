import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeUrlService } from '../_services/safe-url.service';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environments';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FieldService } from '../_services/field.service';
import { SharedService } from '../_services/shared.service';
import { FieldAttachmentService } from '../_services/field-attachment.service';
import { FieldAttachment } from '../_interface/field-attachment';

@Component({
  selector: 'app-field-grant-attachment',
  templateUrl: './field-grant-attachment.component.html',
  styleUrls: ['./field-grant-attachment.component.css']
})
export class FieldGrantAttachmentComponent implements OnInit {

  files: any[] = [];
  newFiles: File[] = [];
  @Output() filesUpdated: EventEmitter<File[]> = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput!: ElementRef;

  isUpdating: boolean

  baseUrl = environment.apiUrl
  fileAttachments: any[] = []
  fieldGrantId: number
  newFile : File | null = null;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private safeUrlService: SafeUrlService,
    public dialogRef: MatDialogRef<FieldGrantAttachmentComponent>,
    private sanitizer: DomSanitizer,
    private fieldService: FieldService,
    private sharedService: SharedService,
    private fieldAttachmentService: FieldAttachmentService,
  ) {
    this.files = data.files;
    this.isUpdating = data.isUpdating;
    this.fieldGrantId = data.fieldGrantId;
  }

  ngOnInit(): void {
    this.getFieldAttachments()
  }

  close(): void {
    this.dialogRef.close();
  }


  getFieldAttachments() {
    if (this.fieldGrantId != 0) {
      this.fieldAttachmentService.getFieldAttachment().subscribe(response => {
        // Filter active files for the current fieldGrantId
        const existingFiles = response.filter(x => x.isActive == true && x.fieldGrantId === this.fieldGrantId);

        // Merge existing files with newly added files
        this.fileAttachments = [...existingFiles];
        this.isUpdating = true
      });
    } else {
      // No fieldGrantId, just show the new files
      this.fileAttachments = [...this.files];
      this.isUpdating = false
    }

  }

  getFileUrl(file: any): any {
    if (this.isUpdating && file.fileName) {
      // Existing files from the server
      const fileUrl = this.baseUrl + '/Files/' + file.fileName;
      return this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    } else if (file instanceof File) {
      // New files added via input
      const objectUrl = URL.createObjectURL(file);
      return this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
    }
    return null; // Handle cases where the file might not exist
  }
  


  updateFile(index: number, event: any): void {
    const newFile = event.target.files[0];
    if (newFile && newFile.type === 'application/pdf') {
      this.files[index] = newFile;
      swal.fire({
        title: 'Done!',
        text: 'Attachments successfully updated!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000
      });
    } else {
      swal.fire({
        text: 'Please upload a valid PDF file.',
        icon: 'error'
      });
    }
  }

  updateFileAttachment(attachmentId: number, event: Event): void {
    const fieldGrantId = this.files.find(f => f.id === attachmentId)?.fieldGrantId;
    if(this.newFile != null){
      this.fieldAttachmentService.updateFieldAttachment(this.newFile, fieldGrantId, this.sharedService.userId, attachmentId, true)
      .subscribe(response => {
        swal.fire({
          title: 'Done!',
          text: 'Attachments successfully updated!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.getFieldAttachments()
      }, error => {
        console.error("Upload failed", error);
      });
    }
  }


  deleteFile(index: number): void {
    this.files.splice(index, 1);
    this.filesUpdated.emit(this.files);
    swal.fire({
      title: 'Done!',
      text: 'Attachments successfully deleted!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    });
  }


  deleteFileUpdate(index: number): void {
    this.fieldAttachmentService.deleteFieldAttachment(index)
      .subscribe(response => {
        swal.fire({
          title: 'Done!',
          text: 'Attachments successfully deleted!',
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        });
        this.getFieldAttachments()
      }, error => {
        console.error("Upload failed", error);
      });
  }

  addNewFiles(event: any): void {
    const fileList = Array.from(event.target.files) as File[];
    if (fileList.length > 0) {
      this.newFiles = this.newFiles.concat(fileList);
    }
  }

  addNewFileUpdate(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newFile = input.files[0]; // Store the selected file
    } else {
      this.newFile = null;
    }
  }

  saveNewFiles(): void {
    console.log('hi')
    this.files = this.files.concat(this.newFiles);
    this.newFiles = [];
    this.filesUpdated.emit(this.files);
    swal.fire({
      title: 'Done!',
      text: 'Attachments successfully submitted!',
      icon: 'success',
      showConfirmButton: false,
      timer: 1000
    });
    this.getFieldAttachments()
    this.fileInput.nativeElement.value = '';
  }


  saveNewFilesUpdate(): void {
    // const id = this.files[0]?.fieldGrantId ?? 0;
    // console.log(id, this.newFiles, this.sharedService.userId)
    this.fieldService.addFieldAttachments(this.fieldGrantId, this.newFiles, this.sharedService.userId)
      .subscribe({
        next: () => {
          swal.fire({
            title: 'Done!',
            text: 'Attachments successfully submitted!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          });
          this.fileInput.nativeElement.value = '';
          this.getFieldAttachments()
        }
      })
  }

}
