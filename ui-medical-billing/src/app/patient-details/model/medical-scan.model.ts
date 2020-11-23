export interface BillingMaster {
    medicalBilling: string;
    maxDiscount: string;
    modality: string;
    scanAmount: number;
}

export interface ModalitySlot {
    noOfSlotsPerDay: number;
    modality: string;
}
