import React from 'react';

const POWERBI_URL = 'https://app.powerbi.com/view?r=eyJrIjoiYjZkZjEyM2YtNzNjYS00ZmQyLTliYTEtNDE2MDc4ZmE1NDEyIiwidCI6ImI2N2FmMjNmLWMzZjMtNGQzNS04MGM3LWI3MDg1ZjVlZGQ4MSJ9&pageName=ReportSection20c576fb69cd2edaea29';

export default function FornecedoresPrecos() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Tabela de Preços — Fornecedores</h2>
      <div className="bg-white border rounded overflow-hidden">
        <iframe
          title="Tabela de Preços PowerBI"
          src={POWERBI_URL}
          width="100%"
          height="800"
          frameBorder="0"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          className="block"
        />
      </div>
    </div>
  );
}
