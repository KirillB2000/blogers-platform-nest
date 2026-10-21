import { Injectable } from "@nestjs/common"

@Injectable()
export class EmailExamples {
    registrationEmail(code: string) {
        return `<h1>Thank you for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
 </p>`
    }

    recoveryPasswordEmail(recoveryCode: string) {
        return `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`
    }
}