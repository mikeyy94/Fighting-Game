class Sprite 
{
    constructor
    ({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset =
        {
            x: 0,
            y: 0
        }
    })
   {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 15
        this.offset = offset
   } 

    draw()
   {
    c.drawImage
        (
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
   }

   animateFrames()
   {
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold === 0)
        {
            if(this.framesCurrent < this.framesMax - 1)
            {
                this.framesCurrent++
            }
            else
            {
                this.framesCurrent = 0
            }
        }
   }
    update() 
   {
        this.draw()
        this.animateFrames()
   }
}

class Fighter extends Sprite
{
   constructor
   ({ 
        position,
        startPosition,
        velocity,
        colour = 'blue',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset =
        {
            x: 0,
            y: 0
        },
        sprites,
        attackBox =
        {
            offset: {},
            width: undefined,
            height: undefined
        },
        maxJumps = 1,
        jumpVelocity = 12,
        runVelocity = 3,
        damage = 20,
        framesHold = 15,
        ai = false,
        direction = 1
    })
   {
        super
        ({
            position,
            startPosition,
            imageSrc,
            scale,
            framesMax,
            offset,
            maxJumps,
            jumpVelocity,
            runVelocity,
            damage,
            framesHold,
            ai,
            direction
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox =
        {
            position: 
            {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.colour = colour
        this.isAttacking = false
        this.hasHit = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = framesHold
        this.sprites = sprites
        this.dead = false
        this.jumps = maxJumps
        this.maxJumps = maxJumps
        this.jumpVelocity = jumpVelocity
        this.runVelocity = runVelocity
        this.damage = damage
        this.animation = 'idle'
        this.maxHealth = 100
        this.startPosition = startPosition
        this.ai = ai
        this.direction = direction
        this.dying = false
        this.lastHit = 0

        for (const sprite in this.sprites)
        {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
   } 

   restore()
   {
        this.image = this.sprites.idle.image
        this.framesMax = this.sprites.idle.framesMax
        this.framesCurrent = 0
        this.animation = 'idle'
        this.dying = false
        this.dead = false
        this.health = this.maxHealth
        this.jumps = this.maxJumps
        this.switchSprite('idle')
        this.position = structuredClone(this.startPosition)
   }

    update() 
   {
        this.draw()
        if(!this.dead)
            this.animateFrames()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw attack box
        // c.fillRect
        // (
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // )


        if(paused === true)
            return

        if(this.position.x + this.velocity.x <= 0)
        {
            this.position.x = 0
        }
        else if(this.position.x + this.width + this.velocity.x >= canvas.width)
        {
            this.position.x = canvas.width - this.width
        }
        else
        {
            this.position.x += this.velocity.x
        }
         
        this.position.y += this.velocity.y

        // gravity function
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 95) 
            {
                this.velocity.y = 0
                this.position.y = 331
                this.jumps = this.maxJumps
            } 
        else 
        {
            this.velocity.y += gravity
        }
   }

    attack()
   {
        if(this.isAttacking)
            return false

        this.isAttacking = true
        this.hasHit = false
        this.switchSprite('attack1')
   }

   takeHit(damage)
   {
        this.lastHit = Date.now()
        this.health -= damage

        if(this.health <= 0)
        {
            this.switchSprite('death')
            this.velocity.x = 0
            this.dying = true
            determineWinner()
        }
        else
        this.switchSprite('takeHit')
   }

   switchSprite(sprite)
   {

        // overriding all other animations with the death animation
        if(
            this.image === this.sprites.death.image
        )
        {
            if(this.framesCurrent === this.sprites.death.framesMax - 1) 
            {
                this.dead = true
            }
            return
        }

        // overriding all other animations with the attack animation
        if(
            this.image === this.sprites.attack1.image && 
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        ) 
        return

        // override when fighter gets hit
        if(
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
        return

        switch (sprite)
        {
            case 'idle':
                if(this.image !== this.sprites.idle.image)
                {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break

            case 'run':
                if(this.image !== this.sprites.run.image)
                {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break

            case 'jump':
                if(this.image !== this.sprites.jump.image)
                {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break

            case 'fall':
                if(this.image !== this.sprites.fall.image)
                {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break

            case 'attack1':
                if(this.image !== this.sprites.attack1.image)
                {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break

            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image)
                {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break

            case 'death':
                if(this.image !== this.sprites.death.image)
                {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                    this.animation = sprite
                }
                break
        }
   }
}