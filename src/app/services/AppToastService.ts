import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AppToastService {
  constructor(private toastrService: ToastrService) {}

  toastConfigs = {
    positionClass: 'toast-top-right',
    preventDuplicates: true,
    closeButton: true,
    timeOut: 10000,
    extendedTimeOut: 5000,
  };

  success(message: string) {
    this.toastrService.success(message, 'Success', this.toastConfigs);
  }

  warning(message: string) {
    this.toastrService.warning(message, 'Warning', this.toastConfigs);
  }

  error(message: string) {
    this.toastrService.error(message, 'Error', this.toastConfigs);
  }
}
