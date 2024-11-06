const obj = [
  { monsterId: 1, monsterNumber: 101 },
  { monsterId: 2, monsterNumber: 102 },
  { monsterId: 3, monsterNumber: 103 },
];


// for (let i of obj) {
//     if (i.monsterId === 2) {
//         console.log(i)
//         let splicedobj = obj.splice(i)
//         console.log(splicedobj)
//     }
// }

for (let i = 0;i < obj.length;i++) {
    if (obj[i].monsterId === 2) {
       obj.splice(i,1)
    }
}

console.log(obj)
// console.log(obj[0].monsterId)