import { Injectable } from '@nestjs/common';
import FormData from "form-data";
import axios from "axios";

@Injectable()
export class SmsService {
    async sendSMS(phone_number: string, otp: string) {
        const data = new FormData();
        data.append("mobile_phone", phone_number);
        data.append("message", "Bu Eskiz dan test");//otp
        data.append("from", "4546");
        console.log(process.env.SMS_SERVICE_URL);

        const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: process.env.SMS_SERVICE_URL,
            headers: {
                Authorization: `Bearer ${process.env.SMS_TOKEN}`,
            },
            data: data,
        }

        try {
            const response = await axios(config);
            return response;
        } catch (error) {
            console.log(error)
            return { status: 500 };
        }

    }

    // async refreshToken() {}
    // async getToeken() {}
}
