module.exports = {
    TREAT: [
        {
            name: 'Candy',
            emoji: '<:candy:1029069555605180518>',
            rank: 1,
            id: 0,
        },
        {
            name: 'Sweet',
            emoji: '<:sweet:1029069563826028745>',
            rank: 2,
            id: 1,
        },
        {
            name: 'Lollipop',
            emoji: '<:lolipop:1029069557731700808>',
            rank: 3,
            id: 2,
        },
        {
            name: 'Chocolate',
            emoji: '<:choclate:1029069559514276021>',
            rank: 4,
            id: 3,
        },
        {
            name: 'Cookie',
            emoji: '<:cookie:1029069562299297862>',
            rank: 5,
            id: 4,
        }
    ],
    MONSTERS: [
        {
            name: 'Ghost',
            description: 'Loves to hide between the trees and scare people. Most of the time, they are harmless, but some of them can chase you and steal your carried trick or treats.',
            image: 'https://media.discordapp.net/attachments/992053260682809494/1029444855971184762/21.png',
            id: 0,
            rank: 1,
            hp: 25,
            steal: 0.1,
            price: 25,
            color: '#89c3b2',
        },
        {
            name: 'Sea Creature',
            description: 'Waits before streets and houses to attack people. They came from the sea to visit people on Halloween. Be careful, they love to eat treats.',
            image: 'https://media.discordapp.net/attachments/992053260682809494/1029444856310927481/22.png',
            id: 1,
            rank: 2,
            hp: 50,
            steal: 0.15,
            price: 50,
            color: '#a8d8d0'
        },
        {
            name: 'Vampire',
            description: 'They appear during night time and fly over their opponents to attack them in the perfect moment. Be cautious, they can steal your treats without you noticing.',
            image: 'https://media.discordapp.net/attachments/992053260682809494/1029444856667451423/23.png',
            id: 2,
            rank: 3,
            hp: 100,
            steal: 0.25,
            price: 75,
            color: '#d8b142'
        },
        {
            name: 'Grass Runner',
            description: 'They lay on the ground to appear unvisible and wait for their victims to pass by. They can run very fast and steal your treats very easy.',
            image: 'https://media.discordapp.net/attachments/992053260682809494/1029444857388863558/Untitled_design_1.png',
            id: 3,
            rank: 4,
            hp: 150,
            steal: 0.3,
            price: 125,
            color: '#3a382c'
        },
        {
            name: 'Zombie',
            description: 'Awaken from their graves, they are taking the oppurtunity to gain new friends and turn you into a zombie. Just a big treat loot will help you distract them to survive and escape.',
            image: 'https://media.discordapp.net/attachments/992053260682809494/1029444857019764899/Untitled_design_1.gif',
            id: 4,
            rank: 5,
            hp: 200,
            steal: 0.35,
            price: 150,
            color: '#648c7b',
        },
    ],
    WEAPONS: [
        {
            name: 'Fist',
            emoji: '✊',
            image: 'https://raw.githubusercontent.com/twitter/twemoji/master/assets/72x72/270a.png',
            rank: 1,
            id: 0,
            price: 0,
            damage: {min: 2, max: 4},
            messages: [
                'You punched the monster with your fist.',
                'You hit the monster with your fist.',
                'You slapped the monster with your fist.',
                'You hit the monster on the right',
                'You hit the monster on the left',
                'You hit the monster on the head',
                'You hit the monster on the body',
                'You tackled the monster and smashed it on the ground',
                'You got the monster on the ground',
                'You punched the monster with your fist.',
            ]
        },
        {
            name: 'Knive',
            emoji: '<:knive:1029069547153661982>',
            image: 'https://cdn.discordapp.com/emojis/1029069547153661982.webp',
            rank: 2,
            id: 1,
            price: 25,
            damage: {min: 4, max: 12},
            messages: [
                'You hit the monster on the right',
                'You hit the monster on the left',
                'You hit the monster on the head',
                'You hit the monster on the body',
                'You tackled the monster and hit it on the back',
                'You got the monster on the ground',
                'You hit the monster on the right',
                'You hit the monster on the left',
                'You tackled the monster and hit it on the back',
                'You got the monster on the ground',
            ]
        },
        {
            name: 'Axe',
            emoji: '<:hatchet:1029069549892554792>',
            image: 'https://cdn.discordapp.com/emojis/1029069549892554792.webp',
            rank: 3,
            id: 2,
            price: 75,
            damage: {min: 8, max: 20},
            messages: [
                'You hit the monster on the right',
                'You hit the monster on the left',
                'You hit the monster on the head',
                'You hit the monster on the body',
                'You tackled the monster and hit it on the back',
                'You got the monster on the ground',
                'You hit the monster on the right',
                'You hit the monster on the left',
                'You tackled the monster and hit it on the back',
                'You got the monster on the ground',
            ]
        },
        {
            name: 'Wand',
            emoji: '<:wand:1029069551759015936>',
            image: 'https://cdn.discordapp.com/emojis/1029069551759015936.webp',
            rank: 4,
            id: 3,
            price: 125,
            damage: {min: 12, max: 30},
            messages: [
                'You paralyzed the monster',
                'You lifted the monster in the air',
                'You brainwashed the monster for some seconds',
                'You blinded the monster for some seconds',
                'You hit the monster on the right',
                'You casted an electric spell on the monster',
                'You froze the monster for some seconds',
                'You hit the monster on the left',
                'You hit the monster on the head',
                'You hit the monster on the body',
            ]
        },
    ]
}