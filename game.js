class RetroGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.startBtn = document.getElementById('startBtn');
        
        this.player = { x: 45, y: 45, size: 8, speed: 2, direction: 0, moving: false };
        this.dots = [];
        this.walls = [];
        this.ghosts = [];
        this.score = 0;
        this.gameRunning = false;
        this.tileSize = 30;
        this.nextDirection = null;
        this.mouthAnimation = 0;
        
        this.init();
    }
    
    init() {
        this.createMap();
        this.startBtn.addEventListener('click', () => this.startGame());
        document.addEventListener('keydown', (e) => this.handleInput(e));
        this.draw();
    }
    
    createMap() {
        const map = [
            '############################',
            '#............##............#',
            '#.####.#####.##.#####.####.#',
            '#.####.#####.##.#####.####.#',
            '#..........................#',
            '#.####.##.########.##.####.#',
            '#......##....##....##......#',
            '######.#####.##.#####.######',
            '######.##..........##.######',
            '######.##.###--###.##.######',
            '#.........#......#.........#',
            '######.##.########.##.######',
            '######.##..........##.######',
            '######.##.########.##.######',
            '#............##............#',
            '#.####.#####.##.#####.####.#',
            '#...##................##...#',
            '###.##.##.########.##.##.###',
            '#......##....##....##......#',
            '#.##########.##.##########.#',
            '#..........................#',
            '############################'
        ];
        
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const x = col * this.tileSize;
                const y = row * this.tileSize;
                
                if (map[row][col] === '#') {
                    this.walls.push({ x, y });
                } else if (map[row][col] === '.') {
                    this.dots.push({ x: x + 15, y: y + 15, collected: false });
                }
            }
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.player = { x: 45, y: 45, size: 8, speed: 2, direction: 0, moving: false };
        this.nextDirection = null;
        this.mouthAnimation = 0;
        this.createGhosts();
        this.dots.forEach(dot => dot.collected = false);
        this.startBtn.textContent = 'REINICIAR';
        this.gameLoop();
    }
    
    handleInput(e) {
        if (!this.gameRunning) return;
        
        switch(e.key) {
            case 'ArrowUp':
                this.nextDirection = { dir: -Math.PI / 2, dx: 0, dy: -this.player.speed };
                break;
            case 'ArrowDown':
                this.nextDirection = { dir: Math.PI / 2, dx: 0, dy: this.player.speed };
                break;
            case 'ArrowLeft':
                this.nextDirection = { dir: Math.PI, dx: -this.player.speed, dy: 0 };
                break;
            case 'ArrowRight':
                this.nextDirection = { dir: 0, dx: this.player.speed, dy: 0 };
                break;
        }
        
        if (!this.player.moving && this.nextDirection) {
            this.player.direction = this.nextDirection.dir;
            this.player.moving = true;
        }
    }
    
    createGhosts() {
        const colors = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];
        const positions = [{x: 405, y: 315}, {x: 375, y: 315}, {x: 435, y: 315}];
        
        this.ghosts = positions.map((pos, i) => ({
            x: pos.x, y: pos.y, size: 8, speed: 1.5,
            color: colors[i], direction: Math.random() * Math.PI * 2,
            changeTimer: 0
        }));
    }
    
    update() {
        // Animación de la boca
        if (this.player.moving) {
            this.mouthAnimation += 0.3;
        }
        
        // Movimiento automático
        if (this.player.moving) {
            const currentDir = this.getCurrentDirection();
            const newX = this.player.x + currentDir.dx;
            const newY = this.player.y + currentDir.dy;
            
            if (!this.checkWallCollision(newX, newY)) {
                this.player.x = newX;
                this.player.y = newY;
            } else {
                this.player.moving = false;
            }
            
            // Cambiar dirección si hay una nueva dirección pendiente
            if (this.nextDirection && this.canChangeDirection()) {
                this.player.direction = this.nextDirection.dir;
                this.nextDirection = null;
            }
        }
        
        // Mover fantasmas
        this.ghosts.forEach(ghost => {
            ghost.changeTimer++;
            
            if (ghost.changeTimer > 60 || Math.random() < 0.02) {
                const directions = [0, Math.PI/2, Math.PI, -Math.PI/2];
                ghost.direction = directions[Math.floor(Math.random() * directions.length)];
                ghost.changeTimer = 0;
            }
            
            const newX = ghost.x + Math.cos(ghost.direction) * ghost.speed;
            const newY = ghost.y + Math.sin(ghost.direction) * ghost.speed;
            
            if (!this.checkGhostWallCollision(newX, newY, ghost.size)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                ghost.changeTimer = 60;
            }
        });
        
        // Verificar colisiones con fantasmas
        this.ghosts.forEach(ghost => {
            const distance = Math.sqrt(
                Math.pow(this.player.x - ghost.x, 2) + 
                Math.pow(this.player.y - ghost.y, 2)
            );
            if (distance < this.player.size + ghost.size) {
                this.gameRunning = false;
                this.drawGameOverMessage();
            }
        });
        
        // Verificar colisiones con puntos
        this.dots.forEach(dot => {
            if (!dot.collected) {
                const distance = Math.sqrt(
                    Math.pow(this.player.x - dot.x, 2) + 
                    Math.pow(this.player.y - dot.y, 2)
                );
                if (distance < this.player.size + 3) {
                    dot.collected = true;
                    this.score += 10;
                    this.scoreElement.textContent = this.score;
                }
            }
        });
        
        // Verificar si se ganó
        if (this.dots.every(dot => dot.collected)) {
            this.gameRunning = false;
            this.drawWinMessage();
        }
    }
    
    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar paredes
        this.ctx.fillStyle = '#0066ff';
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.x, wall.y, this.tileSize, this.tileSize);
        });
        
        // Dibujar puntos
        this.dots.forEach(dot => {
            if (!dot.collected) {
                this.ctx.fillStyle = '#ffff00';
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Dibujar jugador (estilo Pacman con boca animada)
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        
        const mouthSize = this.player.moving ? Math.abs(Math.sin(this.mouthAnimation)) * 0.6 + 0.1 : 0.1;
        
        this.ctx.arc(this.player.x, this.player.y, this.player.size, 
                    this.player.direction + mouthSize * Math.PI, 
                    this.player.direction + (2 - mouthSize) * Math.PI);
        this.ctx.lineTo(this.player.x, this.player.y);
        this.ctx.fill();
        
        // Dibujar ojo
        const eyeX = this.player.x + Math.cos(this.player.direction + Math.PI * 0.7) * 8;
        const eyeY = this.player.y + Math.sin(this.player.direction + Math.PI * 0.7) * 8;
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Dibujar fantasmas
        this.ghosts.forEach(ghost => {
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(ghost.x, ghost.y, ghost.size, 0, Math.PI, false);
            this.ctx.lineTo(ghost.x - ghost.size, ghost.y + ghost.size);
            this.ctx.lineTo(ghost.x - ghost.size/2, ghost.y + ghost.size/2);
            this.ctx.lineTo(ghost.x, ghost.y + ghost.size);
            this.ctx.lineTo(ghost.x + ghost.size/2, ghost.y + ghost.size/2);
            this.ctx.lineTo(ghost.x + ghost.size, ghost.y + ghost.size);
            this.ctx.lineTo(ghost.x + ghost.size, ghost.y);
            this.ctx.fill();
            
            // Ojos del fantasma
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(ghost.x - 3, ghost.y - 2, 2, 0, Math.PI * 2);
            this.ctx.arc(ghost.x + 3, ghost.y - 2, 2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#000';
            this.ctx.beginPath();
            this.ctx.arc(ghost.x - 3, ghost.y - 2, 1, 0, Math.PI * 2);
            this.ctx.arc(ghost.x + 3, ghost.y - 2, 1, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawWinMessage() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '32px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('¡GANASTE!', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(`Puntuación: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    drawGameOverMessage() {
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '32px "Press Start 2P"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(`Puntuación: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    getCurrentDirection() {
        switch(this.player.direction) {
            case -Math.PI / 2: return { dx: 0, dy: -this.player.speed };
            case Math.PI / 2: return { dx: 0, dy: this.player.speed };
            case Math.PI: return { dx: -this.player.speed, dy: 0 };
            case 0: return { dx: this.player.speed, dy: 0 };
            default: return { dx: 0, dy: 0 };
        }
    }
    
    canChangeDirection() {
        if (!this.nextDirection) return false;
        const newX = this.player.x + this.nextDirection.dx;
        const newY = this.player.y + this.nextDirection.dy;
        return !this.checkWallCollision(newX, newY);
    }
    
    checkWallCollision(x, y) {
        return this.walls.some(wall => 
            x - this.player.size < wall.x + this.tileSize &&
            x + this.player.size > wall.x &&
            y - this.player.size < wall.y + this.tileSize &&
            y + this.player.size > wall.y
        );
    }
    
    checkGhostWallCollision(x, y, size) {
        return this.walls.some(wall => 
            x - size < wall.x + this.tileSize &&
            x + size > wall.x &&
            y - size < wall.y + this.tileSize &&
            y + size > wall.y
        );
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

// Inicializar el juego cuando se carga la página
window.addEventListener('load', () => {
    new RetroGame();
});