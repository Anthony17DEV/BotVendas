import React from 'react';

const EmpresasList = ({ empresas, isLoading }) => {
    if (isLoading) {
        return <p>Carregando empresas...</p>;
    }

    return (
        <div className="empresa-list">
            <h3>Empresas Cadastradas</h3>
            {empresas.length === 0 ? (
                <p>Nenhuma empresa cadastrada ainda.</p>
            ) : (
                <ul>
                    {empresas.map(empresa => (
                        <li key={empresa.id}>
                            <strong>{empresa.nome}</strong> - {empresa.email} - <span>{empresa.banco_dados}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmpresasList;