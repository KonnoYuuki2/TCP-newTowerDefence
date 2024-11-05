CREATE TABLE IF NOT EXISTS accounts
(
    id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id VARCHAR(16) NOT NULL UNIQUE,
    password VARCHAR(16) NOT NULL,
    email VARCHAR(16) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS highScores(
    score_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    id BIGINT NOT NULL,
    score BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS game_logs(
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    host_id BIGINT NOT NULL,
    oppo_id BIGINT NOT NULL,
    is_win BOOL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES accounts(id),
    FOREIGN KEY (oppo_id) REFERENCES accounts(id)
);