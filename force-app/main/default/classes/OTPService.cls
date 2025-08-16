public with sharing class OTPService {
    public class OTPException extends Exception {}

    @AuraEnabled
    public static String sendOTP(String email) {
        if (String.isBlank(email)) throw new OTPException('Email is required.');

        String otp = String.valueOf(Math.mod(Math.abs(Crypto.getRandomInteger()), 1000000)).leftPad(6, '0');
        DateTime expiration = DateTime.now().addMinutes(10);

        OTP_Verification__c otpRec = new OTP_Verification__c(
            Email__c = email,
            OTP__c = otp,
            Is_Verified__c = false,
            Expiration__c = expiration,
            Attempts__c = 0,
            Status__c = 'Generated'
        );
        insert otpRec;

        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setToAddresses(new String[] { email });
        mail.setSubject('Your OTP Code');
        mail.setPlainTextBody('Your OTP is: ' + otp + '. It expires in 10 minutes.');
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });

        otpRec.Status__c = 'Sent';
        update otpRec;

        return 'OTP Sent';
    }

    @AuraEnabled
    public static Boolean verifyOTP(String email, String otp) {
        if (String.isBlank(email) || String.isBlank(otp)) throw new OTPException('Email and OTP required.');

        OTP_Verification__c otpRec = [SELECT Id, OTP__c, Expiration__c, Attempts__c, Is_Verified__c, Status__c
                                      FROM OTP_Verification__c
                                      WHERE Email__c = :email
                                      ORDER BY CreatedDate DESC LIMIT 1];

        if (otpRec.Is_Verified__c) throw new OTPException('OTP already verified.');
        if (otpRec.Status__c == 'Expired') throw new OTPException('OTP expired.');
        if (otpRec.Attempts__c >= 5) throw new OTPException('Maximum attempts exceeded.');
        if (DateTime.now() > otpRec.Expiration__c) {
            otpRec.Status__c = 'Expired';
            update otpRec;
            throw new OTPException('OTP expired.');
        }

        otpRec.Attempts__c += 1;

        if (otpRec.OTP__c == otp) {
            otpRec.Is_Verified__c = true;
            otpRec.Status__c = 'Verified';
            update otpRec;
            return true;
        } else {
            update otpRec;
            throw new OTPException('Invalid OTP.');
        }
    }
}