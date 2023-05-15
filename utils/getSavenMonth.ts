export function getSavenMonth() {
  // 获取当前时间的 Date 对象
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); // 获取当前年份
  const currentMonth = currentDate.getMonth(); // 获取当前月份（0-11）

  const monthList = []; // 最近 7 个月的月份列表
  // 循环计算最近 7 个月的月份
  for (let i = 0; i < 7; i++) {
    const month = ((currentMonth - i + 12) % 12) + 1; // 计算当前月份减去 i 个月后的月份，加 12 是为了处理 0 月的情况
    let year = currentYear; // 计算当前月份减去 i 个月后的年份
    if (currentMonth - i < 0) {
      year = year - 1;
    }
    monthList.push(`${year}-${month.toString().padStart(2, '0')}`); // 将年份和月份格式化为字符串，并添加到月份列表中
  }

  return monthList;
}
