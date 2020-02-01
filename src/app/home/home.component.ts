import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { LeaderService } from '../services/leader.service'
import { Leader } from '../shared/leader';
import { baseURL } from '../shared/baseurl';
import { flyInOut, expand } from '../animations/app.animations'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host:{
    '[@flyInOut]':'true',
    'style': 'display: block;'
  },
  animations:[
    flyInOut(),
    expand()
  ]
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrMess: string;
  promotion: Promotion;
  promotionErrMess: string;
  leader: Leader;
  leaderErrMess: string;

  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderservice: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe( dish => this.dish = dish, errMess => this.dishErrMess = <any>errMess);
    this.promotionService.getFeaturedPromotion().subscribe( promotion => {this.promotion = promotion; console.log(promotion)}, errMess => this.promotionErrMess = <any>errMess);
    this.leaderservice.getFeaturedLeader().subscribe( leader => this.leader = leader, errMess => this.leaderErrMess = <any>errMess);
  }

}
