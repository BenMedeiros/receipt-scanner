'use strict';

//format date object to be YYYY-MM-DD
export function formatDate(obj) {
  if (!obj) return null;
  if (obj instanceof Date) {
    return obj.getFullYear() + '-' + (obj.getMonth() + 1) + '-' + obj.getDate();
  } else if (typeof obj === 'string') {
    return obj.substring(0, 10);
  } else {
    throw new Error('Date field initial value must be Date or YYYY-MM-DD string.');
  }
}
