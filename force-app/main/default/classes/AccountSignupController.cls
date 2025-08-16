public with sharing class AccountSignupController {
    public class SignupException extends Exception {}

    @AuraEnabled
    public static String createAccount(Map<String, Object> details, String email) {
        if (String.isBlank(email)) throw new SignupException('Email required.');

        OTP_Verification__c otpRec = [SELECT Id, Is_Verified__c, Account__c FROM OTP_Verification__c
                                      WHERE Email__c = :email
                                      ORDER BY CreatedDate DESC LIMIT 1];

        if (!otpRec.Is_Verified__c) throw new SignupException('OTP not verified.');

        Account acc = new Account();
        acc.Name = (String)details.get('Name');
        acc.Phone = (String)details.get('Phone');
        acc.Industry = (String)details.get('Industry');
        insert acc;

        otpRec.Account__c = acc.Id;
        update otpRec;

        return JSON.serialize(new Map<String, String>{
            'accountId' => acc.Id,
            'message' => 'Account created successfully.'
        });
    }
}