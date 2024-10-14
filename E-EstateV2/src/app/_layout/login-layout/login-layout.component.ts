import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.css']
})
export class LoginLayoutComponent {

  constructor(private sanitizer: DomSanitizer) { }

  downloadFileAdmin() {
    const fileName = 'assets/User Manual CompanyAdmin RRIMestet.pdf' // Path to the file in the assets folder

    // Load the file using Angular's DomSanitizer
    this.sanitizer.bypassSecurityTrustResourceUrl(fileName)

    // Create an anchor element to trigger the download
    const a = document.createElement('a')
    a.href = fileName;
    a.target = '_blank'; // Opens the link in a new tab
    a.download = 'User Manual Company Admin RRIMestet.pdf' // Set the desired filename

    // Trigger a click event on the anchor element
    a.click()
  }

  downloadFileClerk(){
    const fileName = 'assets/User Manual EstateClerk RRIMestet.pdf' // Path to the file in the assets folder

    // Load the file using Angular's DomSanitizer
    this.sanitizer.bypassSecurityTrustResourceUrl(fileName)

    // Create an anchor element to trigger the download
    const a = document.createElement('a')
    a.href = fileName;
    a.target = '_blank'; // Opens the link in a new tab
    a.download = 'User Manual Estate Clerk RRIMestet.pdf' // Set the desired filename

    // Trigger a click event on the anchor element
    a.click()
  }

}
