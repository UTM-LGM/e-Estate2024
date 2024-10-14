import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SpinnerService } from '../_services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  showSpinner = false

  constructor(
    private spinnerService: SpinnerService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.spinnerService.getSpinnerObserver()
      .subscribe(
        Response => {
          this.showSpinner = Response === 'start'
          this.cdRef.detectChanges()
        });
  }
}
