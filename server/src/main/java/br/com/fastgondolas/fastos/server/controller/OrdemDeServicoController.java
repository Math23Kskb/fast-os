package br.com.fastgondolas.fastos.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/ordens-de-servico")
public class OrdemDeServicoController {

    @GetMapping("/{id}")
    public String buscarPorID(@PathVariable String id) {
        return "Esperando Ordem de Serviço com ID: " + id;
    }


}