const calcDefaultSortOrder = (sort?: string, by?: string, field?: string): 'descend' | 'ascend' | boolean => {
  if (!by || !sort || !field) {
    return false;
  }

  if (by === field) {
    if (sort === 'DESC') {
      return 'descend';
    }
    if (sort === 'ASC') {
      return 'ascend';
    }
  }

  return false;
};

export const tableUtil = {
  calcDefaultSortOrder,
};
