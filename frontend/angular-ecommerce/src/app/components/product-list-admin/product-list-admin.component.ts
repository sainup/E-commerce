import { Component} from '@angular/core';
import { ProductListComponent } from '../product-list/product-list.component'
  import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
@Component({
  selector: 'app-product-list-admin',
  templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list-admin.component.css']
})
export class ProductListAdminComponent extends ProductListComponent {

  

  
}
