package br.com.fastgondolas.fastos.server.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrdemDeServicoControllerTest {

    @Test
    void buscarPorID() {
        OrdemDeServicoController controller = new OrdemDeServicoController();

        Long idDeTeste = 42L;

        String resultado = controller.buscarPorID(idDeTeste);

        assertEquals("Esperando Ordem de Serviço com ID: 42", resultado);
    }
}