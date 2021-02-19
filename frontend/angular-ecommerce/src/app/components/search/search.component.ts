import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  doSearch(value:string){
    
    console.log(`value=${value}`);
    //trims any trailing or before white spaces
    value = value.trim();

    //checks if value is empty and with no whitespace
    if(/\S/.test(value)){
      this.router.navigateByUrl(`/search/${value}`);
    }
    
  }

}
