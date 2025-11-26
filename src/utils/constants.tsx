export const PUBLICATION_TYPES = {
    PHOTOGRAPHY: 'Fotografía',
    ILLUSTRATION: 'Ilustración',
    TEXT: 'Texto'
} as const;

export const REPORT_REASONS = {
    SPAM: 'Spam',
    INAPPROPRIATE_CONTENT: 'Contenido inapropiado',
    HARASSMENT: 'Acoso',
    COPYRIGHT: 'Plagio',
    UNMARKED_AI: 'IA sin marcar',
    OTHER: 'Otro'
} as const;

export const MAX_IMAGES = 4;
export const MAX_DESCRIPTION_LENGTH = 256;
export const MAX_TAGS = 30;