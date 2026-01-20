import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

type Item = { nome: string; quantidade: number };

export default function ProporCotacao() {
  const { cotacaoId } = useParams();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState<number>(1);
    const [items, setItems] = useState<Item[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editNome, setEditNome] = useState('');
    const [editQuantidade, setEditQuantidade] = useState<number>(1);

    function canAdd() {
      return nome.trim().length > 0 && quantidade > 0;
    }

    function addItem() {
      if (!canAdd()) return;
      setItems(prev => [...prev, { nome: nome.trim(), quantidade }]);
      setNome(''); setQuantidade(1);
    }

    function startEdit(idx: number) {
      const it = items[idx];
      setEditIndex(idx);
      setEditNome(it.nome);
      setEditQuantidade(it.quantidade);
    }

    function saveEdit() {
      if (editIndex === null) return;
      if (!editNome.trim() || editQuantidade <= 0) return;
      setItems(prev => prev.map((it, i) => i === editIndex ? { nome: editNome.trim(), quantidade: editQuantidade } : it));
      setEditIndex(null); setEditNome(''); setEditQuantidade(1);
    }

    function cancelEdit() {
      setEditIndex(null); setEditNome(''); setEditQuantidade(1);
    }

    function removeItem(idx: number) {
      setItems(prev => prev.filter((_, i) => i !== idx));
      if (editIndex !== null && idx === editIndex) cancelEdit();
    }

    function enviar() {
      const propostasJson = localStorage.getItem('minhas_propostas') || '[]';
      const propostas = JSON.parse(propostasJson);
      const nova = { id: Date.now(), cotacaoId, items };
      propostas.push(nova);
      localStorage.setItem('minhas_propostas', JSON.stringify(propostas));
      navigate('/portal-fornecedor');
    }

    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Propor para Cotação #{cotacaoId}</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="text-sm">Nome do Medicamento</label>
                  <input className="w-full border rounded px-2 py-1" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Paracetamol 500mg" />
                </div>
                <div style={{width:140}}>
                  <label className="text-sm">Quantidade</label>
                  <input type="number" min={1} className="w-full border rounded px-2 py-1" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} />
                </div>
                <div>
                  <button onClick={addItem} disabled={!canAdd()} className={`px-3 py-1 rounded ${canAdd() ? 'bg-primary text-white' : 'bg-muted-foreground text-white/60 cursor-not-allowed'}`}>Adicionar</button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Dica: pesquise pelo nome e confirme a quantidade antes de adicionar.</div>
            </div>

            <div className="bg-white p-4 rounded shadow-sm">
              <h3 className="font-medium mb-2">Itens da Proposta</h3>
              {items.length === 0 ? (
                <div className="text-sm text-muted-foreground">Nenhum item adicionado.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Qtd.</th>
                      <th className="pb-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-2">
                          {editIndex === i ? (
                            <input className="w-full border rounded px-2 py-1" value={editNome} onChange={(e) => setEditNome(e.target.value)} />
                          ) : (
                            <div className="font-medium">{it.nome}</div>
                          )}
                        </td>
                        <td className="py-2">
                          {editIndex === i ? (
                            <input type="number" min={1} className="w-24 border rounded px-2 py-1" value={editQuantidade} onChange={(e) => setEditQuantidade(Number(e.target.value))} />
                          ) : (
                            <div>{it.quantidade}</div>
                          )}
                        </td>
                        <td className="py-2">
                          {editIndex === i ? (
                            <div className="flex gap-2">
                              <button onClick={saveEdit} className="text-sm text-green-600">Salvar</button>
                              <button onClick={cancelEdit} className="text-sm text-gray-600">Cancelar</button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => startEdit(i)} className="text-sm text-primary">Editar</button>
                              <button onClick={() => removeItem(i)} className="text-sm text-red-600">Remover</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Voltar</button>
              <button onClick={enviar} className="px-4 py-2 bg-green-600 text-white rounded" disabled={items.length===0}>Enviar Proposta</button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-2 rounded shadow-sm">
            <div className="text-sm mb-2">PowerBI (visualização)</div>
            <div style={{height:640}}>
              <iframe title="powerbi" src="https://app.powerbi.com/view?r=eyJrIjoiYjZkZjEyM2YtNzNjYS00ZmQyLTliYTEtNDE2MDc4ZmE1NDEyIiwidCI6ImI2N2FmMjNmLWMzZjMtNGQzNS04MGM3LWI3MDg1ZjVlZGQ4MSJ9&pageName=ReportSection20c576fb69cd2edaea29" style={{width:'100%', height:'100%'}} frameBorder={0} />
            </div>
          </div>
        </div>
      </div>
    );
  }
