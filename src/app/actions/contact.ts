'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { sanitizeText } from '@/lib/utils/sanitize';

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // 3 submissions per minute

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return false;
    }

    record.count++;
    return true;
}

export async function submitContactForm(formData: FormData): Promise<{ success: boolean; message: string }> {
    try {
        // Get IP for rate limiting
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for')?.split(',')[0] ||
            headersList.get('x-real-ip') ||
            'unknown';

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return {
                success: false,
                message: 'Has enviado demasiados mensajes. Por favor, espera un momento antes de intentar de nuevo.',
            };
        }

        // Extract and sanitize form data
        const name = sanitizeText(formData.get('name')?.toString() || '');
        const email = formData.get('email')?.toString().toLowerCase().trim() || '';
        const message = sanitizeText(formData.get('message')?.toString() || '');

        // Validate
        if (!name || name.length < 2 || name.length > 100) {
            return {
                success: false,
                message: 'Por favor, ingresa un nombre válido (2-100 caracteres).',
            };
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return {
                success: false,
                message: 'Por favor, ingresa un correo electrónico válido.',
            };
        }

        if (!message || message.length < 10 || message.length > 2000) {
            return {
                success: false,
                message: 'Por favor, ingresa un mensaje válido (10-2000 caracteres).',
            };
        }

        // Save to database
        const supabase = await createClient();

        const { error } = await supabase
            .from('contact_submissions')
            .insert({
                name,
                email,
                message,
                ip_address: ip,
            });

        if (error) {
            console.error('Error saving contact submission:', error);
            return {
                success: false,
                message: 'Ha ocurrido un error. Por favor, intenta de nuevo más tarde.',
            };
        }

        return {
            success: true,
            message: '¡Gracias por tu mensaje! Te responderemos lo antes posible.',
        };
    } catch (error) {
        console.error('Contact form error:', error);
        return {
            success: false,
            message: 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.',
        };
    }
}
