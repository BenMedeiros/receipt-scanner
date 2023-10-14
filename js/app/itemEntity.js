'use strict';

let itemsMap = localStorage.getItem('itemsMap');
if (itemsMap) itemsMap = JSON.parse(itemsMap);
if (!itemsMap || typeof itemsMap !== 'object' || Array.isArray(itemsMap)) {
  itemsMap = {};
  // localStorage.setItem('itemsMap', JSON.stringify(itemsMap));
}

let items = Object.keys(itemsMap);

// consumes all receipts to recompile item info
// this is simpler than managing new/deletes
function updateAllData(receipts) {
  itemsMap = {};

  for (const receipt of receipts) {
    if (receipt.isDeleted) continue;

    for (const line of receipt.lines) {
      if (!itemsMap[line.item]) {
        itemsMap[line.item] = {total: 0, priceHistory: {}};
      }

      if (line.quantity > 0) itemsMap[line.item].total += line.quantity;
      if (receipt.date) itemsMap[line.item].priceHistory[receipt.date] = line.price;
    }
  }

  console.log(itemsMap);
  items.length = 0;
  items.push(...Object.keys(itemsMap));
  localStorage.setItem('itemsMap', JSON.stringify(itemsMap));
}

export default {
  items,
  updateAllData
}
