import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import sendOTP from '@salesforce/apex/OTPService.sendOTP';
import verifyOTP from '@salesforce/apex/OTPService.verifyOTP';

export default class OtpVerification extends NavigationMixin(LightningElement) {
    @track email = '';
    @track otp = '';
    @track stepEmail = true;
    @track stepOtp = false;
    @track isVerified = false;
    @track error = '';
    @track isLoading = false;
    @track showAccountSuccess = false;
    @track createdAccountId;

    get isEmailEmpty() {
        return !this.email || !this.email.includes('@');
    }

    get isOtpEmpty() {
        return !this.otp || this.otp.length !== 6;
    }

    handleEmailChange(e) {
        this.email = e.target.value;
        this.error = '';
    }

    handleOtpChange(e) {
        this.otp = e.target.value;
        this.error = '';
    }

    changeEmail() {
        this.stepEmail = true;
        this.stepOtp = false;
        this.error = '';
    }

    resetForm() {
        this.email = '';
        this.otp = '';
        this.stepEmail = true;
        this.stepOtp = false;
        this.isVerified = false;
        this.error = '';
        this.showAccountSuccess = false;
        this.createdAccountId = null;
    }

    async sendOtp() {
        this.error = '';
        this.isLoading = true;
        try {
            await sendOTP({ email: this.email });
            
            // Clear previous OTP if any
            if (this.stepOtp) {
                this.otp = '';
                this.showToast('Success', 'New OTP sent successfully', 'success');
            } else {
                this.stepEmail = false;
                this.stepOtp = true;
                this.showToast('Success', 'OTP sent successfully', 'success');
            }
        } catch (err) {
            this.error = err.body.message;
            this.showToast('Error', this.error, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async verifyOtp() {
        this.error = '';
        this.isLoading = true;
        try {
            await verifyOTP({ email: this.email, otp: this.otp });
            this.isVerified = true;
            this.stepOtp = false;
            this.showToast('Success', 'Email verified successfully', 'success');
        } catch (err) {
            this.error = err.body.message;
            this.showToast('Error', this.error, 'error');
        } finally {
            this.isLoading = false;
        }
    }

    handleAccountCreated(event) {
        this.createdAccountId = event.detail.accountId;
        this.showAccountSuccess = true;
        this.showToast('Success', event.detail.message, 'success');
    }

    navigateToAccount() {
        if (this.createdAccountId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: this.createdAccountId,
                    objectApiName: 'Account',
                    actionName: 'view'
                }
            });
        }
    }

    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}