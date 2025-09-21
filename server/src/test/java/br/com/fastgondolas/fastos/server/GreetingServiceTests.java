package br.com.fastgondolas.fastos.server;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class GreetingServiceTests {

    private final GreetingService greetingService = new GreetingService();

    @Test
    void testGetGreetingWithName() {
        String result = greetingService.getGreeting("John");
        assertEquals("Hello, John!", result);
    }

    @Test
    void testGetGreetingWithNullName() {
        String result = greetingService.getGreeting(null);
        assertEquals("Hello, World!", result);
    }
}