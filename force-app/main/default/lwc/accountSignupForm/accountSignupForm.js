import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import createAccount from '@salesforce/apex/AccountSignupController.createAccount';
import INDUSTRY_FIELD from '@salesforce/schema/Account.Industry';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

export default class AccountSignupForm extends LightningElement {
    @api email;
    @track name = '';
    @track phone = '';
    @track industry = '';
    @track isLoading = false;
    @track error = '';
    @track industryOptions = [];

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    accountObjectInfo;

    @wire(getPicklistValues, { recordTypeId: '$accountObjectInfo.data.defaultRecordTypeId', fieldApiName: INDUSTRY_FIELD })
    handlePicklistValues({ error, data }) {
        if (data) {
            this.industryOptions = data.values;
        } else if (error) {
            this.error = error.message;
        }
    }

    get isFormInvalid() {
        return !this.name || this.name.length < 2;
    }

    handleNameChange(e) { 
        this.name = e.target.value;
        this.error = '';
    }
    
    handlePhoneChange(e) { 
        this.phone = e.target.value;
        this.error = '';
    }
    
    handleIndustryChange(e) { 
        this.industry = e.target.value;
        this.error = '';
    }

    async createAccount() {
        this.error = '';
        this.isLoading = true;
        try {
            const result = await createAccount({
                details: { 
                    Name: this.name, 
                    Phone: this.phone, 
                    Industry: this.industry 
                },
                email: this.email
            });
            
                        // Parse the result to get the account ID
            const response = JSON.parse(result);
            
            // Clear form values
            this.name = '';
            this.phone = '';
            this.industry = '';
            
            // Dispatch success event with account ID and message
            this.dispatchEvent(new CustomEvent('accountcreated', {
                detail: {
                    accountId: response.accountId,
                    message: response.message
                },
                bubbles: true,
                composed: true
            }));
            
        } catch (err) {
            this.error = err.body.message;
            this.showToast('Error', this.error, 'error');
        } finally {
            this.isLoading = false;
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