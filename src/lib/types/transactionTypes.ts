export type Transaction = {
    id: string; // UUID generado automáticamente
    repository_id: string; // UUID del repositorio
    sender_id?: string | null; // Puede ser nulo si se elimina el usuario
    receiver_id: string; // UUID del propietario del repositorio
    amount: number;
    transaction_type: 'donation' | 'purchase';
    status: 'pending' | 'completed' | 'failed';
    tx_hash?: string; // Para futuras integraciones con Solana
    created_at: string;
    updated_at: string;
};
