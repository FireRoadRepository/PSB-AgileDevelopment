import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../models/user.model';
import { Trans } from '../../models/trans.model';
import { AuthService } from '../../services/auth/auth.service';
import { TransService } from '../../services/trans/trans.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  closeResult: string;
  
  trans: Trans = {
    date: 0,
    type: '',
    amount: 0,
    category: 'None',
    uid: '',
  }

  transDB: Trans[];

  userTemp: User = {
    uid: '',
    email: '',
    photoURL: '',
    displayName: '',
    income: 0,
    expenses: 0
  }

  constructor(public auth: AuthService, 
    private transService: TransService,
    private modalService: NgbModal,
    private afAuth: AngularFireAuth) {
      this.afAuth.auth.onAuthStateChanged(user => {
        if (user) {
          this.userTemp.uid = user.uid;
          this.userTemp.email = user.email;
          this.userTemp.photoURL = user.photoURL;
          this.userTemp.displayName = user.displayName;
          this.trans.uid = user.uid;
        }
      })
    }

  ngOnInit() {

    this.transService.getTrans().pipe(map(transDBTemp => transDBTemp.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())))
      .subscribe(transDBTemp => {
      this.transDB = transDBTemp;
    })

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    var ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
  }

  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  
  addIncome() {
    if (this.trans.amount > 0) {
      this.userTemp.income += this.trans.amount;
      this.auth.updateUserData(this.userTemp);
      this.trans.date = Date.now();
      this.trans.type = 'Income';
      this.transService.addTrans(this.trans);
      this.trans.category = 'None';
      this.trans.amount = 0;
    }
  }

  addExpense() {
    if (this.trans.amount > 0) {
      this.userTemp.expenses += this.trans.amount;
      this.auth.updateUserData(this.userTemp);
      this.trans.date = Date.now();
      this.trans.type = 'Expense';
      this.transService.addTrans(this.trans);
      this.trans.category = 'None';
      this.trans.amount = 0;
    }
  }
}
