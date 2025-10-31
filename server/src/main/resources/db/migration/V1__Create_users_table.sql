-- ======================================================================================
-- MIGRATION V1: Cria o Esquema Inicial Completo do Banco de Dados
-- ======================================================================================

-- 1. TIPOS ENUMERADOS (ENUMS)
CREATE TYPE user_role AS ENUM ('TECNICO', 'ADMIN');
CREATE TYPE os_status AS ENUM ('ABERTA', 'AGENDADA', 'EM_ANDAMENTO', 'PAUSADA', 'CONCLUIDA', 'CANCELADA', 'SINCRONIZADA');
CREATE TYPE anexo_tipo AS ENUM ('FOTO', 'VIDEO', 'ASSINATURA', 'DOCUMENTO', 'OUTRO');

-- 2. TABELA DE AUTENTICAÇÃO (USERS)
CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       username VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       ativo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. TABELAS DE PESSOAS E LOCAIS
CREATE TABLE tecnicos (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          nome VARCHAR(255) NOT NULL,
                          matricula VARCHAR(50) UNIQUE,
                          empresa VARCHAR(255),
                          telefone VARCHAR(20),
                          cidade VARCHAR(100),
                          uf VARCHAR(2),
                          ativo BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                          deleted BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE users ADD COLUMN tecnico_id UUID UNIQUE REFERENCES tecnicos(id);
ALTER TABLE users ADD COLUMN role user_role NOT NULL DEFAULT 'TECNICO';

CREATE TABLE clientes (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          nome VARCHAR(255) NOT NULL,
                          contato VARCHAR(255),
                          email VARCHAR(255) UNIQUE,
                          telefone VARCHAR(20),
                          ativo BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                          deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE enderecos (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
                           logradouro VARCHAR(255) NOT NULL,
                           numero VARCHAR(20),
                           complemento VARCHAR(100),
                           bairro VARCHAR(100),
                           cidade VARCHAR(100) NOT NULL,
                           estado VARCHAR(2) NOT NULL,
                           cep VARCHAR(10),
                           descricao VARCHAR(255),
                           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                           updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                           deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 4. TABELAS DE JORNADA E EXECUÇÃO
CREATE TABLE visitas (
                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                         tecnico_id UUID NOT NULL REFERENCES users(id),
                         endereco_id UUID NOT NULL REFERENCES enderecos(id),
                         status VARCHAR(50) NOT NULL DEFAULT 'PLANEJADA',
                         data_saida_empresa TIMESTAMPTZ,
                         data_chegada_cliente TIMESTAMPTZ,
                         data_saida_cliente TIMESTAMPTZ,
                         data_chegada_empresa TIMESTAMPTZ,
                         created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                         updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                         deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE ordens_de_servico (
                                   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                   numero_os VARCHAR(20) NOT NULL,
                                   cliente_id UUID NOT NULL REFERENCES clientes(id),
                                   endereco_id UUID NOT NULL REFERENCES enderecos(id),
                                   tecnico_responsavel_id UUID REFERENCES users(id),
                                   numero_serie_equipamento VARCHAR(100),
                                   problema_detalhado JSONB,
                                   diagnostico_tecnico TEXT,
                                   solucao_aplicada TEXT,
                                   status os_status NOT NULL DEFAULT 'ABERTA',
                                   motivo_pausa VARCHAR(50),
                                   pecas_pendentes JSONB,
                                   descricao_pendencia TEXT,
                                   data_agendamento TIMESTAMPTZ,
                                   data_inicio_execucao TIMESTAMPTZ,
                                   data_fim_execucao TIMESTAMPTZ,
                                   codigo_cliente_externo VARCHAR(50),
                                   numero_pedido_externo VARCHAR(50),
                                   data_faturamento DATE,
                                   em_garantia BOOLEAN DEFAULT FALSE,
                                   created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                   updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                                   deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 5. TABELAS DE CATÁLOGO E APOIO
CREATE TABLE materiais (
                           id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                           nome VARCHAR(255) UNIQUE NOT NULL,
                           descricao TEXT,
                           unidade_medida VARCHAR(10),
                           valor_unitario NUMERIC(10, 2),
                           codigo_barras VARCHAR(100),
                           created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                           updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                           deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE anexos (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        ordem_de_servico_id UUID NOT NULL REFERENCES ordens_de_servico(id) ON DELETE CASCADE,
                        url_arquivo TEXT NOT NULL,
                        tipo_arquivo anexo_tipo NOT NULL,
                        descricao VARCHAR(255),
                        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                        deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. TABELAS DE JUNÇÃO
CREATE TABLE visita_ordens_de_servico (
                                          visita_id UUID NOT NULL REFERENCES visitas(id) ON DELETE CASCADE,
                                          ordem_de_servico_id UUID NOT NULL REFERENCES ordens_de_servico(id) ON DELETE CASCADE,
                                          PRIMARY KEY (visita_id, ordem_de_servico_id)
);

CREATE TABLE ordem_servico_materiais (
                                         ordem_de_servico_id UUID NOT NULL REFERENCES ordens_de_servico(id) ON DELETE CASCADE,
                                         material_id UUID NOT NULL REFERENCES materiais(id),
                                         quantidade_utilizada NUMERIC(10, 2) NOT NULL,
                                         valor_unitario_cobrado NUMERIC(10, 2),
                                         PRIMARY KEY (ordem_de_servico_id, material_id)
);

-- 7. ÍNDICES PARA OTIMIZAÇÃO DE BUSCA
CREATE INDEX idx_enderecos_cliente_id ON enderecos(cliente_id);
CREATE INDEX idx_visitas_tecnico_id ON visitas(tecnico_id);
CREATE INDEX idx_visitas_endereco_id ON visitas(endereco_id);
CREATE INDEX idx_os_cliente_id ON ordens_de_servico(cliente_id);
CREATE INDEX idx_os_tecnico_responsavel_id ON ordens_de_servico(tecnico_responsavel_id);
CREATE INDEX idx_os_status ON ordens_de_servico(status);