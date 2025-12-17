import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';
import { Component, Input } from '@angular/core';
import {Store} from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'custom-show-mmsid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './show-mmsid.component.html',
  styleUrl: './show-mmsid.component.scss'
})
export class ShowMmsidComponent {

}
