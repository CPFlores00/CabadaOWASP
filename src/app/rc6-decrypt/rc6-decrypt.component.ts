import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rc6-decrypt',
  templateUrl: './rc6-decrypt.component.html',
  styleUrls: ['./rc6-decrypt.component.scss']
})
export class Rc6DecryptComponent implements OnInit {

  result: string = "El resultado aqui"

  constructor() { }

  ngOnInit() {
  }

}
