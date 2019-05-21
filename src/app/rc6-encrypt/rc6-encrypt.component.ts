import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-rc6-encrypt',
  templateUrl: './rc6-encrypt.component.html',
  styleUrls: ['./rc6-encrypt.component.scss']
})
export class Rc6EncryptComponent implements OnInit {

  result: string = "El resultado aqui"

  constructor() { }

  ngOnInit() {
  }

}
