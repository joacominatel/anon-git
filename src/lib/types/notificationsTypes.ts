export type Notification = {
    id: string; // UUID generado automáticamente
    user_id: string; // UUID del destinatario
    title: string;
    content: string;
    type: string; // Puedes definir un enum si se requiere
    read: boolean;
    related_entity_id?: string;
    related_entity_type?: string;
    created_at: string;
};
