import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from '../services/authService';
import apiService from '../services/apiService';
import { FiSearch, FiEdit, FiTrash2, FiPlusCircle, FiArrowLeft } from 'react-icons/fi';
import './Estoque.css'; 

const Estoque = () => {
    const [colunas, setColunas] = useState([]);
    const [dados, setDados] = useState([]);
    const [filtros, setFiltros] = useState({});
    const [busca, setBusca] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const buscarEstoque = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { colunas: colunasAPI, dados: dadosAPI } = await apiService.getEstoque();
            
            const colunasVisiveis = colunasAPI.filter(col => !['id', 'criado_em', 'descricao'].includes(col));
            setColunas(colunasVisiveis);
            setDados(dadosAPI);
        } catch (err) {
            console.error("Erro ao buscar estoque:", err);
            setError("Não foi possível carregar o estoque. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate("/login");
            return;
        }
        buscarEstoque();
    }, [navigate, buscarEstoque]);

    const handleExcluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.")) {
            try {
                await apiService.deleteEstoqueItem(id);
                buscarEstoque(); 
            } catch (err) {
                console.error("Erro ao excluir:", err);
                setError(err.message || "Não foi possível excluir o item.");
            }
        }
    };
    
    const dadosFiltrados = useMemo(() => {
        return dados.filter(item => {
            const buscaValida = item.nome?.toLowerCase().includes(busca.toLowerCase());
            
            const filtrosValidos = Object.entries(filtros).every(([campo, valor]) => {
                if (!valor) return true; 
                return String(item[campo]) === String(valor);
            });

            return buscaValida && filtrosValidos;
        });
    }, [dados, busca, filtros]);
    
    const { camposFiltraveis, opcoesUnicasPorCampo } = useMemo(() => {
        const camposExcluidos = ["id", "imagem_url", "preco", "quantidade", "criado_em", "descricao", "nome"];
        const camposFiltraveis = colunas.filter(c => !camposExcluidos.includes(c) && dados.some(d => d[c]));

        const opcoesUnicasPorCampo = {};
        camposFiltraveis.forEach(campo => {
            const unicos = new Set(dados.map(d => d[campo]).filter(Boolean));
            opcoesUnicasPorCampo[campo] = Array.from(unicos);
        });

        return { camposFiltraveis, opcoesUnicasPorCampo };
    }, [colunas, dados]);


    const formatarCampo = (coluna, valor) => {
        if (coluna === "preco") {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
        }
        if (coluna === "imagem_url" && valor) {
            return <img src={`${process.env.REACT_APP_API_BASE_URL}/uploads/${valor}`} alt="Produto" className="tabela-imagem" />;
        }
        return valor || "-";
    };

    return (
        <div className="container-estoque">
            <header className="estoque-header">
                <h2 className="titulo-pagina">📦 Gerenciamento de Estoque</h2>
                <div className="acoes-header">
                    <button onClick={() => navigate("/cadastrar-item")} className="botao-primario">
                        <FiPlusCircle /> Cadastrar Novo Item
                    </button>
                    <button onClick={() => navigate("/dashboard")} className="botao-secundario">
                        <FiArrowLeft /> Voltar ao Dashboard
                    </button>
                </div>
            </header>
            
            <div className="painel-filtros">
                <div className="input-com-icone">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Buscar por nome do produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="form-input"
                    />
                </div>
                {camposFiltraveis.map((campo) => (
                    <select
                        key={campo}
                        onChange={e => setFiltros(prev => ({ ...prev, [campo]: e.target.value }))}
                        value={filtros[campo] || ""}
                        className="form-select"
                    >
                        <option value="">Todos ({campo.replace("_", " ")})</option>
                        {opcoesUnicasPorCampo[campo].map((opcao) => (
                            <option key={opcao} value={opcao}>{opcao}</option>
                        ))}
                    </select>
                ))}
            </div>

            <div className="container-tabela">
                {isLoading ? (
                    <p>Carregando estoque...</p>
                ) : error ? (
                    <div className="notification error">{error}</div>
                ) : (
                    <table className="tabela-estoque">
                        <thead>
                            <tr>
                                {colunas.map((col) => <th key={col}>{col.replace(/_/g, " ")}</th>)}
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dadosFiltrados.length > 0 ? dadosFiltrados.map((item) => (
                                <tr key={item.id}>
                                    {colunas.map((col) => (
                                        <td key={`${item.id}-${col}`} data-label={col.replace(/_/g, " ")}>
                                            <span className={item.quantidade <= 3 && col === 'quantidade' ? 'alerta-estoque-baixo' : ''}>
                                                {formatarCampo(col, item[col])}
                                            </span>
                                        </td>
                                    ))}
                                    <td data-label="Ações">
                                        <div className="acoes-tabela">
                                            <button onClick={() => navigate(`/editar-item/${item.id}`)} className="botao-acao editar">
                                                <FiEdit />
                                            </button>
                                            <button onClick={() => handleExcluir(item.id)} className="botao-acao deletar">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={colunas.length + 1}>Nenhum item encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Estoque;