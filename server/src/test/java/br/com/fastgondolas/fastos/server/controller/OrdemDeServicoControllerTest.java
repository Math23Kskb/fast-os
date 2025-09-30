package br.com.fastgondolas.fastos.server.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrdemDeServicoControllerTest {

    @Test
    void buscarPorID() {
        OrdemDeServicoController controller = new OrdemDeServicoController();

        String idDeTeste = "42";

        String resultado = controller.buscarPorID(idDeTeste);

        assertEquals("Esperando Ordem de Serviço com ID: 42", resultado);
    }
}