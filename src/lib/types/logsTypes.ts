export type SystemLog = {
    id: string; // UUID generado automáticamente
    event_type: string;
    description: string;
    metadata: Record<string, any>; // JSONB
    severity: 'info' | 'warn' | 'error' | 'critical';
    created_at: string;
};


export type UserLog = {
    id: string; // UUID generado automáticamente
    user_id?: string | null; // Puede ser nulo si el usuario es eliminado
    event_type: string;
    description: string;
    metadata: Record<string, any>; // JSONB
    ip_address?: string;
    user_agent?: string;
    created_at: string;
};
