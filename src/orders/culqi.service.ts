import { Injectable, HttpService } from "@nestjs/common";
import { CulquiChargeDto } from "./dto";

@Injectable()
export class CulqiService {

    constructor(private readonly httpService: HttpService) { }

    charge(data: CulquiChargeDto) {
        return this.httpService.post<{ id: string }>('https://api.culqi.com/v2/charges', data, {
            headers: { Authorization: 'Bearer sk_test_fN0qO9LMD74O1IVE' }
        }).toPromise();
    }
}
