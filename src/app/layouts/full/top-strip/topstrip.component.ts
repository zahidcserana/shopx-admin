import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TablerIconsModule } from 'angular-tabler-icons';

@Component({
    selector: 'app-topstrip',
    imports: [TablerIconsModule, MatButtonModule, MatMenuModule],
    templateUrl: './topstrip.component.html',
})
export class AppTopstripComponent {
    constructor() { }

  logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    // this.router.navigate(['/authentication/login']);
    // localStorage.clear();
    window.location.href = '/authentication/login';
  }

}
