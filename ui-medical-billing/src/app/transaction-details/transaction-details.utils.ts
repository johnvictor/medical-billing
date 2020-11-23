export class TransactionDetailsUtils {
    static getTotalAmount(medicalScanDetails: any): number {
        return medicalScanDetails.reduce((total, bill) => total + bill.scanAmount, 0);
    }

    static getTotalDiscount(medicalScanDetails: any): number {
        return medicalScanDetails.reduce((total, bill) => total + (+bill.discount), 0);
    }

    static getBalanceAmount(medicalScanDetails, paymentDetails): number {
        if (paymentDetails && paymentDetails.length) {
            return this.amountToPayAfterDiscount(medicalScanDetails) -
                paymentDetails.reduce((total, bill) => total + (+bill.payableAmount), 0);
        } else {
            return this.amountToPayAfterDiscount(medicalScanDetails);
        }
    }

    static getPaidAmount(paymentDetails): number {
        if (paymentDetails && paymentDetails.length) {
            return paymentDetails.reduce((total, bill) => total + (+bill.payableAmount), 0);
        }
        return 0;
    }

    private static amountToPayAfterDiscount(medicalScanDetails): number {
        return this.getTotalAmount(medicalScanDetails) - this.getTotalDiscount(medicalScanDetails);
    }
}
