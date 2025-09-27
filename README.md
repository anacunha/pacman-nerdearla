# 🎮 Juego Retro - Pacman Style

Un juego estilo Pacman clásico desarrollado con HTML5 Canvas y JavaScript vanilla, con estética retro auténtica de los años 80.

## 🕹️ Características

### Jugabilidad
- **Movimiento automático**: Pacman se mueve continuamente en la dirección seleccionada
- **Controles simples**: Usa las flechas del teclado para cambiar de dirección
- **Boca animada**: La boca se abre y cierra mientras se mueve
- **Sistema de puntuación**: 10 puntos por cada punto amarillo recolectado

### Enemigos
- **3 fantasmas**: Con colores clásicos (rojo, rosa, cian)
- **IA básica**: Se mueven aleatoriamente por el laberinto
- **Colisiones**: Game Over si tocas un fantasma

### Estética Retro
- **Fuente pixelada**: "Press Start 2P" para autenticidad
- **Colores neón**: Verde brillante y amarillo clásico
- **Efectos visuales**: Bordes brillantes y animaciones de brillo
- **Diseño fiel**: Inspirado en el Pacman original

## 🎯 Objetivo del Juego

**Ganar**: Recolecta todos los puntos amarillos del laberinto
**Perder**: Evita tocar los fantasmas enemigos

## 🎮 Controles

- **↑ Flecha Arriba**: Mover hacia arriba
- **↓ Flecha Abajo**: Mover hacia abajo  
- **← Flecha Izquierda**: Mover hacia la izquierda
- **→ Flecha Derecha**: Mover hacia la derecha
- **Botón "INICIAR JUEGO"**: Comenzar nueva partida

## 🚀 Cómo Ejecutar

1. Clona o descarga este repositorio
2. Abre `index.html` en tu navegador web
3. Haz clic en "INICIAR JUEGO"
4. ¡Usa las flechas para jugar!

## 📁 Estructura del Proyecto

```
juego-retro/
├── index.html      # Estructura HTML principal
├── style.css       # Estilos retro y animaciones
├── game.js         # Lógica del juego
└── README.md       # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5 Canvas**: Para renderizado de gráficos
- **JavaScript ES6**: Lógica del juego y animaciones
- **CSS3**: Estética retro y efectos visuales
- **Google Fonts**: Fuente "Press Start 2P"

## 🎨 Características Técnicas

- **Detección de colisiones**: Sistema preciso para paredes, puntos y fantasmas
- **Animación fluida**: 60 FPS usando `requestAnimationFrame`
- **Mapa basado en matriz**: Laberinto generado desde array de strings
- **IA de fantasmas**: Movimiento aleatorio con cambio de dirección inteligente

## 🎵 Próximas Mejoras

- [ ] Efectos de sonido retro
- [ ] Múltiples niveles
- [ ] Power pellets para comer fantasmas
- [ ] Puntuaciones altas (high scores)
- [ ] Modo multijugador local

---

¡Disfruta jugando este clásico atemporal! 👾