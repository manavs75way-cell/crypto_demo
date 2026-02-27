import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycApi } from '../../api/kyc.api';
import { KycRecord } from '../../types';
import { useAuth } from '../../context/AuthContext';

const STEPS = ['Personal Info', 'Identity', 'Address', 'Review'];
const ID_TYPES = [
    { value: 'PASSPORT', label: 'Passport' },
    { value: 'NATIONAL_ID', label: 'National ID' },
    { value: 'DRIVERS_LICENSE', label: "Driver's License" },
];

const STEP_FIELDS: Record<number, { key: string; label: string; min: number; message: string }[]> = {
    0: [
        { key: 'fullName', label: 'Full name', min: 2, message: 'Full name must be at least 2 characters' },
        { key: 'dob', label: 'Date of birth', min: 1, message: 'Date of birth is required' },
        { key: 'nationality', label: 'Nationality', min: 1, message: 'Nationality is required' },
    ],
    1: [
        { key: 'idNumber', label: 'ID number', min: 3, message: 'ID number must be at least 3 characters' },
    ],
    2: [
        { key: 'address', label: 'Address', min: 5, message: 'Address must be at least 5 characters' },
    ],
};

export const KycPage = () => {
    const navigate = useNavigate();
    const { user, kycStatus, isLoading, refreshKycStatus } = useAuth();
    const [step, setStep] = useState(0);
    const [kycRecord, setKycRecord] = useState<KycRecord | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [form, setForm] = useState({
        fullName: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        dob: '',
        nationality: '',
        idType: 'PASSPORT',
        idNumber: '',
        address: '',
    });

    useEffect(() => {
        if (!isLoading && kycStatus === 'APPROVED') {
            navigate('/');
        }
    }, [kycStatus, isLoading, navigate]);

    useEffect(() => {
        kycApi.getStatus().then(({ data }) => setKycRecord(data.kyc)).catch(() => null);
    }, []);

    const update = (field: string, value: string) => {
        setForm((f) => ({ ...f, [field]: value }));
        if (fieldErrors[field]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const fields = STEP_FIELDS[currentStep];
        if (!fields) return true;
        const errors: Record<string, string> = {};
        for (const { key, min, message } of fields) {
            const value = form[key as keyof typeof form]?.trim() ?? '';
            if (value.length < min) {
                errors[key] = message;
            }
        }
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((s) => s + 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');
        try {
            const { data } = await kycApi.submit(form);
            setKycRecord(data.kyc);
            await refreshKycStatus();
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Submission failed';
            setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReApply = () => {
        setKycRecord(null);
        setStep(0);
        setError('');
        setFieldErrors({});
    };

    const inputCls = (field: string) =>
        `w-full bg-slate-800 border ${fieldErrors[field] ? 'border-red-500' : 'border-slate-700'} text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors`;
    const labelCls = 'block text-slate-300 text-sm font-medium mb-2';
    const errorCls = 'text-red-400 text-xs mt-1.5';

    // Already approved
    if (kycRecord?.status === 'APPROVED') {
        return (
            <div className="min-h-screen bg-slate-950 flex">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-5xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-white">KYC Approved!</h2>
                        <p className="text-slate-400 mt-2">You can now access all trading features.</p>
                        <button onClick={() => navigate('/')} className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all">Go to Dashboard</button>
                    </div>
                </div>
                <div className="hidden lg:block lg:flex-1 relative">
                    <img src="/bitcoin.webp" alt="Trading platform preview" className="absolute inset-0 w-full h-full object-cover" />
                </div>
            </div>
        );
    }

    if (kycRecord?.status === 'PENDING') {
        return (
            <div className="min-h-screen bg-slate-950 flex">
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center max-w-md w-full">
                        <div className="text-5xl mb-4">⏳</div>
                        <h2 className="text-2xl font-bold text-white mb-2">KYC Under Review</h2>
                        <p className="text-slate-400 mb-4">Your documents have been submitted and are being reviewed by our admin team.</p>
                        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                            <p className="text-indigo-400 text-sm">You will be notified once your KYC has been reviewed. Please check back later.</p>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:flex-1 relative">
                    <img src="/bitcoin.webp" alt="Trading platform preview" className="absolute inset-0 w-full h-full object-cover" />
                </div>
            </div>
        );
    }

    if (kycRecord?.status === 'REJECTED') {
        return (
            <div className="min-h-screen bg-slate-950 flex">
                <div className="flex-1 flex items-center justify-center px-4">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-10 text-center max-w-md w-full">
                        <div className="text-5xl mb-4">❌</div>
                        <h2 className="text-2xl font-bold text-white mb-2">KYC Rejected</h2>
                        <p className="text-slate-400 mb-4">Unfortunately, your KYC application was not approved.</p>
                        {kycRecord.rejectionReason && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-left">
                                <p className="text-red-400 text-xs font-medium mb-1">Rejection Reason</p>
                                <p className="text-red-300 text-sm">{kycRecord.rejectionReason}</p>
                            </div>
                        )}
                        <button
                            onClick={handleReApply}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all"
                        >
                            Re-apply for KYC
                        </button>
                    </div>
                </div>
                <div className="hidden lg:block lg:flex-1 relative">
                    <img src="/bitcoin.webp" alt="Trading platform preview" className="absolute inset-0 w-full h-full object-cover" />
                </div>
            </div>
        );
    }

    const steps: React.ReactElement[] = [
        <div key="step0" className="space-y-5">
            <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" className={inputCls('fullName')} value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="John Doe" />
                {fieldErrors.fullName && <p className={errorCls}>{fieldErrors.fullName}</p>}
            </div>
            <div>
                <label className={labelCls}>Date of Birth</label>
                <input type="date" className={inputCls('dob')} value={form.dob} onChange={(e) => update('dob', e.target.value)} />
                {fieldErrors.dob && <p className={errorCls}>{fieldErrors.dob}</p>}
            </div>
            <div>
                <label className={labelCls}>Nationality</label>
                <input type="text" className={inputCls('nationality')} value={form.nationality} onChange={(e) => update('nationality', e.target.value)} placeholder="e.g. Indian" />
                {fieldErrors.nationality && <p className={errorCls}>{fieldErrors.nationality}</p>}
            </div>
        </div>,
        <div key="step1" className="space-y-5">
            <div>
                <label className={labelCls}>ID Type</label>
                <select className={inputCls('idType')} value={form.idType} onChange={(e) => update('idType', e.target.value)}>
                    {ID_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
            </div>
            <div>
                <label className={labelCls}>ID Number</label>
                <input type="text" className={inputCls('idNumber')} value={form.idNumber} onChange={(e) => update('idNumber', e.target.value)} placeholder="e.g. P1234567" />
                {fieldErrors.idNumber && <p className={errorCls}>{fieldErrors.idNumber}</p>}
            </div>
        </div>,
        <div key="step2" className="space-y-5">
            <div>
                <label className={labelCls}>Residential Address</label>
                <textarea rows={4} className={inputCls('address')} value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="123 Main Street, Mumbai, India" />
                {fieldErrors.address && <p className={errorCls}>{fieldErrors.address}</p>}
            </div>
        </div>,
        <div key="step3" className="space-y-3">
            {[
                ['Full Name', form.fullName],
                ['Date of Birth', form.dob],
                ['Nationality', form.nationality],
                ['ID Type', form.idType],
                ['ID Number', form.idNumber],
                ['Address', form.address],
            ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-3 border-b border-slate-800">
                    <span className="text-slate-400 text-sm">{label}</span>
                    <span className="text-white text-sm font-medium text-right max-w-xs">{value}</span>
                </div>
            ))}
        </div>,
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex">
            <div className="flex-1 flex items-center justify-center px-4 py-10 w-full">
                <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white">Identity Verification</h1>
                        <p className="text-slate-400 mt-2">Complete KYC to unlock trading features</p>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-8">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i <= step ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>{i + 1}</div>
                                {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < step ? 'bg-indigo-600' : 'bg-slate-700'}`} />}
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
                        <h2 className="text-lg font-semibold text-white mb-6">{STEPS[step]}</h2>

                        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">{error}</div>}

                        {steps[step]}

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => { setStep((s) => s - 1); setFieldErrors({}); }} disabled={step === 0}
                                className="px-5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-all"
                            >
                                ← Back
                            </button>
                            {step < STEPS.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all"
                                >
                                    Next →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit} disabled={submitting}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting…' : 'Submit KYC'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden lg:block lg:flex-1 relative">
                <img src="/bitcoin.webp" alt="Trading platform preview" className="absolute inset-0 w-full h-full object-cover" />
            </div>
        </div>
    );
};
