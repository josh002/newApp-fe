import { Component, OnInit } from '@angular/core';
import { CommerceService } from 'src/app/services/commerce.service';
import { Commerce } from 'src/app/models/commerce.model';
import { AlertService } from 'src/app/services/alertService';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { getTime, asDate } from 'src/app/constants/constants';
import * as moment from 'moment';
import { faCommentsDollar } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-get-appointment',
    templateUrl: './get-appointment.page.html',
    styleUrls: ['./get-appointment.page.scss'],
})
export class GetAppointmentPage implements OnInit {
    commerce: Commerce;
    id: number;
    startHour1: number;
    endHour1: number;
    startHour2: number;
    endHour2: number;

    // Arreglo con horas
    hours: number[] = [];

    constructor(
        private commerceService: CommerceService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        // Traer por path params
        this.id = 18;
        for (var i = 0; i < 24; i++) this.hours.push(i);

        this.route.paramMap.subscribe(
            (params: Params) => {
                const commerceId: number = params.params.id;

                this.commerceService.getCommerceById(commerceId)
                    .then((resp: any) => {
                        if (resp.result.length < 1) {
                            this.router.navigate(['/tabs/home']);
                            this.alertService.simpleAlert("Ocurrió un error inesperado. Intente más tarde.");
                        }
                        this.commerce = resp.result[0];
                        console.log(this.commerce);

                        this.startHour1 = asDate(this.commerce.openTime1).getHours();
                        this.endHour1 = asDate(this.commerce.closeTime1).getHours();
                        this.startHour2 = this.commerce.openTime2 === null ? undefined : asDate(this.commerce.openTime2).getHours();
                        this.endHour2 = this.commerce.closeTime2 === null ? undefined : asDate(this.commerce.closeTime2).getHours();
                        if (asDate(this.commerce.closeTime1).getMinutes() > 0) this.endHour1++;
                        if (asDate(this.commerce.closeTime2).getMinutes() > 0) this.endHour2++;

                    })
                    .catch(err => {
                        console.log(err);
                        if (err.error.status === -1) {
                            this.alertService.simpleAlert(err.error.message);
                        } else {
                            this.alertService.simpleAlert("Ocurrió un error inesperado. Intente más tarde.");
                        }
                        this.router.navigate(['/tabs/home']);
                    });
            }
        )
    }

}
