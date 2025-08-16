# Salesforce OTP-Based Account Registration

A secure, user-friendly account registration system built on Salesforce Lightning Platform. This project implements a modern OTP-based verification flow using Lightning Web Components (LWC) with a focus on security, user experience, and reliability.

## Features

- **Secure Email Verification**
  - One-Time Password (OTP) generation and validation
  - Configurable OTP expiration time
  - Maximum attempt limits to prevent brute force
  - Email-based verification process

- **Multi-step Registration Flow**
  - Step 1: Email Input & OTP Request
  - Step 2: OTP Verification
  - Step 3: Account Information Collection
  - Step 4: Account Creation & Confirmation

- **Enhanced Security**
  - Server-side OTP validation
  - Rate limiting for OTP requests
  - Secure hash storage for OTPs
  - Session management and state tracking

- **User Experience**
  - Mobile-responsive design
  - Clear error messages and validations
  - Progress indicators
  - Success notifications
  - Smooth navigation between steps

- **Technical Features**
  - Modern Lightning Web Components
  - Custom Apex controllers
  - Custom objects for OTP tracking
  - Event-driven architecture
  - Reusable components

## Component Details

### 1. OTP Verification Component (`otpVerification`)
- **Purpose**: Manages the complete OTP verification flow
- **Key Features**:
  - Email input validation
  - OTP request handling
  - Real-time OTP validation
  - Error handling and display
  - Success state management
- **Technical Details**:
  - Uses Lightning Message Service for communication
  - Implements responsive SLDS design
  - Handles multiple states (email input, OTP verification, success)
  - Custom event dispatching for account creation

### 2. Account Signup Form (`accountSignupForm`)
- **Purpose**: Collects and validates account information
- **Key Features**:
  - Dynamic field validation
  - Custom validation rules
  - Auto-formatting inputs
  - Error highlighting
  - Success handling
- **Fields**:
  - Account Name
  - Phone
  - Industry
  - Description
  - Custom fields as needed

### 3. Apex Controllers
#### OTPService.cls
- **Methods**:
  - `generateOTP`: Creates new 6-digit OTP
  - `validateOTP`: Checks OTP validity
  - `handleAttempts`: Manages verification attempts
  - `cleanupExpiredOTPs`: Background cleanup
- **Security Features**:
  - Rate limiting
  - Hash-based OTP storage
  - Attempt tracking
  - Auto-expiration

#### AccountSignupController.cls
- **Methods**:
  - `createAccount`: Handles account creation
  - `validateFields`: Server-side validation
  - `handleDuplicates`: Duplicate checking
  - `processRegistration`: Complete registration flow
- **Features**:
  - Error handling
  - Success response formatting
  - Data sanitization
  - Duplicate prevention

## Custom Objects

### OTP_Verification__c
- **Fields**:
  - `Email__c` (Email): Target email address
  - `OTP__c` (Text[6]): Encrypted OTP value
  - `Status__c` (Picklist): 
    - Pending
    - Verified
    - Expired
    - Failed
  - `Attempts__c` (Number): Verification attempts
  - `Is_Verified__c` (Boolean): Verification status
  - `Expiration__c` (DateTime): OTP validity period
  - `Account__c` (Lookup): Related account record
- **Automation**:
  - Auto-cleanup process
  - Status update triggers
  - Attempt tracking workflow

## Technical Architecture

The solution follows a layered architecture:

1. **Presentation Layer** (LWC)
   - User interface components
   - Client-side validations
   - State management
   - Event handling

2. **Service Layer** (Apex)
   - Business logic
   - Data validation
   - OTP management
   - Account creation

3. **Data Layer**
   - Custom objects
   - Field-level security
   - Data validation rules
   - Automation rules

## Setup Instructions

### Prerequisites
- Salesforce CLI installed
- VS Code with Salesforce Extensions
- DevHub org enabled
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/amankmishra2021/salesforce-otp-registration.git
cd salesforce-otp-registration
```

2. Authenticate with your DevHub:
```bash
sfdx auth:web:login -d -a DevHub
```

3. Create a scratch org:
```bash
sfdx force:org:create -f config/project-scratch-def.json -a OTPDev -s
```

4. Push the source code:
```bash
sfdx force:source:push
```

5. Assign permissions:
```bash
sfdx force:user:permset:assign -n OTP_Registration_Admin
```

6. Open the org:
```bash
sfdx force:org:open
```

### Configuration

1. **Custom Settings**
   - Navigate to Setup → Custom Settings
   - Configure OTP validity period
   - Set maximum attempts allowed
   - Configure email templates

2. **Permission Setup**
   - Create permission sets for different user types
   - Assign object permissions
   - Configure FLS for custom objects

3. **Component Setup**
   - Add components to Lightning pages
   - Configure visibility settings
   - Set up navigation rules

## Development

### Local Development
1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
sfdx force:apex:test:run -c -r human
```

3. Start local development:
```bash
sfdx force:lightning:lwc:start
```

### Best Practices
- Follow Salesforce DX development model
- Use scratch orgs for feature development
- Maintain test coverage above 85%
- Document code changes
- Follow commit message conventions

## Testing

### Automated Tests
- Apex tests for controllers
- Jest tests for LWC
- Integration tests
- Run test suite:
```bash
npm test
```

### Manual Testing
1. Email verification flow
2. OTP validation
3. Account creation
4. Error scenarios
5. Mobile responsiveness

## Deployment

### To Sandbox
```bash
sfdx force:source:deploy -p force-app -u YourSandboxAlias
```

### To Production
```bash
sfdx force:source:deploy -p force-app -u YourProdAlias --checkonly
sfdx force:source:deploy -p force-app -u YourProdAlias
```

## Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

### Guidelines
- Follow Salesforce coding standards
- Include test coverage
- Update documentation
- Add meaningful commit messages

### Development Process
1. Pick an issue/feature
2. Create a branch
3. Develop and test
4. Submit PR
5. Code review
6. Merge

## Support

- Create GitHub Issues for bugs
- Join discussions for feature requests
- Check documentation for common issues
- Contact maintainers for critical issues

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Salesforce DX team
- Lightning Web Components framework
- Community contributors
