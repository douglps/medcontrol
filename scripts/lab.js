// Orquestra o ambiente local completo do MedControl:
// libera as portas do backend/frontend (mata processos travados de execuções
// anteriores), sobe o Postgres via docker compose, aguarda ficar saudável e
// então inicia backend e frontend em paralelo.
import kill from "kill-port";
import { spawn, spawnSync } from "node:child_process";

const PORTAS_APP = [3000, 5173];
const CONTAINER_DB = "medcontrol_db";

async function liberarPortas() {
    for (const porta of PORTAS_APP) {
        try {
            await kill(porta, "tcp");
            console.log(`[lab] Porta ${porta} liberada.`);
        } catch {
            // já estava livre
        }
    }
}

function subirBanco() {
    console.log("[lab] Subindo banco de dados (docker compose)...");
    const resultado = spawnSync("docker", ["compose", "up", "-d", "db"], {
        stdio: "inherit",
    });
    if (resultado.status !== 0) {
        console.error("[lab] Falha ao subir o banco de dados. O Docker está rodando?");
        process.exit(1);
    }
}

async function aguardarBancoSaudavel(timeoutMs = 30000) {
    console.log("[lab] Aguardando banco ficar saudável...");
    const inicio = Date.now();
    while (Date.now() - inicio < timeoutMs) {
        const resultado = spawnSync(
            "docker",
            ["inspect", "--format", "{{.State.Health.Status}}", CONTAINER_DB],
            { encoding: "utf-8" }
        );
        if (resultado.stdout?.trim() === "healthy") {
            console.log("[lab] Banco pronto.");
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.warn("[lab] Timeout aguardando saúde do banco — seguindo mesmo assim.");
}

function subirApps() {
    console.log("[lab] Subindo backend e frontend...");
    const comando =
        'npx concurrently -k -n backend,frontend -c blue,green ' +
        '"npm run dev --prefix back-end" "npm run dev --prefix front-end"';
    spawn(comando, { stdio: "inherit", shell: true });
}

async function main() {
    await liberarPortas();
    subirBanco();
    await aguardarBancoSaudavel();
    subirApps();
}

main();
