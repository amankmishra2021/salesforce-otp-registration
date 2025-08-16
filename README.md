# Salesforce OTP-Based Account Registration

This project implements a secure OTP-based account registration flow in Salesforce using Lightning Web Components (LWC).

## Features

- Email-based OTP verification
- Multi-step registration process
- Custom OTP verification object
- Secure account creation
- Mobile-responsive design

## Components

1. **OTP Verification Component**
   - Handles email input and OTP verification
   - Multi-step wizard interface
   - Success/error notifications

2. **Account Signup Form**
   - Collects account details after OTP verification
   - Validates input fields
   - Creates account record

3. **Apex Controllers**
   - `OTPService.cls`: Manages OTP generation and verification
   - `AccountSignupController.cls`: Handles account creation

## Custom Objects

### OTP_Verification__c
- Email__c
- OTP__c
- Status__c
- Attempts__c
- Is_Verified__c
- Expiration__c
- Account__c

## Setup Instructions

1. Deploy the components to your Salesforce org:
```bash
sfdx force:source:deploy -p force-app
```

2. Assign the necessary permissions to users

3. Add the components to your Lightning page or community

## Development

To work on this project:

1. Clone the repository
2. Set up your Salesforce DX environment
3. Create a scratch org:
```bash
sfdx force:org:create -f config/project-scratch-def.json -a DevOrg
```
4. Push the source:
```bash
sfdx force:source:push
```

## Contributing

Feel free to submit issues and enhancement requests!
