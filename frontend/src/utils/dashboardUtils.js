export const countByField = (items, field) => {
  const result = {};

  items.forEach((item) => {
    const key = item[field];

    if (!key) return;

    result[key] = (result[key] || 0) + 1;
  });

  return result;
};

export const countByMonth = (items) => {
  const result = {};

  items.forEach((item) => {
    if (!item.date) return;

    const month = item.date.slice(0, 7);

    result[month] = (result[month] || 0) + 1;
  });

  return result;
};

export const countByWeekday = (items) => {
  const result = {};

  items.forEach((item) => {
    if (!item.date) return;

    const weekday = new Date(item.date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    result[weekday] = (result[weekday] || 0) + 1;
  });

  return result;
};

export const getTopLabel = (data) => {
    const entries = Object.entries(data);

    if (entries.length === 0){
        return "N/A";
    }

    const topEntry = entries.reduce((max, current)=>{
        return current[1]>max[1] ? current: max;
    });

    return topEntry[0];
};
