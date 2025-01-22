import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_SUPABASE_URL,
    process.env.SUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { firstname, lastname, email, phone, ebook } = req.body;
        
        // Vérifie si l'utilisateur existe déjà
        const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('email', email)
            .single();

        if (!existingUser) {
            // Si l'utilisateur n'existe pas, on l'ajoute
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    { firstname, lastname, email, phone, ebook, created_at: new Date().toISOString(), last_access: new Date().toISOString() }
                ]);

            if (insertError) throw insertError;
        } else {
            // Si l'utilisateur existe, on met à jour son dernier accès
            const { error: updateError } = await supabase
                .from('users')
                .update({ 
                    last_access: new Date().toISOString(),
                    ebook 
                })
                .eq('email', email);

            if (updateError) throw updateError;
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ success: false, error: 'Database Error' });
    }
}
