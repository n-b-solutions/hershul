export const isDateInactive = (selectedDate: Date, inactiveDates: any[]): boolean => {
  const selectedDateISO = selectedDate.toISOString().split('T')[0];

  return inactiveDates.some((element: any) => {
    const elementDate = new Date(element.date).toISOString().split('T')[0];
    return elementDate === selectedDateISO;
  });
};
