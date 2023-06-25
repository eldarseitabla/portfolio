window.onload = function () {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');

    const particles = [];
    const numParticles = 100;
    let speed = 2;  // initial speed

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.dx = (Math.random() - 0.5) * speed; // 5 speed
            this.dy = (Math.random() - 0.5) * speed; // 5 speed
            this.radius = Math.random() * 10 + 1;
            this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        }

        update() {
            this.x += this.dx * speed;
            this.y += this.dy * speed;

            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.dx *= -1;
            }

            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.dy *= -1;
            }

            // Move particles
            this.x += this.dx;
            this.y += this.dy;

            // Check collision between particles
            for (let i = 0; i < numParticles; i++) {
                if (this === particles[i]) continue;
                const dx = this.x - particles[i].x;
                const dy = this.y - particles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.radius + particles[i].radius) {
                    // Resolve collision (source: https://en.wikipedia.org/wiki/Elastic_collision)
                    const xVelocityDiff = this.dx - particles[i].dx;
                    const yVelocityDiff = this.dy - particles[i].dy;
                    const xDist = particles[i].x - this.x;
                    const yDist = particles[i].y - this.y;

                    // Prevent accidental overlap of particles
                    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

                        // Collision detected, swap velocities
                        const angle = -Math.atan2(particles[i].y - this.y, particles[i].x - this.x);
                        const m1 = this.radius;
                        const m2 = particles[i].radius;
                        const u1 = rotate(this.dx, this.dy, angle);
                        const u2 = rotate(particles[i].dx, particles[i].dy, angle);
                        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
                        const v2 = {x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2), y: u2.y};
                        const vFinal1 = rotate(v1.x, v1.y, -angle);
                        const vFinal2 = rotate(v2.x, v2.y, -angle);

                        this.dx = vFinal1.x;
                        this.dy = vFinal1.y;
                        particles[i].dx = vFinal2.x;
                        particles[i].dy = vFinal2.y;
                    }
                }
            }

            this.draw();
        }

        draw() {
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
    }

    function rotate(dx, dy, angle) {
        return {
            x: dx * Math.cos(angle) - dy * Math.sin(angle),
            y: dx * Math.sin(angle) + dy * Math.cos(angle)
        };
    }

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
        });

        requestAnimationFrame(animate);
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    animate();

    document.getElementById('increase-speed').addEventListener('click', function() {
        speed += 0.5;
    });

    document.getElementById('decrease-speed').addEventListener('click', function() {
        if (speed > 0.5) {
            speed -= 0.5;
        }
    });
};
