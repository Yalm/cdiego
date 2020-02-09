import { Injectable, HttpService } from "@nestjs/common";
import { CulquiChargeDto, CulqiResponseChargeDto } from "./dto";

@Injectable()
export class CulqiService {

    constructor(private readonly httpService: HttpService) { }

    charge(data: CulquiChargeDto) {
        return this.httpService.post<CulqiResponseChargeDto>('https://api.culqi.com/v2/charges', data, {
            headers: { Authorization: 'Bearer sk_test_fN0qO9LMD74O1IVE' }
        }).toPromise().then(({ data }) => data);
    }
}
