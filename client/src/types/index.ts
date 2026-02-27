export type SupportedCurrency = 'BTC' | 'ETH' | 'USDT' | 'BNB' | 'SOL' | 'XRP';
export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TxType = 'DEPOSIT' | 'TRADE' | 'WITHDRAW';
export type TxStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
export type IdType = 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
}

export interface KycRecord {
    _id: string;
    userId: string;
    fullName: string;
    dob: string;
    nationality: string;
    idType: IdType;
    idNumber: string;
    address: string;
    status: KycStatus;
    rejectionReason?: string;
    submittedAt: string;
    reviewedAt?: string;
}

export interface Wallet {
    _id: string;
    userId: string;
    currency: SupportedCurrency;
    address: string;
    balance: number;
}

export interface Transaction {
    _id: string;
    userId: string;
    type: TxType;
    currency: string;
    fromCurrency?: string;
    toCurrency?: string;
    amount: number;
    toAmount?: number;
    fee: number;
    status: TxStatus;
    note?: string;
    createdAt: string;
}

export type PriceMap = Record<SupportedCurrency, number>;
