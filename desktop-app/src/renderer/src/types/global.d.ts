export {};

declare global {
  interface Window {
    electron: {
      db: {
        createPatient: (data: any) => Promise<any>;
        getPatients: () => Promise<any[]>;
        getPatientByPhone: (phone: string) => Promise<any>;
        createBooking: (data: any) => Promise<any>;
        getBookings: () => Promise<any[]>;
        getTodayBookings: () => Promise<any[]>;
        createSample: (data: any) => Promise<any>;
        getSamples: () => Promise<any[]>;
      };
      sync: {
        syncNow: () => Promise<any>;
        getSyncStatus: () => Promise<any>;
      };
      printer: {
        printReceipt: (data: any) => Promise<void>;
        printBarcode: (barcode: string) => Promise<void>;
      };
    };
  }
}
