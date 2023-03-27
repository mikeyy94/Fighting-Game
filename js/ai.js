
class ai {
    constructor({
        self,
        enemy,
    })
    {
        this.self = self;
        this.enemy = enemy;
        this.closeness = 30;
        this.lastJump = 0;
        this.lastJumpHealth = 100;
        this.phase = 'attack';
        this.phaseChangeTime = 0;
        this.phaseDuration = 200;
        this.phases = ['attack', 'evade'];
        this.attack = true;
        this.evade = true;
        this.panicTime = 15;
    }

    pathfind()
    {
        if((this.self.dead === true && this.self.dying === true) || round === 0)
            return;

        var a = this.self.position.x - this.enemy.position.x;
        var b = this.self.position.y - this.enemy.position.y;
        const distance = Math.sqrt( a*a + b*b );

        if(this.enemy.dying === true || this.enemy.dead === true)
        {
            this.phase = 'gloat';
        }
        if(this.phaseChangeTime + this.phaseDuration <= Date.now())
        {
            this.phaseChangeTime = Date.now();
            if(distance > canvas.width / 4 || timer < this.panicTime)
            {
                this.phase = 'attack';
            }
            else
            {
                if(this.self.health > this.enemy.health)
                {
                    this.phase = 'attack';
                }
                else
                {
                    this.phase = this.phases[Math.floor(Math.random() * this.phases.length)];
                }
            }
        }

        // Punch him
        if(rectangularCollision({ rectangle1: this.self, rectangle2: this.enemy}) && this.attack)
        {
            if(!this.enemy.dead && !this.enemy.dying)
                this.self.attack();
        }
        else if(
            this.evade
            && rectangularCollision({ rectangle1: this.enemy, rectangle2: this.self}) 
            && this.self.jumps > 0 
            && (this.lastJump + 2000 <= Date.now() || this.self.health < this.lastJumpHealth) 
        )
        {
            this.lastJump = Date.now();
            this.lastJumpHealth = this.self.health;
            this.self.velocity.y = this.self.jumpVelocity;
            this.self.jumps -= 1;
        }
        
        var la = this.self.position.x + Math.round(this.self.runVelocity * -1) - this.enemy.position.x;
        var lb = this.self.position.y - this.enemy.position.y;
        const left = Math.sqrt( la*la + lb*lb );

        var ra = this.self.position.x + Math.round(this.self.runVelocity * 1) - this.enemy.position.x;
        var rb = this.self.position.y - this.enemy.position.y;
        const right = Math.sqrt( ra*ra + rb*rb );

        if(this.phase === 'attack')
        {
            if(this.self.lastPunched + 200 > Date.now())
            {
                if(left > right)
                {
                    this.self.velocity.x = Math.round(this.self.runVelocity * -1);
                }
                else
                {
                    this.self.velocity.x = Math.round(this.self.runVelocity * 1);
                }
            }
            else if(
                this.self.position.x + (this.self.attackBox.width * this.self.direction) < this.enemy.position.x + (this.closeness * this.self.direction)
                &&
                this.self.position.x + (this.self.attackBox.width * this.self.direction) > this.enemy.position.x - (this.closeness * this.self.direction)
            )
            {
                if(this.self.position.x > canvas.width - 200)
                {
                    this.self.velocity.x = Math.round(this.self.runVelocity * -1);
                }
                else if(this.self.position.x < 200)
                {
                    this.self.velocity.x = Math.round(this.self.runVelocity * 1);
                }
            }
            else if(this.self.position.x + (this.self.attackBox.width * this.self.direction) > this.enemy.position.x)
            {
                this.self.velocity.x = Math.round(this.self.runVelocity * -1);
            }
            else if(this.self.position.x + (this.self.attackBox.width * this.self.direction) < this.enemy.position.x)
            {
                this.self.velocity.x = Math.round(this.self.runVelocity * 1);
            }
            else
            {
                this.self.velocity.x = 0;
            }
        }
        else if(this.phase === 'evade')
        {
            if(this.self.position.x < Math.round(canvas.width / 5))
            {
                this.self.velocity.x = Math.round(this.self.runVelocity * 1);
            }
            else if(this.self.position.x > canvas.width - (canvas.width / 5))
            {
                this.self.velocity.x = Math.round(this.self.runVelocity * -1);
            }
            else if(left > right)
            {
                this.self.velocity.x = Math.round(this.self.runVelocity * -1);
            }
            else if(right > left)
            {
                this.self.velocity.x = Math.round(this.self.runVelocity * 1);
            }
            else 
            {
                this.self.velocity.x = 0;
            }
        }
        else if(this.phase === 'gloat')
        {
            if(this.self.jumps > 0)
            {
                this.self.velocity.y = this.self.jumpVelocity;
                this.self.jumps -= 1;
            }
        }

        // Vertical homing
        if(this.self.position.y + this.self.attackBox.height - this.self.attackBox.offset.y > this.enemy.position.y && this.self.jumps > 0)
        {
            // this.self.velocity.y = this.self.jumpVelocity;
            // this.self.jumps -= 1;
        }
    }

    animate()
    {            
        // Animation switching
        if(this.self.isAttacking)
        {
            // do nothing;
        }
        if(this.self.velocity.y > 0)
        {
            this.self.switchSprite('jump');
        }
        else if(this.self.velocity.y < 0)
        {
            this.self.switchSprite('fall');
        }
        else if(this.self.velocity.x !== 0)
        {
            this.self.switchSprite('run');
        }
        else
        {
            this.self.switchSprite('idle');
        }
    }
}