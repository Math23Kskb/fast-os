package br.com.fastgondolas.fastos.server.dto;

import java.util.List;
import java.util.UUID;

public record SyncTableChanges<T>(
        List<T> created,
        List<T> updated,
        List<UUID> deleted
) {
}
