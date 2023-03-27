function rectangularCollision
({
    rectangle1,
    rectangle2
}) 
{
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

let round = 0
let roundLength = 90
let playerScore = 0
let enemyScore = 0
let timer = 0
let timerId
let paused = false

document.querySelector('#timer').innerHTML = roundLength

function toggleAi (self, opponent)
{
    if(!self.ai)
    {
        self.ai = new ai({
            self: self,
            enemy: opponent
        })
    }
    else
    {
        self.ai = false
    }

    document.querySelector('#playerToggle').innerHTML = player.ai === false ? 'HUMAN' : 'AI'
    document.querySelector('#enemyToggle').innerHTML = enemy.ai === false ? 'HUMAN' : 'AI'
}

function startGame()
{
    startRound()
}

function startRound()
{
    round++
    document.querySelector('#roundNumber').innerHTML = "ROUND "+round

    player.restore()
    gsap.to('#playerHealth',
    {
        width: player.health + '%'
    })

    enemy.restore()
    gsap.to('#enemyHealth',
    {
        width: enemy.health + '%'
    })

    timer = roundLength - 1
    timerId = setInterval(() => {
        if(timer <= 0)
            determineWinner();
        document.querySelector('#timer').innerHTML = timer
        timer--
    }, 1000)

    document.querySelector('#displayText').style.display = 'flex'
    document.querySelector('#displayText').innerHTML = 'FIGHT!'

    setTimeout(() => {
        document.querySelector('#displayText').style.display = 'none'
    }, 3000)

    setTimeout(() => {
        paused = false
    }, 500)
}


function determineWinner()
{
    clearTimeout(timerId)

    document.querySelector('#displayText').style.display = 'flex'

    const retryButton = '<a onClick="startRound()" style="font-size: 30px; margin-top: 40px;">NEXT ROUND</a>'

    if(player.health === enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'DRAW!' + retryButton
    } 
    else if(player.health > enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'PLAYER 1 WINS!' + retryButton
        playerScore ++
        document.querySelector('#playerScore').innerHTML = playerScore
    }
    else if(player.health < enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'PLAYER 2 WINS!' + retryButton
        enemyScore ++
        document.querySelector('#enemyScore').innerHTML = enemyScore
    } 
}