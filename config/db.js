const dotenv = require('dotenv');
dotenv.config();

const { createClient } = require('@supabase/supabase-js');

const url = process.env.URL;
const key = process.env.KEY;

const cliente = createClient(url, key);

module.exports = cliente;
