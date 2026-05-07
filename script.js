const { useState, useEffect } = React;

function AutoDB() {
    // Estados para armazenar dados e configurações
    const [schema, setSchema] = useState(() => JSON.parse(localStorage.getItem('db_schema') || '[]'));
    const [records, setRecords] = useState(() => JSON.parse(localStorage.getItem('db_records') || '[]'));
    const [view, setView] = useState('table'); // table, add, ou schema
    const [searchTerm, setSearchTerm] = useState('');
    const [newField, setNewField] = useState({ name: '', type: 'Texto' });
    const [formData, setFormData] = useState({});

    // Salva automaticamente no LocalStorage sempre que houver mudanças
    useEffect(() => {
        localStorage.setItem('db_schema', JSON.stringify(schema));
        localStorage.setItem('db_records', JSON.stringify(records));
    }, [schema, records]);

    // Função para adicionar nova coluna (campo)
    const addField = () => {
        if (!newField.name.trim()) return;
        const id = 'f_' + Date.now();
        setSchema([...schema, { ...newField, id }]);
        setNewField({ name: '', type: 'Texto' });
    };

    // Função para excluir uma coluna
    const removeField = (id) => {
        setSchema(schema.filter(f => f.id !== id));
    };

    // Função para salvar um novo registro
    const saveRecord = () => {
        const newRecord = { ...formData, _id: Date.now() };
        setRecords([newRecord, ...records]);
        setFormData({});
        setView('table');
    };

    // Função para excluir um registro
    const deleteRecord = (id) => {
        setRecords(records.filter(r => r._id !== id));
    };

    // Lógica de busca
    const filteredRecords = records.filter(r => 
        Object.values(r).some(val => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            {/* Cabeçalho */}
            <div className="header">
                <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '20px' }}>◈ AutoDB</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>SISTEMA ATIVO</div>
            </div>

            {/* Menu de Navegação */}
            <div className="nav-tabs">
                <button className={`nav-tab ${view === 'table' ? 'active' : ''}`} onClick={() => setView('table')}>DADOS</button>
                <button className={`nav-tab ${view === 'add' ? 'active' : ''}`} onClick={() => setView('add')}>+ NOVO</button>
                <button className={`nav-tab ${view === 'schema' ? 'active' : ''}`} onClick={() => setView('schema')}>CONFIGURAÇÕES</button>
            </div>

            <div className="container">
                {/* Visualização da Tabela */}
                {view === 'table' && (
                    <div className="card">
                        <input 
                            placeholder="🔍 Buscar registros..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div style={{overflowX: 'auto'}}>
                            <table>
                                <thead>
                                    <tr>
                                        {schema.map(f => <th key={f.id}>{f.name.toUpperCase()}</th>)}
                                        <th>AÇÕES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecords.map(r => (
                                        <tr key={r._id}>
                                            {schema.map(f => <td key={f.id}>{r[f.id] || '—'}</td>)}
                                            <td>
                                                <button onClick={() => deleteRecord(r._id)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>Excluir</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Configuração de Campos */}
                {view === 'schema' && (
                    <div className="card">
                        <h3>Estruturar Banco de Dados</h3>
                        <div style={{display: 'flex', gap: '10px'}}>
                                                                  <input
                                                                  placeholder="Ex: Nome, Telefone, Status" value={newField.name} onChange={e => setNewField({...newField, name: e.target.value})} />
                            <select value={newField.type} onChange={e => setNewField({...newField, type: e.target.value})}>
                                <option>Texto</option>
                                <option>Número</option>
                                <option>Data</option>
                            </select>
                            <button className="btn btn-primary" onClick={addField}>Criar Campo</button>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            {schema.map(f => (
                                <div key={f.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)'}}>
                                    <span>{f.name} ({f.type})</span>
                                    <button onClick={() => removeField(f.id)} style={{color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer'}}>✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Formulário de Inserção */}
                {view === 'add' && (
                    <div className="card">
                        <h3>Novo Registro</h3>
                        {schema.length === 0 ? <p>Crie campos primeiro nas Configurações.</p> : (
                            <div>
                                {schema.map(f => (
                                    <div key={f.id}>
                                        <label style={{fontSize: '12px', color: 'var(--muted)'}}>{f.name}</label>
                                        <input 
                                            type={f.type === 'Número' ? 'number' : f.type === 'Data' ? 'date' : 'text'} 
                                            onChange={e => setFormData({...formData, [f.id]: e.target.value})}
                                        />
                                    </div>
                                ))}
                                <button className="btn btn-primary" style={{width: '100%'}} onClick={saveRecord}>Salvar Dados</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// Renderiza o App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AutoDB />);