const lvlground = []
for(let i=0;i<40;i++) lvlground.push({x:i,y:0,id:1})
for(let i=5;i<10;i++) lvlground.push({x:-i,y:0,id:1})
const lvllava = []
for(let i=1;i<5;i++) lvllava.push({x:-i,y:0,id:2})
const level = {
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
        {x:21,y:3}
    ],
    platform:[
        {x:6,y:6},
        {x:24,y:3}
    ]
}