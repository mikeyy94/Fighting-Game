const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.25

const background = new Sprite
({
    position: 
    {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite
({
    position: 
    {
        x: 640,
        y: 160
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    framesMax: 6
})

const player = new Fighter
({
    position: 
    {
        x: 200,
        y: 100
    },
    startPosition: 
    {
        x: 200,
        y: 100
    },
    velocity: 
    {
        x: 0,
        y: 0
    },
    offset: 
    {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:
    {
        x: 220,
        y: 157
    },
    sprites:
    {
        idle:
        {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:
        {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit:
        {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:
        {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
        attackBox:
        {
            offset:
            {
                x: 85,
                y: 35
            },
            width: 160,
            height: 80
        },
        maxJumps: 1,
        jumpVelocity: -14,
        runVelocity: 3,
        damage: 20,
        framesHold: 15
})

const enemy = new Fighter
({
    position: 
    {
        x: canvas.width - 250,
        y: 100
    },
    startPosition: 
    {
        x: canvas.width - 250,
        y: 100
    },
    velocity: 
    {
        x: 0,
        y: 0
    },
    offset:
    {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:
    {
        x: 220,
        y: 170
    },
    sprites:
    {
        idle:
        {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run:
        {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit:
        {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death:
        {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
        attackBox:
        {
            offset:
            {
                x: -175,
                y: 50
            },
            width: 160,
            height: 50
        },
        maxJumps: 2,
        jumpVelocity: -10,
        runVelocity: 4.2,
        damage: 10,
        framesHold: 12
})

console.log(player)

const keys = 
{
    d: 
    {
        pressed: false
    },
    a: 
    {
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    },
    ArrowLeft:
    {
        pressed: false
    }
}

startRound();

function animate() 
{
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.2)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if(keys.d.pressed && player.lastKey === 'd') 
        {
            player.velocity.x = player.runVelocity
            player.switchSprite('run')
        } 
    else if(keys.a.pressed && player.lastKey === 'a')
        {
            player.velocity.x = player.runVelocity * -1
            player.switchSprite('run')
        }
    else
    {
        player.switchSprite('idle')
    }
    
    // jumping
    if(player.velocity.y < 0)
    {
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0)
    {
        player.switchSprite('fall')
    }

    //enemy movement
    if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') 
        {
            enemy.velocity.x = enemy.runVelocity
            enemy.switchSprite('run')
        } 
    else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
        {
            enemy.velocity.x = enemy.runVelocity * -1
            enemy.switchSprite('run')
        }
    else
        {
            enemy.switchSprite('idle')
        }

    // jumping
    if(enemy.velocity.y < 0)
    {
        enemy.switchSprite('jump')
    }
    else if(enemy.velocity.y > 0)
    {
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hit
    if(rectangularCollision
        ({
            rectangle1: player,
            rectangle2: enemy
        }) 
        && player.isAttacking 
        && player.framesCurrent === 4
        && player.animation == 'attack1'
        && player.hasHit == false
    )
        {
            enemy.takeHit(player.damage)
            player.hasHit = true

            gsap.to('#enemyHealth',
            {
                width: enemy.health + '%'
            })
        }
        else  if(player.framesCurrent === 4 && player.isAttacking === true && player.hasHit === false)
        {
            player.isAttacking = false
            player.hasHit = false
        }

        if(player.framesCurrent === player.framesMax - 1)
        {
            player.isAttacking = false
            player.hasHit = false
        }

    // detect for collision & player gets hit
    if(rectangularCollision
        ({
            rectangle1: enemy,
            rectangle2: player
        }) 
        && enemy.isAttacking 
        && enemy.framesCurrent === 2
        && enemy.animation == 'attack1'
        && enemy.hasHit == false
    )

        // ive hit
        {
            player.takeHit(enemy.damage)
            enemy.hasHit = true

            gsap.to('#playerHealth',
            {
                width: player.health + '%'
            })
        }

        // ive missed
        else  if(enemy.framesCurrent === 4 && enemy.isAttacking === true && enemy.hasHit === false)
        {
            enemy.isAttacking = false
            enemy.hasHit = false
        }

        // ive hit or missed
        if(enemy.framesCurrent === enemy.framesMax - 1)
        {
            enemy.isAttacking = false
            enemy.hasHit = false
        }
    }

    // end game based on health
    if(enemy.health <= 0 || player.health <= 0) 
        {
        determineWinner({ player, enemy, timerId })
        }

animate()

window.addEventListener('keydown', (event) =>
{
    if(!player.dead)
    {
        switch (event.key) 
        {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break

            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break

            case 'w':
                if (player.jumps > 0)
                {
                    player.velocity.y = player.jumpVelocity
                    player.jumps -= 1
                }
                break

            case ' ':
                player.attack()
                break
        }
    }

    if(!enemy.dead)
    {
        switch (event.key)
        {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break

            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break

                case 'ArrowUp':
                    if (enemy.jumps > 0)
                    {
                        enemy.velocity.y = enemy.jumpVelocity
                        enemy.jumps -= 1
                    }
                    break

            case 'Enter':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => 
{
    switch (event.key) 
    {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})