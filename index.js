
const readline = require("readline");
const crypto = require('crypto');

class EmailOTPModule {

    STATUS_EMAIL_OK = "Email containing OTP has been sent successfully."
    STATUS_EMAIL_FAIL = "Email address does not exist or sending to the email has failed."
    STATUS_EMAIL_INVALID = "Email address is invalid."
    STATUS_OTP_OK = "OTP is valid and checked"
    STATUS_OTP_FAIL = "OTP is wrong"
    STATUS_OTP_ATTEMPTS_REACHED = "Maximum attaempts reached"
    STATUS_OTP_TIMEOUT = "OTP timeout"
    otp = '';
    constructor() {
    }


    start() {
        console.log('Start')
    }

    close() {
        console.log('Close')
    }

    /**
     * Creating random numbers from 1 to 999999
     * with the length of 6
     * @returns 
     */
    generateRandomSixDigitNumber() {
        return crypto.randomInt(0, 999999).toString().padStart(6, '0')
    }

    /**
     * Generate the 6 digits Otp for the email
     * @param {User Email} email 
     * @returns 
     */
    generateOTPEmail(email) {
        // Check the email is valid
        if (!email.endsWith('.dso.org.sg')) {
            return this.STATUS_EMAIL_INVALID;
        }

        this.otp = this.generateRandomSixDigitNumber();
        const message = `You OTP Code is ${this.otp}. The code is valid for 1 minute`; //Response Body

        // Returnt the status of the Email
        return this.sendEmail(email, message)
    }

    /**
     * Send the email to user if there are no errors
     * Assuming there is a function to send the mail and get the response
     * OK or Failed
     * @param {User Email} email 
     * @param {Response Body} message 
     * @returns 
     */
    sendEmail(email, message) {
        if (email) {
            console.log(message);
            return this.STATUS_EMAIL_OK;
        }
        return this.STATUS_EMAIL_FAIL;
    }

    /**
     * check for the otp with input stream until conditions meet
     * @param {readline} rl 
     */
    checkOtp(rl) {
        let attaempts = 0;

        return new Promise((resolve, reject) => {

            // Time out in one minute after a otp is generated
            setTimeout(() => {
                console.log(this.STATUS_OTP_TIMEOUT);
                reject()
                return
            }, 60000);

            // Created an arrow function for recursive calls
            const checkOtpConditions = () => {

                // Check for the attempts
                if (attaempts >= 10) {
                    console.log(this.STATUS_OTP_ATTEMPTS_REACHED);
                    reject()
                    return
                }

                // Delaying the function after a user input
                setTimeout(() => {
                    // Listen for the User Input
                    rl.question('Enter OTP: ', (userOTP) => {
                        attaempts++;

                        // If Correct OTP is entered then returns
                        if (this.otp == userOTP) {
                            console.log(this.STATUS_OTP_OK);
                            resolve()
                            return
                        }

                        // Run Until one of the Conditions meet
                        console.log(this.STATUS_OTP_FAIL);
                        checkOtpConditions();
                    });
                }, 500);
            }
            checkOtpConditions();
        })

    }

    createInputListner() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.checkOtp(rl).then(() => {
            rl.close();
        }, () => {
            rl.close();
        });
    }
};

const emailModule = new EmailOTPModule();
const emailStatus = emailModule.generateOTPEmail('abc@domain.dso.org.sg');
if (emailStatus == emailModule.STATUS_EMAIL_OK) {
    emailModule.createInputListner();
}
