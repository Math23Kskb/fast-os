-- ======================================================================================
-- MIGRATION V2: Insere dados de teste para o desenvolvimento e validação da API
-- ======================================================================================

-- 1. Criar um Técnico de teste
-- ID do Tecnico: '...a11'
INSERT INTO tecnicos (id, nome, matricula, empresa, ativo) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'João da Silva (Técnico Teste)', 'TEC-123', 'Fast Gondolas', true);

-- 2. Criar um User para o técnico (senha é 'password' criptografada com BCrypt)
-- ID do User: '...a12'
INSERT INTO users (id, username, password, email, role, tecnico_id, ativo) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'tecnico.teste', '$2a$10$1iMygm6zyQdYBWN9XjjRZeSzSOmbeQ/DT2f8xxsJY3En5woUPWjO6', 'tecnico.teste@fastgondolas.com.br', 'TECNICO', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true);

-- 3. Criar um Cliente de teste
INSERT INTO clientes (id, nome, contato, telefone) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Supermercado Exemplo', 'Gerente Carlos', '(11) 98765-4321');

-- 4. Criar um Endereço para o cliente
INSERT INTO enderecos (id, cliente_id, logradouro, numero, cidade, estado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Avenida Principal', '1000', 'São Paulo', 'SP');

-- 5. Criar uma Visita para o técnico neste endereço
-- CORRIGIDO: O tecnico_id deve referenciar o ID da tabela 'users', não da tabela 'tecnicos'.
INSERT INTO visitas (id, tecnico_id, endereco_id, status) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'AGENDADA');

-- 6. Criar duas Ordens de Serviço para esta visita
INSERT INTO ordens_de_servico (id, numero_os, cliente_id, endereco_id, tecnico_responsavel_id, status, problema_detalhado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', '87654321', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'AGENDADA', '[{"categoria": "REFRIGERACAO", "subcampos": [{"nome": "COMPRESSOR", "selecionado": true, "defeito": "Não liga"}]}]');

INSERT INTO ordens_de_servico (id, numero_os, cliente_id, endereco_id, tecnico_responsavel_id, status, problema_detalhado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', '87654322', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'AGENDADA', '[{"categoria": "ILUMINACAO", "subcampos": [{"nome": "LAMPADA", "selecionado": true, "defeito": "Queimada"}]}]');

-- 7. Associar as Ordens de Serviço à Visita
INSERT INTO visita_ordens_de_servico (visita_id, ordem_de_servico_id) VALUES
                                                                          ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a51'),
                                                                          ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a52');

-- ======================================================================================
-- CENÁRIOS ADICIONAIS: Múltiplos clientes e OS complexas para o mesmo técnico
-- ======================================================================================

-- CENÁRIO 1: Novo Cliente (Hipermercado Central) com 1 Visita e 3 OSs.
-- --------------------------------------------------------------------------------------

-- 8. Criar o segundo cliente de teste
INSERT INTO clientes (id, nome, contato, telefone) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'Hipermercado Central', 'Sra. Ana', '(21) 91234-5678');

-- 9. Criar um endereço para o novo cliente no Rio de Janeiro
INSERT INTO enderecos (id, cliente_id, logradouro, numero, cidade, estado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'Avenida Brasil', '500', 'Rio de Janeiro', 'RJ');

-- 10. Criar uma nova Visita para o técnico neste novo endereço
INSERT INTO visitas (id, tecnico_id, endereco_id, status) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'AGENDADA');

-- 11. Criar 3 Ordens de Serviço para a nova visita, incluindo uma com múltiplos subcampos
-- OS 1: Problema de Refrigeração com múltiplos subcampos
INSERT INTO ordens_de_servico (id, numero_os, cliente_id, endereco_id, tecnico_responsavel_id, status, problema_detalhado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a64', '98765431', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'AGENDADA', '[{"categoria": "REFRIGERACAO", "subcampos": [{"nome": "VENTOINHA", "selecionado": true, "defeito": "Barulhenta"}, {"nome": "TERMOSTATO", "selecionado": true, "defeito": "Não regula temperatura"}]}]');

-- OS 2: Problema de Estrutura
INSERT INTO ordens_de_servico (id, numero_os, cliente_id, endereco_id, tecnico_responsavel_id, status, problema_detalhado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a65', '98765432', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'AGENDADA', '[{"categoria": "ESTRUTURA", "subcampos": [{"nome": "PRATELEIRA", "selecionado": true, "defeito": "Enferrujada"}]}]');

-- OS 3: Problema de Iluminação
INSERT INTO ordens_de_servico (id, numero_os, cliente_id, endereco_id, tecnico_responsavel_id, status, problema_detalhado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', '98765433', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'AGENDADA', '[{"categoria": "ILUMINACAO", "subcampos": [{"nome": "PAINEL DE LED", "selecionado": true, "defeito": "Piscando sem parar"}]}]');


-- 12. Associar as 3 novas OSs à nova visita
INSERT INTO visita_ordens_de_servico (visita_id, ordem_de_servico_id) VALUES
                                                                          ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a64'),
                                                                          ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a65'),
                                                                          ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66');


-- CENÁRIO 2: Outro Cliente (Padaria Pão Quente) com 1 Visita e 1 OS com múltiplas categorias.
-- ----------------------------------------------------------------------------------------------------

-- 13. Criar o terceiro cliente de teste
INSERT INTO clientes (id, nome, contato, telefone) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'Padaria Pão Quente', 'Sr. Manuel', '(31) 98877-6655');

-- 14. Criar um endereço para este cliente em Belo Horizonte
INSERT INTO enderecos (id, cliente_id, logradouro, numero, cidade, estado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'Rua dos Pães', '123', 'Belo Horizonte', 'MG');

-- 15. Criar uma terceira Visita para o técnico
INSERT INTO visitas (id, tecnico_id, endereco_id, status) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'AGENDADA');

-- 16. Criar 1 OS com múltiplas categorias de problema
INSERT INTO ordens_de_servico (id, numero_os, cliente_id, endereco_id, tecnico_responsavel_id, status, problema_detalhado) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a74', '99887711', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a71', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a72', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'AGENDADA', '[{"categoria": "VAZAMENTO", "subcampos": [{"nome": "ÁGUA", "selecionado": true, "defeito": "Pingando no chão da loja"}]}, {"categoria": "ESTRUTURA", "subcampos": [{"nome": "PÉ NIVELADOR", "selecionado": true, "defeito": "Equipamento bambo"}]}]');

-- 17. Associar esta OS complexa à sua visita
INSERT INTO visita_ordens_de_servico (visita_id, ordem_de_servico_id) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a73', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a74');