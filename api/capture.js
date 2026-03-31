export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  // Utiliza as mesmas variáveis de ambiente já usadas no bot
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    return res.status(500).json({ error: 'Configuração do banco de dados ausente na Vercel' });
  }

  try {
    // Fazemos um POST direto na API REST do Supabase para não precisar instalar bibliotecas pesadas no frontend
    const response = await fetch(`${url}/rest/v1/nc_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error:', errorText);
      throw new Error('Falha ao salvar no banco de dados');
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('API Capture Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
