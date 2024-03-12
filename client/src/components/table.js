let table=[];
let tr=0;
for (let i = 0; i < 2; i++) {
    table.push([]);
  }
  while (tr < table.length) {
    if (tr === 0) {
      for (let td = 0; td < 10; td++) {
        table[tr].push(td+1);
      }
    } else {
      let prev = table[tr - 1];
      let prevlast = prev[prev.length - 1];
      for (let td = prevlast; td < prevlast + 10; td++) {
        table[tr].push(td+1);
      }
    }
  tr++;
  }
  export default table