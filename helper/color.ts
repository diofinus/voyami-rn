export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Adventure':
      return '#FF9A3D';
    case 'Food':
      return '#FF6B6B';
    case 'Culture':
      return '#7158e2';
    default:
      return '#53C6C6';
  }
};