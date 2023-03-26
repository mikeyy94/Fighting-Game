class ai {
    constructor({
        self,
        enemy,
    })
    {
        this.self = self;
        this.enemy = enemy;
        this.closeness = 30;
    }

    pathfind()
    {
        // Punch him
        if(!this.self.isAttacking && !this.enemy.dead && rectangularCollision({ rectangle1: this.self, rectangle2: this.enemy}))
        {
            this.self.attack();
        }

        // Vertical homing
        // if(this.self.position.y + this.self.attackBox.height - this.self.attackBox.offset.y > this.enemy.position.y && this.self.jumps > 0)
        // {
        //     this.self.velocity.y = this.self.jumpVelocity;
        //     this.self.jumps -= 1;
        // }

        // Horizontal homing
        if(
            this.self.position.x - this.self.attackBox.width > this.enemy.position.x - this.closeness
            &&
            this.self.position.x - this.self.attackBox.width < this.enemy.position.x + this.closeness
        )
        {
            this.self.velocity.x = 0;
        }
        else if(this.self.position.x - this.self.attackBox.width > this.enemy.position.x)
        {
            this.self.velocity.x = this.self.runVelocity * -1;
        }
        else if(this.self.position.x - this.self.attackBox.width < this.enemy.position.x)
        {
            this.self.velocity.x = this.self.runVelocity * 1;
        }

        // Do animation
        this.animate();
    }

    animate()
    {
        // Animation switching
        if(this.self.isAttacking)
        {
            // do nothing
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