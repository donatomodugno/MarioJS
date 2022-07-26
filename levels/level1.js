const lvlground = []
for(let i=0;i<80;i++) lvlground.push({x:i,y:0,id:1})
for(let i=5;i<10;i++) lvlground.push({x:-i,y:0,id:1})
const lvllava = []
for(let i=1;i<5;i++) lvllava.push({x:-i,y:0,id:2})
const level1 = {
    width:40,
    height:18,
    player:[
        {x:3,y:14}
    ],
    block:[
        ...lvlground,
        ...lvllava,
        {x:6,y:12},
        {x:21,y:1},
        {x:21,y:2},
        {x:21,y:3},
        {x:36,y:1,id:3,width:BLOCKSIZE*2},
        {x:36,y:2,id:3,width:BLOCKSIZE*2},
        {x:36,y:3,id:4,width:BLOCKSIZE*2},
        {x:58,y:1,id:3,width:BLOCKSIZE*2},
        {x:58,y:2,id:4,width:BLOCKSIZE*2}
    ],
    platform:[
        {x:6,y:6,n:6},
        {x:24,y:3,n:5}
    ],
    npc:[
        {x:9,y:10,id:1},
        {x:76,y:2,id:0},
        {x:16,y:2,id:1},
        {x:30,y:2,id:1}
    ]
}