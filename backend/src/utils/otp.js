function generateOtp(){
    return Math.floor(100000+Math.random()*900000).toString()
}



function getOtpHtml(otp)
{
     return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>OTP Verification</title>
        </head>

        <body>
            <h2>Verify Your Email</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>This OTP will expire in 5 minutes.</p>

            <p>If you did not request this OTP, ignore this email.</p>
        </body>
        </html>
   ` ;
}
export {generateOtp ,getOtpHtml}

