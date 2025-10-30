package br.com.fastgondolas.fastos.server.service;

import br.com.fastgondolas.fastos.server.exception.ResourceNotFoundException;
import br.com.fastgondolas.fastos.server.model.OrdemDeServico;
import br.com.fastgondolas.fastos.server.repository.OrdemDeServicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrdemDeServicoService {

    private final OrdemDeServicoRepository osRepository;

    @Transactional(readOnly = true)
    public OrdemDeServico findById(UUID osId) {
        return osRepository.findById(osId).orElseThrow(() -> new ResourceNotFoundException("A OrdemDeServico não encontrado com o ID: " + osId));
    }
}
