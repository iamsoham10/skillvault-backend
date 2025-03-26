import {Component, ViewChild, ElementRef, inject} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile-upload',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './profile-upload.component.html',
  styleUrl: './profile-upload.component.css',
})
export class ProfileUploadComponent {
  faUpload = faUpload;
  private router = inject(Router);

  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedImage: string | ArrayBuffer | null = null;

  onUploadClick() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onRemoveClick() {
    this.selectedImage = null;
  }

  onSkipForNow(){
    this.selectedImage = null;
    this.router.navigate(['/dashboard'])
  }
}
