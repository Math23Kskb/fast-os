plugins {
    id("dev.nx.gradle.project-graph") version("0.1.7")
	java
	id("org.springframework.boot") version "3.5.5"
	id("io.spring.dependency-management") version "1.1.7"
    id("org.springdoc.openapi-gradle-plugin") version "1.9.0"
	id("jacoco")
}

group = "br.com.fastgondolas.fastos"
version = "0.0.1-SNAPSHOT"
description = "Demo project for Spring Boot"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(21)
	}
}
extra["springdocVersion"] = "2.8.9"
extra["jjwtVersion"] = "0.13.0"
extra["mapstructVersion"] = "1.5.5.Final"
extra["hypersistenceVersion"] = "3.11.0"
extra["lombokMapstructBindingVersion"] = "0.2.0"

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

repositories {
	mavenCentral()
}

dependencies {
	// --- Spring Boot Core ---
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	developmentOnly("org.springframework.boot:spring-boot-devtools")

	// --- Persistência e Banco de Dados ---
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.flywaydb:flyway-core")
	implementation("org.flywaydb:flyway-database-postgresql")
	runtimeOnly("org.postgresql:postgresql")
	implementation("io.hypersistence:hypersistence-utils-hibernate-63:${property("hypersistenceVersion")}")


	// --- Segurança ---
	implementation("org.springframework.boot:spring-boot-starter-security")
	// JWT
	implementation("io.jsonwebtoken:jjwt-api:${property("jjwtVersion")}")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:${property("jjwtVersion")}")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:${property("jjwtVersion")}")

	// --- Documentação da API ---
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:${property("springdocVersion")}")

	// --- Ferramentas de Código (Lombok, MapStruct) ---
	compileOnly("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	implementation("org.mapstruct:mapstruct:${property("mapstructVersion")}")
	annotationProcessor("org.mapstruct:mapstruct-processor:${property("mapstructVersion")}")
	annotationProcessor("org.projectlombok:lombok-mapstruct-binding:${property("lombokMapstructBindingVersion")}")

	// --- Testes ---
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testImplementation("org.springframework.boot:spring-boot-testcontainers")
	testImplementation("org.testcontainers:junit-jupiter")
	testImplementation("org.testcontainers:postgresql")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<JavaCompile> {
	options.compilerArgs.add("-parameters")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

val classesToAnalyze = sourceSets.main.get().output.classesDirs.asFileTree.matching {
    exclude(
		"**/dto/**",
		"**/model/**",
		"**/mapper/**",
		"**/ServerApplication.class")
}

tasks.jacocoTestReport {
	dependsOn(tasks.test)
	reports {
		xml.required.set(true)
		html.required.set(true)
	}
	classDirectories.setFrom(files(classesToAnalyze))
	sourceDirectories.setFrom(files(sourceSets.main.get().java.srcDirs))
}

tasks.jacocoTestCoverageVerification {
	dependsOn(tasks.jacocoTestReport)
	violationRules {
		rule {
			element = "BUNDLE"
			limit {
				counter = "LINE"
				value = "COVEREDRATIO"
				minimum = "0.75".toBigDecimal()
			}
		}
	}
	classDirectories.setFrom(files(classesToAnalyze))
	sourceDirectories.setFrom(files(sourceSets.main.get().java.srcDirs))
}

tasks.check {
	dependsOn(tasks.jacocoTestCoverageVerification)
}

allprojects {
    apply {
        plugin("dev.nx.gradle.project-graph")
    }
}