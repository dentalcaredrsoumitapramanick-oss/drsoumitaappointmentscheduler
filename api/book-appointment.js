// api/book-appointment.js (Vercel format)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { fullName, phone, appointmentDate, timeSlot } = req.body;

    try {
        // ১. পেশেন্ট টেবিলে ডেটা ইনসার্ট
        const { data: patientData, error: patientError } = await supabase
            .from('patients')
            .insert([{ full_name: fullName, phone: phone }])
            .select();

        if (patientError) throw patientError;

        const patientId = patientData[0].id;

        // ২. অ্যাপয়েন্টমেন্ট টেবিলে ডেটা ইনসার্ট
        const { error: appointmentError } = await supabase
            .from('appointments')
            .insert([{
                patient_id: patientId,
                appointment_date: appointmentDate,
                time_slot: timeSlot,
                status: 'Pending'
            }]);

        if (appointmentError) throw appointmentError;

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
