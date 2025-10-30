package br.com.fastgondolas.fastos.server.controller;

import br.com.fastgondolas.fastos.server.dto.PushChangesDto;
import br.com.fastgondolas.fastos.server.dto.SyncResponseDto;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.service.SyncService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/sync")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class SyncController {

    private final SyncService syncService;

    /**
     * Endpoint PULL: O frontend chama este endpoint para buscar as mudanças do servidor.
     * @param tecnicoLogado O usuário autenticado, injetado pelo Spring Security.
     * @param lastPulledAt O timestamp da última sincronização bem-sucedida, enviado pelo cliente.
     *                     Pode ser nulo ou 0 na primeira sincronização.
     * @return Um objeto contendo todas as mudanças (created, updated, deleted) e um novo timestamp do servidor.
     */
    @GetMapping
    public ResponseEntity<SyncResponseDto> pullChanges(
            @AuthenticationPrincipal User tecnicoLogado,
            @RequestParam(name = "last_pulled_at", required = false) Long lastPulledAt) {


        Instant lastSyncTimestamp = (lastPulledAt == null || lastPulledAt == 0) ?
                Instant.EPOCH :
                Instant.ofEpochMilli(lastPulledAt);

        SyncResponseDto response = syncService.pullChanges(tecnicoLogado, lastSyncTimestamp);

        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint PUSH: O frontend chama este endpoint para enviar as mudanças feitas offline.
     * @param tecnicoLogado O usuário autenticado.
     * @param changes O corpo da requisição com as mudanças feitas no cliente.
     * @return 200 OK se as mudanças foram processadas com sucesso.
     */
    @PostMapping
    public ResponseEntity<Void> pushChanges(
            @AuthenticationPrincipal User tecnicoLogado,
            @RequestBody PushChangesDto changes) {

        syncService.pushChanges(tecnicoLogado, changes);

        return ResponseEntity.ok().build();
    }
}
