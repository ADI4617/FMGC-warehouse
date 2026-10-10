# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependencies layer separately
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build the application
COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Default port — Render overrides this with its own PORT env var at runtime
ENV PORT=8080

COPY --from=build /app/target/*.jar app.jar

# Expose default port (informational only — Render uses $PORT at runtime)
EXPOSE 8080

# Use shell form so $PORT is expanded from the runtime environment
# -Dserver.port guarantees the port even if Spring's property resolution
# picks up PORT from the OS environment via application.properties ${PORT:8080}
ENTRYPOINT ["sh", "-c", "java -Dserver.port=$PORT -Dserver.address=0.0.0.0 -jar app.jar"]
