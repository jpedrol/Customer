// index.js
const express = require('express');
const dotenv = require('dotenv');
const cliente = require('./config/db.js');

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();

app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('API Customers rodando 🚀');
});

// LISTAR TODOS
app.get('/clientes', async (req, res) => {
    try {
        const { data, error } = await cliente
            .from('customers')
            .select('*');

        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro ao buscar clientes.' });
        }

        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// BUSCAR POR ID
app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { data, error } = await cliente
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error(error);
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        return res.json(data);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// CRIAR
app.post('/clientes', async (req, res) => {
    const novoCliente = req.body;

    try {
        const { data, error } = await cliente
            .from('customers')
            .insert(novoCliente)
            .select();

        if (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao criar cliente.' });
        }

        return res.status(201).json(data[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// ATUALIZAR
app.put('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const dadosAtualizados = req.body;

    try {
        const { data, error } = await cliente
            .from('customers')
            .update(dadosAtualizados)
            .eq('id', id)
            .select();

        if (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao atualizar cliente.' });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        return res.json(data[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

// DELETAR
app.delete('/clientes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await cliente
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao deletar cliente.' });
        }

        return res.status(204).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro inesperado no servidor.' });
    }
});

const porta = process.env.PORTA || 3000;

app.listen(porta, () => {
    console.log(`Executando ... http://localhost:${porta}`);
});
