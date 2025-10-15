package br.com.fastgondolas.fastos.server.service;

import br.com.fastgondolas.fastos.server.dto.LoginRequestDto;
import br.com.fastgondolas.fastos.server.exception.UserAlreadyExistsException;
import br.com.fastgondolas.fastos.server.model.User;
import br.com.fastgondolas.fastos.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(User user) {

        if(userRepository.findByUsername(user.getUsername()).isPresent() ||
                userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Um usuário com este nome de usuário ou email já existe.");
        }

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public String loginUser(LoginRequestDto  loginRequestDto) {
        User user = userRepository.findByUsername(loginRequestDto.username())
                .orElseThrow(() -> new BadCredentialsException("Usuário ou senha inválida"));

        if(!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())) {
            throw new  BadCredentialsException("Usuário ou senha inválida");
        }

        return "jwt.placeholder.token.for." + user.getUsername();
    }
}
