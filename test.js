String.prototype.timeFormat = function(formatString) {
  let formatted = this;
  formatted = new Date(formatted);
  let formatComponent = {
    "M+": formatted.getMonth() + 1,
    "d+": formatted.getDate(),
    "h+": formatted.getHours(),
    "m+": formatted.getMinutes(),
    "s+": formatted.getSeconds(),
    "q+": Math.floor((formatted.getMonth() + 3) / 3),
    S: formatted.getMilliseconds()
  };

  formatString = formatString.replace(/(y+)/, (_, _1) => {
    return ("" + formatted.getFullYear()).slice(4 - _1.length)
  });

  for (let index in formatComponent) {
    formatString = formatString.replace(
      new RegExp(`(${index})`),
      (_, _1) => {
        return _1.length === 1
          ? formatComponent[index]
          : ("00" + formatComponent[index]).slice(
            ("" + formatComponent[index]).length
          )
      }
    )
  }

  return formatString;
};

console.log("2023-09-13T07:06:30.802Z".timeFormat("hh:mm:ss"))
