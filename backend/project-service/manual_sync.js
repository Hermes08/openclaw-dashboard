
        const { Client } = require('pg');
        const client = new Client({
            user: 'admin',
            host: 'localhost',
            database: 'openclaw_dashboard',
            password: 'password',
            port: 5432,
        });

        async function run() {
            await client.connect();
            await client.query(`
                INSERT INTO project (id, name, description, status, branch, "createdAt", "updatedAt")
                VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
                ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
            `, [
                '782e4f01-5d9c-4f1a-b0c4-9d1a2b3c4d5e', 
                'Panama Real Estate Sale', 
                'Luxury Real Estate Panama Site Audit', 
                'active', 
                'main'
            ]);
            
            // Add a task directly to workflows
            const task = {
                id: 'sync-manual-' + Date.now(),
                title: 'SEORolodex Audit Sync',
                description: 'Verifying task visibility on Netlify.',
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            
            await client.query(
                "UPDATE project SET workflows = jsonb_set(COALESCE(workflows::jsonb, '[]'::jsonb), '{0}', $1::jsonb, true) WHERE id = $2",
                [JSON.stringify(task), '782e4f01-5d9c-4f1a-b0c4-9d1a2b3c4d5e']
            );
            
            await client.end();
            console.log("DB_SYNC_COMPLETE");
        }
        run();
        